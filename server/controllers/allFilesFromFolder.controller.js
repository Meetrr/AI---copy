import path from 'path';
import fs from 'fs';

export const allFilesFromFolder = async (req, res) => {
  const file = req.params;
  const dirPath = path.join(`E:\\1111111\\fileSys\\Models\\${file.file}`)
  fs.readdir(dirPath, (err, files) => {
    if ( err ) return res.status(500).json({ message: 'Error in allFilesFromFolder controller:', err });
 
    const allowedExtensions = ['.csv', '.jpg', '.jpeg', '.png'];
    const filteredFiles = files.filter(file => allowedExtensions.includes(path.extname(file).toLowerCase()));

    res.send(filteredFiles);
  });
}