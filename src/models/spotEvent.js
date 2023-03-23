import Category from "@/models/category";
import moment from "moment";
import Author from "@/models/author";

export default class SpotEvent {

    id = null
    title = ''
    category = Category
    location = ''
    date = null
    duration = null
    description = ''
    bookedSpots = 0
    totalSpots = null
    author = Author
    allowReserves = true
    participants = []
    createdAt = null
    updatedAt = null

    constructor(title = '', description = '', category) {
        this.title = title;
        this.description = description;
        this.category = category;
    }

    displayDate() {
        return moment(this.date).format('DD-MM-YYYY HH:mm')
    }

    isAuthor(userId) {
        if (!this.author || !this.author.id) {
            return false;
        }

        return userId === this.author.id;
    }

    toString() {
        return this.title;
    }
}