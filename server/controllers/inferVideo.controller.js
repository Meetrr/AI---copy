import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import modelData from "../db/models/modelsSchema.js";
import Ffmpeg from "fluent-ffmpeg";

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("E:\\1111111\\CETAI - Copy\\server\\uploads"))
  },
  filename: (req, file, cb) => {
    const uniquePrefix = crypto.randomBytes(15).toString('hex');
    const uniqueFileName = file.fieldname + '-' + uniquePrefix + path.extname(file.originalname);
    cb(null, uniqueFileName)
  }
});

const upload = multer({ storage: storage });

export const inferVideo = async (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err) return res.status(500).json({ message: 'Multer error uploading file' });

    try {
      const { model_name, conf } = req.body;
      const videoPath = req.file.path;

      console.log('Model Name:', model_name);
      console.log('Video Path:', videoPath);

      const models = await modelData.findOne({ model_name });

      const modelDetails = {
        mode_path: models.model_path,
        project_type: models.project_type,
        video_path: videoPath,
        conf: conf
      };
      return res.status(200).json({ mesage: 'Video stored', details: modelDetails});


    } catch (err) {
      console.log('Error in inferVideo.js controller:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
};

