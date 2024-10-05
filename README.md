# myspot
An app for booking a spot in a team / to an event / etc.

# To do for MVP
- [x] Authentication
- [x] Add new event
- [x] Show events list
- [x] Edit event
- [x] Delete event
- [x] Book spot/withdraw
- [x] Search events
- [x] Auto promote reserve to first team on withdrawal
- [x] Notify users about new event
- [x] Notify reserves about open spot 
- [x] Notify participants about deleted event 
- [x] Add minimum security on backend, e.g. check event author on update

# To do for v1
- [x] Allow searching on category/ownership
- [x] Allow searching on booked events
- [x] Show participants and reserves list to each event
- [ ] Create a landing page
- [x] Recurrent events
- [x] Create T&C and Privacy Policy pages
- [ ] Archive old events
- [ ] Share event on FB/Whatsapp
- [ ] Give user a feedback notification when booking from the "new event" notification, like booking successful or not
- [ ] Extend security on backend
- [x] Adding new categories (hiking, biking, climbing)
- [ ] Allow users to have a profile (displayName, phone, etc), and make it visible only to event authors
- [ ] Allow users to control if their contact details are visible to other participants(public) or just to events authors
- [ ] Comments section on the event to allow users to ask questions/share details
- [ ] Private events - Allow creation of events where you can grant acces based on invitation to registered users
- [ ] Invitation link - Allow the generation of an invitation link. (anyone with the invite link can view/book the event)

# To do for v2
- [ ] Show weather updates
- [ ] Reminder to all participants with X hours before the event
- [ ] Integration with AI platform to fetch cover images when sharing on FB
- [ ] Show directions to event place
- [ ] Teams. Create teams to register to your event and then let public only the remaining spots
- [ ] History of participants registration and withdrawal
- [x] Locations autocomplete with GMaps or ORS
- [ ] Allow booking spot from the new event notification

# Useful commands
- Set Node to v16 `nvm use v16`
- Start development env with `npm run dev`
- Start local emulators `firebase emulators:start --import ./local --export-on-exit`
- Running Scheduled Firebase Functions Locally `firebase functions:shell` then run your function `yourFunction()`


# Deploy
- `firebase deploy --only hosting`
- `firebase deploy --only functions`
