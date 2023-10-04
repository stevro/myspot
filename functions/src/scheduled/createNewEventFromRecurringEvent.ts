import * as functions from "firebase-functions";

const admin = require("firebase-admin");

exports.createNewEventFromRecurringEvent = functions.region('europe-west3').pubsub.schedule('every 24 hours').onRun(async (context) => {

    const recurrentEvents = await admin.firestore().collection("recurrent_events").get();

    functions.logger.debug('Found ' + recurrentEvents.size + ' recurrent events')

    if (recurrentEvents.empty) {
        functions.logger.info('No recurring events.')
        return null;
    }

    recurrentEvents.forEach((recurrentEvent) => {
        functions.logger.debug('Recurrent event id: ' + recurrentEvent.id);
        functions.logger.debug('Recurrent event title: ' + recurrentEvent.data().title);

        if(!isItTimeToCreateNewEvent(recurrentEvent)){

            functions.logger.log('Not yet time for this event')

            return;
        }

        functions.logger.log('Create new event')

    })

    return null;
});

function isItTimeToCreateNewEvent(recurrentEvent){

    //date and endingDate are a timestamp in milliseconds

    if(!recurrentEvent.data().endingDate){
        functions.logger.info('Event ' + recurrentEvent.id + ' has no ending date configured')
        return false;
    }

    functions.logger.info('Event ' + recurrentEvent.id + ' must end on ' + recurrentEvent.data().endingDate);

    return true;

}
