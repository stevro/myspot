import * as functions from "firebase-functions";
import {MessagingOptions, MessagingPayload} from "firebase-admin/lib/messaging/messaging-api";

const admin = require("firebase-admin");


exports.sendUpdatedEventNotifications = functions.region('europe-west3').firestore.document("spot_events/{messageId}").onUpdate(
    async (change) => {
        // Notification details.
        const spotEvent = change.after.data();
        const oldSpotEvent = change.before.data();

        let updates: any[] = [];

        if (spotEvent.date !== oldSpotEvent.date) {
            updates.push(`New date: ${spotEvent.date}`)
        }

        if (spotEvent.totalSpots !== oldSpotEvent.totalSpots) {
            updates.push(`Total spots: ${spotEvent.totalSpots}`)
        }

        if (spotEvent.allowReserves !== oldSpotEvent.allowReserves) {
            if (spotEvent.allowReserves) {
                updates.push("Is allowing reserves now")
            } else {
                updates.push("Reserves are not allowed anymore")
            }
        }

        if (spotEvent.participants.length === 0 || updates.length === 0) {
            functions.logger.log("No participants or no updates");
            return;
        }

        const title = spotEvent.title;
        const payload: MessagingPayload = {
            notification: {
                title: `${spotEvent.author.displayName} updated '${title}'`,
                body: updates.join(', '),
                // icon: snapshot.data().profilePicUrl || '/images/profile_placeholder.png',
                clickAction: `${process.env.APP_URL}`,
            },
            data: {
                action:'GO_TO_APP'
            }

            // topic: 'event-updated',
        };

        const options: MessagingOptions = {
            priority: 'high',
            contentAvailable: true,
        }

        // Get the list of device tokens.
        const allTokens = await admin.firestore().collection("fcm_tokens").get();
        const tokens: any[] = [];

        allTokens.forEach((tokenDoc) => {
            let tokenUserId = tokenDoc.data().userId;
            if (tokenUserId !== spotEvent.author.id) {

                if (true === spotEvent.participants.some(function (participant) {
                    return participant.id === tokenUserId
                })) {
                    tokens.push(tokenDoc.id);
                }

            }
        });

        if (tokens.length > 0) {
            // Send notifications to all tokens.
            const response = await admin.messaging().sendToDevice(tokens, payload, options);
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
