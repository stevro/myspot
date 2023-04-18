import categoryConverter from "@/converters/categoryConverter";
import authorConverter from "@/converters/authorConverter";
import eventConverter from "@/converters/eventConverter";
import RecurrentSpotEvent from "@/models/recurrentSpotEvent";

const recurrentEventConverter = {
    toFirestore: (event) => {


        return Object.assign(eventConverter.toFirestore(event),
            {
                startDate: event.startDate,
                shortcut: event.shortcut,
                frequency: event.frequency,
                frequencyType: event.frequencyType,
                repeatOn: event.repeatOn,
                endsOn: event.endsOn,
                endingDate: event.endsOn !== 0 ? event.endingDate : null,
                endingOccurrences: event.endsOn !== 0 ? event.endingOccurrences : null,
            })
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);

        data.category = categoryConverter.init(data.category);
        data.author = authorConverter.init(data.author);

        let recurrentSpotEvent = new RecurrentSpotEvent();
        recurrentSpotEvent.id = snapshot.id
        Object.assign(recurrentSpotEvent, data);

        return recurrentSpotEvent;
    }
};

export default recurrentEventConverter