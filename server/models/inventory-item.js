const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventoryItemSchema = new Schema({
    itemID: Number,
    itemName: String, 
    itemCategory: String,
    itemSubcategory: String,
    supplier: String,
    donatedFlag: String,
    purchaseDate: Date, 
    purchasePrice: Number,
    taxAndShippingPrice: Number,
    sellDate: Date, 
    sellPrice: Number,
    sellMethod: String
});

module.exports = mongoose.model("inventory-item", inventoryItemSchema, 'Inventory Items');