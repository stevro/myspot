import Category from "@/models/category";
import moment from "moment-timezone";
import Author from "@/models/author";


export default class SpotEvent {

    id = null
    title = ''
    category = Category
    location = ''
    coordinates = null
    date = null //timestamp in milliseconds
    timezone = null
    duration = null //minutes
    description = ''
    totalSpots = null
    author = Author
    allowReserves = true
    participants = []//refactor this to a subcollection
    reserves = []//refactor this to a subcollection
    minutesAvailableForBooking = null//Bookings start timeframe = Intervalul de incepere a rezervarilor, in minute
    availableImmediatelyForBooking = true
    createdAt = null
    updatedAt = null

    constructor(title = '', description = '', category) {
        this.title = title;
        this.description = description;
        this.category = category;
    }

    displayDate() {

        return moment(this.date).format('DD-MM-YYYY HH:mm Z')
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

        if(this.minutesAvailableForBooking){
            return this.minutesAvailableForBooking;
        }

        if (!this.date) {
            return 0;
        }

        return moment(this.date).diff(moment(), 'minutes')
    }

    displayTimeAvailableForBooking(){

        let duration = moment.duration(this.minutesAvailableForBooking, 'minute');

        let m = duration.minutes()
        let h = duration.hours()
        let d = duration.days()

        let txt = ''
        if(d > 0){
            txt += d + ' days '
        }
        if(h > 0){
            txt += h + ' hours '
        }
        if(m > 0){
            txt += m + ' minutes '
        }

        return txt;
    }

    isRecurring(){
        return false;
    }

    hasDatePassed(){
        return this.date < new Date().valueOf()
    }

    toString() {
        return this.title;
    }
}