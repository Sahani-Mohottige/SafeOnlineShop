const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();
const { body, validationResult } = require('express-validator');

require('dotenv').config();

//cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//Multer setup for file uploads
const storage = multer.memoryStorage();  //store the uploaded files in directly in the memory(RAM) 
const upload = multer({ storage: storage });

router.post(
    '/',
    upload.single('image'),
    [
        body('image').custom((value, { req }) => {
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            // Optionally check file type and size
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                throw new Error('Invalid file type');
            }
            if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
                throw new Error('File too large');
            }
            return true;
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            //function to upload file to cloudinary
            const streamUpload = (fileBuffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream((error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
                    //use streamifier to convert buffer to readable stream
                    streamifier.createReadStream(fileBuffer).pipe(stream);
                });
            };
            //call the streamUpload function 
            const result = await streamUpload(req.file.buffer);
            //respond with the uploaded file URL
            res.json({ imageUrl: result.secure_url });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router;