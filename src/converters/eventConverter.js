import SpotEvent from "@/models/spotEvent";
import categoryConverter from "@/converters/categoryConverter";
import authorConverter from "@/converters/authorConverter";

const eventConverter = {
    toFirestore: (event) => {

        return {
            title: event.title,
            category: categoryConverter.toFirestore(event.category),
            location: event.location,
            date: event.date,
            duration: event.duration,
            description: event.description,
            bookedSpots: event.bookedSpots,
            totalSpots: event.totalSpots,
            author: authorConverter.toFirestore(event.author),
            showDetails: event.showDetails,
            allowReserves: event.allowReserves,
            participants: event.participants
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);

        data.category = categoryConverter.init(data.category);
        data.author = authorConverter.init(data.author);

        let event = new SpotEvent();

        Object.assign(event, data);

        return event;
    }
};

export default eventConverter