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
    totalSpots = null
    author = Author
    allowReserves = true
    participants = []//refactor this to a subcollection
    reserves = []//refactor this to a subcollection
    minutesAvailableForBooking = null
    availableImmediatelyForBooking = true
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

    isFull() {
        if (this.allowReserves === true) {
            return false;
        }

        return this.bookedSpots() >= this.totalSpots;
    }

    addReserve(participant) {
        this.reserves.push(participant)
    }

    addParticipant(participant) {

        if (this.participants.length >= this.totalSpots) {
            if (false === this.allowReserves) {
                throw new Error('Maximum number of spots reached!')
            }

            this.addReserve(participant)
            return;
        }

        this.participants.push(participant)

        this.updatedAt = moment().format('YYYY-MM-DD HH:mm Z')
    }

    bookedSpots() {
        return this.participants.length + this.reserves.length
    }

    isParticipant(userId) {
        return this.participants.some(function (p) {
            return p.id === userId
        });
    }

    isReserve(userId) {
        return this.reserves.filter(function (p) {
            return p.id === userId
        }).length > 0;
    }

    hasBookedSpot(userId) {
        return this.isParticipant(userId) || this.isReserve(userId)
    }

    withdraw(userId) {
        this.participants = this.participants.filter(function (p) {
            return p.id !== userId
        })
        this.reserves = this.reserves.filter(function (p) {
            return p.id !== userId
        })

    }

    computeMinutesForBookingSinceNow() {
        if (!this.date) {
            return 0;
        }

        return moment(this.date).diff(moment(), 'minutes')
    }

    toString() {
        return this.title;
    }
}