import SpotEvent from "@/models/spotEvent";

export default class EventListItem {
    isVisible = true
    showDetails = false
    spotEvent = SpotEvent

    constructor(spotEvent, isVisible = true) {
        this.spotEvent = spotEvent
        this.isVisible = isVisible
    }

}