import Category from "@/models/category";

const categoryConverter = {
    toFirestore: (data) => {
        return {
            id: data.id,
            icon: data.icon,
            name: data.name,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return this.init(data);
    },
    init: (data) => {
        return new Category(data.id, data.name, data.icon);
    }
};

export default categoryConverter