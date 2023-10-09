
const admin = require("firebase-admin");
admin.initializeApp();

const newEventNotification = require('./newEventNotification')
const deletedEventNotification = require('./deletedEventNotification')
const updatedEventNotification = require('./updatedEventNotification')
const promoteReserve = require('./promoteReserve')
const createNewEventFromRecurringEvent = require('./scheduled/createNewEventFromRecurringEvent')

exports.sendNewEventNotifications = newEventNotification.sendNewEventNotifications;
exports.sendDeletedEventNotifications = deletedEventNotification.sendDeletedEventNotifications;
exports.sendUpdatedEventNotifications = updatedEventNotification.sendUpdatedEventNotifications;
exports.promoteReserve = promoteReserve.promoteReserve;
exports.createNewEventFromRecurringEvent = createNewEventFromRecurringEvent.createNewEventFromRecurringEvent;