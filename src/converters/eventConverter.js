import SpotEvent from "@/models/spotEvent";
import categoryConverter from "@/converters/categoryConverter";
import authorConverter from "@/converters/authorConverter";
import coordinatesConverter from "@/converters/coordinatesConverter";

const eventConverter = {
    toFirestore: (event) => {
        return {
            title: event.title,
            category: categoryConverter.toFirestore(event.category),
            location: event.location,
            coordinates: coordinatesConverter.toFirestore(event.coordinates),
            date: event.date,
            duration: event.duration,
            description: event.description,
            totalSpots: event.totalSpots,
            author: authorConverter.toFirestore(event.author),
            allowReserves: event.allowReserves,
            participants: event.participants,
            availableImmediatelyForBooking: event.availableImmediatelyForBooking,
            minutesAvailableForBooking: event.computeMinutesForBookingSinceNow(),
            reserves: event.reserves,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);

        data.category = categoryConverter.init(data.category);
        data.author = authorConverter.init(data.author);
        data.coordinates = coordinatesConverter.init(data.coordinates)
        let event = new SpotEvent();
        event.id = snapshot.id
        Object.assign(event, data);

        return event;
    }
};

export default eventConverter