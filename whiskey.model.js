const {Schema, model, Types, SchemaTypes} = require("mongoose");

var Whiskey = new Schema({
    name: SchemaTypes.String,
    distillery: SchemaTypes.String,
    age: SchemaTypes.Number,
    strength: SchemaTypes.Number,
    size: SchemaTypes.Number,
    price: SchemaTypes.Decimal128,
    country: SchemaTypes.String
});

module.exports = model("Whiskey", Whiskey);