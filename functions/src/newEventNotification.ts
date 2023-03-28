import * as functions from "firebase-functions";

const admin = require("firebase-admin");


exports.sendNewEventNotifications = functions.firestore.document("spot_events/{messageId}").onCreate(
  async (snapshot) => {
    // Notification details.
    const spotEvent = snapshot.data();
    const title = spotEvent.title;
    const text = spotEvent.description;
    const payload = {
      notification: {
        title: `${spotEvent.author.displayName} created '${title}'`,
        body: text ? (text.length <= 100 ? text : text.substring(0, 97) + "...") : "",
        // icon: snapshot.data().profilePicUrl || '/images/profile_placeholder.png',
        click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com`,
      },
    };

    // Get the list of device tokens.
    const allTokens = await admin.firestore().collection("fcm_tokens").get();
    const tokens: any[] = [];

    allTokens.forEach((tokenDoc) => {
      if (tokenDoc.data().userId !== spotEvent.author.id) {
        tokens.push(tokenDoc.id);
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
