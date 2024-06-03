import Bull from "bull";
import csv from "csv-parser"
import fs from "fs";
import CsvData from "../Models/csvModel";

const csvProcessor = new Bull('csvProcessor', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

csvProcessor.process(async (job) => {
  try {
    const results = [];
    fs.createReadStream(job.data.filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        await CsvData.insertMany(results);
        console.log('CSV file successfully processed');
        fs.unlinkSync(job.data.filePath); // Clean up the file after processing
      });
  } catch (err) {
    console.error('Error processing CSV:', err);
    throw err; // This will trigger a retry
  }
});

module.exports = csvProcessor;