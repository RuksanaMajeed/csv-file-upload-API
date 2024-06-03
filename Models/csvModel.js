// models/CsvData.js
const mongoose = require("mongoose");

const csvDataSchema = new mongoose.Schema({});

const CsvData = mongoose.model('CsvData', csvDataSchema);

module.exports = CsvData;
