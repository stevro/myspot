import * as functions from "firebase-functions";

const admin = require("firebase-admin");


exports.promoteReserve = functions.firestore.document("spot_events/{messageId}").onUpdate(
  async (change) => {
    // Notification details.
    const spotEvent = change.after.data();

    if (spotEvent.participants.length >= spotEvent.totalSpots) {
      functions.logger.log("Fully booked");
      return;
    }

    if (spotEvent.reserves.length === 0) {
      functions.logger.log("No reserves");
      return;
    }

    const reserves = spotEvent.reserves;
    const firstReserve = reserves.shift();
    const participants = spotEvent.participants;
    participants.push(firstReserve);

    const title = spotEvent.title;
    const payload = {
      notification: {
        title: `Spot available at '${title}'`,
        body: "An open spot was automatically booked for you. Go to app and withdraw if you cannot make it anymore.",
        // icon: snapshot.data().profilePicUrl || '/images/profile_placeholder.png',
        click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com`,
      },
    };

    const tokens: any[] = [];
    // Get the list of device tokens.
    const allTokens = await admin.firestore().collection("fcm_tokens").where("userId", "==", firstReserve.id).get();

    allTokens.forEach((tokenDoc) => {
      tokens.push(tokenDoc.id);
    });

    if (tokens.length > 0) {
      // Send notifications to all tokens.
      const response = await admin.messaging().sendToDevice(tokens, payload);
      await cleanupTokens(response, tokens);
      functions.logger.log("Notifications have been sent and tokens cleaned up.");
    } else {
      functions.logger.log("No tokens found.");
    }

    return change.after.ref.set({
      participants: participants,
      reserves: reserves,
    }, {merge: true});
  });

// Cleans up the tokens that are no longer valid.
function cleanupTokens(response: { results: any[]; }, tokens: any[]) {
  // For each notification we check if there was an error.
  const tokensDelete: any[] = [];
  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      functions.logger.error("Failure sending notification to", tokens[index], error);
      // Cleanup the tokens that are not registered anymore.
      if (error.code === "messaging/invalid-registration-token" ||
                error.code === "messaging/registration-token-not-registered") {
        const deleteTask = admin.firestore().collection("fcm_tokens").doc(tokens[index]).delete();
        tokensDelete.push(deleteTask);
      }
    }
  });
  return Promise.all(tokensDelete);
}
