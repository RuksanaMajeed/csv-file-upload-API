// // upload.js
// const multer = require('multer');
// const csvProcessor = require('../Queue/Queue');
// const path = require('path');



// module.exports.uploadController = async (req, res) => {
// const upload = multer({ dest: 'uploads/' });

//     upload.single('file');
//     if (!req.file) {
//         return res.status(400).send({ message: 'No file uploaded' });
//       }
    
//       const filePath = path.join(__dirname, 'uploads', req.file.filename);
    
//       try {
//         // Add job to queue
//         await csvProcessor.add({ filePath });
//         res.status(200).send({ message: 'File uploaded and processing started' });
//       } catch (err) {
//         res.status(500).send({ message: 'Failed to process file' });
//       }
// }
// controllers/uploadController.js
const path = require('path');
const csvProcessor = require('../Queue/Queue');

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

  try {
    // Add job to queue
    await csvProcessor.add({ filePath });
    res.status(200).send({ message: 'File uploaded and processing started' });
  } catch (err) {
    res.status(500).send({ message: 'Failed to process file' });
  }
};
