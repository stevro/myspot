const eventConverter = {
    toFirestore: (event) => {
        return {
            title: event.title,
            category: event.category,
            location: event.location,
            coordinates: event.coordinates,
            date: event.date,
            duration: event.duration,
            description: event.description,
            totalSpots: event.totalSpots,
            author: event.author,
            allowReserves: event.allowReserves,
            participants: event.participants,
            minutesAvailableForBooking: event.minutesAvailableForBooking,
            reserves: event.reserves,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        };
    },

};

export default eventConverter