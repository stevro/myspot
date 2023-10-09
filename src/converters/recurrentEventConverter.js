import categoryConverter from "@/converters/categoryConverter";
import authorConverter from "@/converters/authorConverter";
import eventConverter from "@/converters/eventConverter";
import RecurrentSpotEvent, {ENDS_ON_FIXED_DATE} from "@/models/recurrentSpotEvent";

const recurrentEventConverter = {
    toFirestore: (event) => {


        event.computeEndDate()

        return Object.assign(eventConverter.toFirestore(event),
            {
                startDate: event.startDate,
                shortcut: event.shortcut,
                frequency: event.frequency,
                frequencyType: event.frequencyType,
                repeatOn: event.repeatOn,
                endsOn: event.endsOn,
                endingDate: event.endingDate,
                endingOccurrences: event.endingOccurrences,
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