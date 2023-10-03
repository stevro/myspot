import SpotEvent from "@/models/spotEvent";
import moment from "moment";

export const ENDS_ON_FIXED_DATE = 'fixed_date';
export const ENDS_ON_X_OCCURRENCES = 'x_occurrences';

export default class RecurrentSpotEvent extends SpotEvent {


    shortcut = 'daily'
    frequency = 1
    frequencyType = 'day'
    repeatOn = [] //days of week. 0 -> Monday, 6 -> Sunday
    endsOn = ENDS_ON_X_OCCURRENCES
    startDate = null //should be identical with 'date' from SpotEvent
    endingDate = null
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

    __toString() {
        //in functie de ce e selectat formatam intr-un string util
        return "Repeats every week on Sunday at 10:00"
    }

    shortcutUpdated(){

        switch (this.shortcut){
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

        if(!frequencyType){
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
                }else if (this.endsOn === ENDS_ON_FIXED_DATE) {
                    this.endingDate = moment(this.startDate).add(30, 'days').format('YYYY-MM-DD')
                }

                this.repeatOn = [0, 1, 2, 3, 4, 5, 6]

                break;
            case 'week':

                if (this.endsOn === ENDS_ON_X_OCCURRENCES) {
                    this.endingOccurrences = 16
                }else if (this.endsOn === ENDS_ON_FIXED_DATE) {
                    this.endingDate = moment(this.startDate).add(16, 'weeks').format('YYYY-MM-DD')
                }

               this.repeatOn = [moment(this.startDate).isoWeekday()]

                break;
            case 'month':

                // this.frequencyType = 'month'
                if (this.endsOn === ENDS_ON_X_OCCURRENCES) {
                    this.endingOccurrences = 12
                }else if (this.endsOn === ENDS_ON_FIXED_DATE) {
                    this.endingDate = moment(this.startDate).add(12, 'months').format('YYYY-MM-DD')
                }
                this.repeatOn = []
                break;
            case 'year':

                if (this.endsOn === ENDS_ON_X_OCCURRENCES) {
                    this.endingOccurrences = 5
                }else if (this.endsOn === ENDS_ON_FIXED_DATE) {
                    this.endingDate = moment(this.startDate).add(5, 'years').format('YYYY-MM-DD')
                }
                this.repeatOn = []
                break;

        }

    }

    // computeMinutesForBooking() {
    //     if (!this.startDate) {
    //         return 0;
    //     }
    //
    //     return moment(this.startDate).diff(moment(), 'minutes')
    // }

}