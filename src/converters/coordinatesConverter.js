import Coordinates from "@/models/coordinates";


const coordinatesConverter = {
    toFirestore: (data) => {
        return {
            lat: data.lat,
            lng: data.lng,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return this.init(data);
    },
    init: (data) => {
        if(!data.lat || !data.lng){
            return null;
        }
        return new Coordinates(data.lat, data.lng)
    }
};

export default coordinatesConverter