import SpotEvent from "@/models/spotEvent";


export default class RepeatableSpotEvent extends SpotEvent {

    shortcut = 'daily'
    frequency = 1
    frequencyType = 'day'
    repeatOn = [] //days of week. 0 -> Monday, 6 -> Sunday
    endsOn = 0 //0 - never, 1 - fixed ending Date, 2 - after X occurrences
    endingDate = null
    endingOccurrences = null
    startDate = null


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


    setFrequencyFromShortcut(shortcut, selectedDate){

        this.startDate = selectedDate

        switch (shortcut){
            case 'daily':
                this.frequency = 1
                this.frequencyType = 'day'
                break;
            case 'weekly':
                this.frequency = 1
                this.frequencyType = 'week'
                break;
            case 'monthly':
                this.frequency = 1
                this.frequencyType = 'month'
                break;
            case 'annually':
                this.frequency = 1
                this.frequencyType = 'year'
                break;

        }
    }

}