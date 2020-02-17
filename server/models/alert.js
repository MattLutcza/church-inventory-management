const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const alertSchema = new Schema({
    alertID: Number,
    alertTitle: String, 
    reminderQuantity: Number,
    appliesToItems: []
});

module.exports = mongoose.model("alert", alertSchema, 'alerts');