 /**
* CSCI2720/ESTR2106 Course Project
* A Social Map of Events
*
* We declare that the assignment here submitted is original
* except for source material explicitly acknowledged,
* and that the same or closely related material has not been
* previously submitted for another course.
* We also acknowledge that we are aware of University policy and
* regulations on honesty in academic work, and of the disciplinary
* guidelines and procedures applicable to breaches of such
* policy and regulations, as contained in the website.
*
* University Guideline on Academic Honesty:
*   http://www.cuhk.edu.hk/policy/academichonesty
* Faculty of Engineering Guidelines to Academic Honesty:
*   https://www.erg.cuhk.edu.hk/erg/AcademicHonesty
*
* Student Name: Chow Pak Ho, Kwok Ho Cheung, Lai Chak Yan, Leung Wai Pan, Mak Tsz Ho
* Student ID  : 1155144753,1155136168,1155144577,1155144757,1155141820
* Date        : 17/12/2022
*/ 
const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    eventId: {type: Number, required: true, unique: true},
    title: {type: String, required: true},
    datetime: {type: String, required: true},
    description: {type: String, required: true},
    venue: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
    presenter: {type: String, required: true},
    price: {type: String, required: true},
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;