import Author from "@/models/author";

const authorConverter = {
    toFirestore: (data) => {
        return {
            id: data.id,
            displayName: data.displayName,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return this.init(data);
    },
    init: (data) => {
        return new Author(data.id, data.displayName)
    }
};

export default authorConverter