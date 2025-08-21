const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();

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

router.post('/', upload.single('image'),async (req, res) => { 
    try{
        if(!req.file){
            return res.status(400).send('No file uploaded');
        }
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
    streamifier.createReadStream(fileBuffer).
    pipe(stream);
 });
}
//call the streamUpload function 
const result = await streamUpload(req.file.buffer);

        //respond with the uploaded file URL
        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;