import * as functions from "firebase-functions";
import {Rule} from "../plugin/rschedule"
import {RuleOption} from "@rschedule/core";
import eventConverter from "../converters/eventConverter";

const admin = require("firebase-admin");

let now: number;

exports.createNewEventFromRecurringEvent = functions.region('europe-west3').pubsub.schedule('* * * * *').onRun(async (context) => {

    // let d = new Date('2023-10-15 17:00')
    let d = new Date()
    now = d.valueOf()

    functions.logger.debug('Now is: ' + d.toISOString())
    functions.logger.debug('Now timestamp: ' + now)

    const recurrentEvents = await admin.firestore().collection("recurrent_events").get();

    functions.logger.debug('Found ' + recurrentEvents.size + ' recurrent events')

    if (recurrentEvents.empty) {
        functions.logger.info('No recurring events.')
        return null;
    }

    recurrentEvents.forEach((recurrentEvent) => {
        functions.logger.debug('Recurrent event id: ' + recurrentEvent.id);
        functions.logger.debug('Recurrent event title: ' + recurrentEvent.data().title);

        let nextDate;
        if (false === (nextDate = isItTimeToCreateNewEvent(recurrentEvent))) {

            functions.logger.log('Not yet time for this event')

            return;
        }

        functions.logger.log('Create new event')
        createNewEvent(recurrentEvent, nextDate)

    })

    return null;
});

async function isEventAlreadyCreated(nextSpotEvent) {

    const existingEvents = await admin.firestore().collection("spot_events").where('author.id', '==', nextSpotEvent.author.id).where('date', '==', nextSpotEvent.date).where('category.id', '==', nextSpotEvent.category.id).limit(1).get();


    if(existingEvents.empty){
        return false
    }

    existingEvents.forEach((doc) => {
        functions.logger.info('This event has already been added. Skip creating a new one.')
        functions.logger.info('Found event ID: ' + doc.id)
        functions.logger.debug('Found event data')
        functions.logger.debug( doc.data())
    });

    return true

}

async function createNewEvent(recurrentEvent, nextDate) {

    let nextSpotEvent = recurrentEvent.data()
    nextSpotEvent.date = nextDate

    if (await isEventAlreadyCreated(nextSpotEvent)) {

        return false
    }

    admin.firestore().collection('spot_events').withConverter(eventConverter).add(nextSpotEvent).then(docRef => {
        functions.logger.info('Created new event with ID: ' + docRef.id)
    });

    return true;

}

function isItTimeToCreateNewEvent(recurrentEvent) {

    let data = recurrentEvent.data()
    //date and endingDate are a timestamp in milliseconds
    functions.logger.info(data);

    if (!data.endingDate) {
        functions.logger.error('Event ' + recurrentEvent.id + ' has no ending date configured')

        return false;
    }


    if (now > data.endingDate) {
        functions.logger.info('Event ' + recurrentEvent.id + ' ending date has passed')
        return false;
    }

    let nextDate = nextEventScheduledDate(data);

    if ((now + data.minutesAvailableForBooking * 60000) === nextDate) {
        return nextDate
    }

    return false
}

function nextEventScheduledDate(data) {

    let nextEventDate = null;

    let frequency: RuleOption.Frequency;
    switch (data.frequencyType) {
        case 'day':
            frequency = 'DAILY';
            break;
        case 'month':
            frequency = 'MONTHLY';
            break;
        case 'year':
            frequency = 'YEARLY';
            break;
        case 'week':
        default:
            frequency = 'WEEKLY';
            break;
    }

    let weekdays: [] = []

    if (Array.isArray(data.repeatOn)) {
        weekdays = data.repeatOn.map(function (repeatOn) {
            switch (repeatOn) {
                case 1:
                    return 'MO';
                case 2:
                    return 'TU';
                case 3:
                    return 'WE';
                case 4:
                    return 'TH';
                case 5:
                    return 'FR';
                case 6:
                    return 'SA';
                case 7:
                    return 'SU';
                default:
                    return null
            }
        })
    }

    let duration: RuleOption.Duration = data.duration * 60000

    let startDate = new Date(data.startDate);

    const rule = new Rule({
        frequency: frequency,
        byDayOfWeek: weekdays,
        start: startDate,
        end: new Date(data.endingDate),
        duration: duration
    });


    for (const date of rule.occurrences()) {

        if (date.valueOf() >= now) {
            functions.logger.info("This is the next date for creating an event");
            functions.logger.info(date.toDateTime().toJSON())
            return date.valueOf();
        }

    }


    return nextEventDate
}

