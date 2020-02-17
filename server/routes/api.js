const express = require('express');
const router = express.Router();

// Connect to MongoDB
const database = 'mongodb+srv://inventoryApp:ug91onRK8Y7Guiqc@inventorycluster-s1e6m.mongodb.net/InventoryApplicationDB?retryWrites=true&w=majority';
const connectionOptions = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};
const mongoose = require('mongoose');
mongoose.connect(database, connectionOptions, function(err) {
    if (err) {
        console.log("Error connecting to mongoDB!");
        console.log(`Error: ${err}`);
    }
});

const Alert = require('../models/alert');
const InventoryItem = require('../models/inventory-item');

// Route for retrieving all alerts
router.get('/alerts', (request, response) => {
    // Retrieve all alerts
    Alert.find({}).exec((err, alerts) => {
        if (err) {
            response.status(500).send(err);
        } else {
            response.json(alerts);
        }
    });
});

// Route for adding or editing an alert
router.put('alerts', (request, response) => {
    // TODO: Validate fields

    // Find alert based on ID
    Alert.findOneAndUpdate({
        alertID: request.body.alertID
    },
    // Update with new values
    {
        alertID: request.body.alertID,
        alertName: request.body.alertName,
        reminderQuantity: request.body.reminderQuantity,
        appliesToItems: request.body.appliesToItems
    },
    // Insert if it doesn't exist
    {
        upsert: true
    },
    function(err, alert) {
        if (err) {
            response.send(500, {error: err});
        } else {
            response.send(201);
        }
    });
});

// Route for deleting an alert
router.delete('alerts', (request, response) => {
    Alert.findOneAndDelete({
        alertID: request.body.alertID
    }, function(err, alert) {
        if (err) {
            response.send(500, {error: err});
        } else {
            response.send(204);
        }
    });
});

// Route for retrieving all inventory items
router.get('/inventory-items', (request, response) => {
    InventoryItem.find({}).exec((err, inventoryItems) => {
        if (err) {
            response.status(500).send(err);
        } else {
            response.json(inventoryItems);
        }
    });

});

// Route for adding inventory items
router.put('/inventory-items', (request, response) => {

    // TODO: Validate Items
    let success = true;
    const items = request.body;
    items.forEach(item => {
        const inventoryItem = new InventoryItem();
        inventoryItem.itemID = item.id;
        inventoryItem.itemName = item.name;
        inventoryItem.save((err, updatedItem) => {
            if (err) {
                success = false;
            } 
        });
    });

    if (success) {
        response.status(201).send();
    } else {
        response.status(500).send();
    }
    
});

// Route for deleting inventory items
router.delete('inventory-items', (request, response) => {

});





module.exports = router;