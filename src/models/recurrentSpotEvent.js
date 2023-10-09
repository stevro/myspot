import SpotEvent from "@/models/spotEvent";
import moment from "moment";
import business from 'moment-business';

export const ENDS_ON_FIXED_DATE = 'fixed_date';
export const ENDS_ON_X_OCCURRENCES = 'x_occurrences';

export default class RecurrentSpotEvent extends SpotEvent {


    shortcut = 'daily'
    frequency = 1
    frequencyType = 'day'
    repeatOn = [] //days of week. 1 -> Monday, 7-> Sunday
    endsOn = ENDS_ON_X_OCCURRENCES
    startDate = null //should be identical with 'date' from SpotEvent - timestamp in milliseconds
    endingDate = null //timestamp in milliseconds
    endingOccurrences = 30


    static shortcuts() {
        return [
            {
                value: 'daily',
                title: "Daily",
            },
            {
                value: 'weekly',
                title: "Weekly",
            },
            {
                value: 'monthly',
                title: "Monthly",
            },
            {
                value: 'annually',
                title: "Annually",
            },
            {
                value: 'every_weekday',
                title: "Every Weekday (Mon-Fri)",
            },


        ];
    }

    static frequencies() {
        return [
            {
                value: 'day',
                title: "Day",
            },
            {
                value: 'week',
                title: "Week",
            },
            {
                value: 'month',
                title: "Month",
            },
            {
                value: 'year',
                title: "Year",
            }
        ]
    }

    displayFrequency() {
        let $this = this;
        let txt = "Repeats" + " " + RecurrentSpotEvent.shortcuts().filter(function (shortcut) {
            return shortcut.value === $this.shortcut
        }).pop().title.toLowerCase()


        switch (this.shortcut) {
            case 'daily':

                break;
            case 'weekly':
                txt += " on " + moment(this.startDate).format('dddd') + " at " + moment(this.startDate).format('HH:mm');
                break;
            case 'monthly':
                txt += " on " + moment(this.startDate).format('Do') + " at " + moment(this.startDate).format('HH:mm');
                break;
            case 'annually':
                txt += " on " + moment(this.startDate).format('Do MMM') + " at " + moment(this.startDate).format('HH:mm');
                break;
            case 'every_weekday':
                txt += " at " + moment(this.startDate).format('HH:mm');
                break;
        }

        txt += " until "  + moment(this.endingDate).format('DD-MM-YYYY')

        return txt
    }

    computeEndDate() {
        if (this.endsOn === ENDS_ON_FIXED_DATE) {
            return this.endingDate
        }

        switch (this.shortcut) {
            case 'daily':
                this.endingDate = moment(this.startDate).add(this.endingOccurrences-1, 'days').valueOf()
                break;
            case 'weekly':
                this.endingDate = moment(this.startDate).add(this.endingOccurrences, 'weeks').valueOf()
                break;
            case 'monthly':
                this.endingDate = moment(this.startDate).add(this.endingOccurrences, 'months').valueOf()
                break;
            case 'annually':
                this.endingDate = moment(this.startDate).add(this.endingOccurrences, 'years').valueOf()
                break;
            case 'every_weekday':

                //This library uses inclusive start, exclusive end intervals. What this means is that the start day is included in the result, but the end day is not.
                this.endingDate = business.addWeekDays(moment(this.startDate), this.endingOccurrences-1).valueOf()
                break;

        }

        return this.endingDate;
    }

    shortcutUpdated() {

        switch (this.shortcut) {
            case 'daily':
                this.frequencyType = 'day';
                break;
            case 'weekly':
                this.frequencyType = 'week';
                break;
            case 'monthly':
                this.frequencyType = 'month';
                break;
            case 'annually':
                this.frequencyType = 'year';
                break;
            case 'every_weekday':
                this.frequencyType = 'day';
                break;
        }

        this.applyDefaultFrequencyType(this.frequencyType)
    }

    applyDefaultFrequencyType(frequencyType, selectedDate) {

        if (!frequencyType) {
            console.error('You must pass a frequency type to applyDefaultFrequencyType');
        }

        this.startDate = selectedDate ? selectedDate : this.date

        if (!this.startDate) {
            return
        }

        this.endingOccurrences = null
        this.endingDate = null

        switch (frequencyType) {
            case 'day':

                if (this.endsOn === ENDS_ON_X_OCCURRENCES) {
                    this.endingOccurrences = 30
                } else if (this.endsOn === ENDS_ON_FIXED_DATE) {
                    this.endingDate = moment(this.startDate).add(30, 'days').valueOf()
                }

                this.repeatOn = [0, 1, 2, 3, 4, 5, 6]

                break;
            case 'week':

                if (this.endsOn === ENDS_ON_X_OCCURRENCES) {
                    this.endingOccurrences = 16
                } else if (this.endsOn === ENDS_ON_FIXED_DATE) {
                    this.endingDate = moment(this.startDate).add(16, 'weeks').valueOf()
                }

                this.repeatOn = [moment(this.startDate).isoWeekday()]

                break;
            case 'month':

                // this.frequencyType = 'month'
                if (this.endsOn === ENDS_ON_X_OCCURRENCES) {
                    this.endingOccurrences = 12
                } else if (this.endsOn === ENDS_ON_FIXED_DATE) {
                    this.endingDate = moment(this.startDate).add(12, 'months').valueOf()
                }
                this.repeatOn = []
                break;
            case 'year':

                if (this.endsOn === ENDS_ON_X_OCCURRENCES) {
                    this.endingOccurrences = 5
                } else if (this.endsOn === ENDS_ON_FIXED_DATE) {
                    this.endingDate = moment(this.startDate).add(5, 'years').valueOf()
                }
                this.repeatOn = []
                break;

        }

    }

    isRecurring() {
        return true;
    }


}