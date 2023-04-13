import SpotEvent from "@/models/spotEvent";
import moment from "moment";


export default class RepeatableSpotEvent extends SpotEvent {

    shortcut = 'daily'
    frequency = 1
    frequencyType = 'day'
    repeatOn = [] //days of week. 0 -> Monday, 6 -> Sunday
    endsOn = 0 //0 - never, 1 - fixed ending Date, 2 - after X occurrences
    endingDate = null
    endingOccurrences = null


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
                title: "Every Weekday",
            },
            {
                value: 'custom',
                title: "Custom",
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

    applyDefaultFrequencyType(frequencyType, selectedDate) {

        this.startDate = selectedDate ? selectedDate : this.date

        if (!this.startDate) {
            return
        }

        switch (frequencyType) {
            case 'day':

                if (this.endsOn !== 2) {
                    this.endingOccurrences = 30
                }
                if (this.endsOn !== 1) {
                    this.endingDate = moment( this.startDate).add(30, 'days').format('YYYY-MM-DD')
                }

                if (!this.repeatOn) {
                    this.repeatOn = [0, 1, 2, 3, 4, 5, 6]
                }
                break;
            case 'week':

                if (this.endsOn !== 2) {
                    this.endingOccurrences = 16
                }
                if (this.endsOn !== 1) {
                    this.endingDate = moment( this.startDate).add(16, 'weeks').format('YYYY-MM-DD')
                }
                if (!this.repeatOn) {
                    this.repeatOn = [moment( this.startDate).isoWeekday()]
                }
                break;
            case 'month':

                // this.frequencyType = 'month'
                if (this.endsOn !== 2) {
                    this.endingOccurrences = 12
                }
                if (this.endsOn !== 1) {
                    this.endingDate = moment( this.startDate).add(12, 'months').format('YYYY-MM-DD')
                }
                this.repeatOn = []
                break;
            case 'year':

                if (this.endsOn !== 2) {
                    this.endingOccurrences = 5
                }
                if (this.endsOn !== 1) {
                    this.endingDate = moment( this.startDate).add(5, 'years').format('YYYY-MM-DD')
                }
                this.repeatOn = []
                break;

        }
        console.log(this.endingDate);
    }

}