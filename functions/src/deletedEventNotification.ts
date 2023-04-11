import * as functions from "firebase-functions";

const admin = require("firebase-admin");

exports.sendDeletedEventNotifications = functions.firestore.document("spot_events/{messageId}").onDelete(
  async (snapshot) => {
    // Notification details.
    const spotEvent = snapshot.data();

    if (spotEvent.participants.length === 0) {
      functions.logger.log("No participants");
      return;
    }

    const title = spotEvent.title;
    const payload = {
      notification: {
        title: `${spotEvent.author.displayName} deleted '${title}'`,
        body: "",
        // icon: snapshot.data().profilePicUrl || '/images/profile_placeholder.png',
        click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com`,
      },
    };

    // Get the list of device tokens.
    const allTokens = await admin.firestore().collection("fcm_tokens").get();
    const tokens: any[] = [];

    allTokens.forEach((tokenDoc) => {
      const tokenUserId = tokenDoc.data().userId;
      if (tokenUserId !== spotEvent.author.id) {
        if (true === isParticipant(spotEvent, tokenUserId)) {
          tokens.push(tokenDoc.id);
        }
      }
    });

    if (tokens.length > 0) {
      // Send notifications to all tokens.
      const response = await admin.messaging().sendToDevice(tokens, payload);
      await cleanupTokens(response, tokens);
      functions.logger.log("Notifications have been sent and tokens cleaned up.");
    } else {
      functions.logger.log("No tokens found.");
    }
  });

function isParticipant(spotEvent, userId) {
  const isParticipant = spotEvent.participants.some(function(participant) {
    return participant.id === userId;
  });
  const isReserve = spotEvent.reserves.some(function(reserve) {
    return reserve.id === userId;
  });

  return isParticipant || isReserve;
}

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
