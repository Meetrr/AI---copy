import path from 'path';
import fs from 'fs';

export const readFiles = (req, res) => {
  const { folder, file } = req.params;
  const filePath = path.join(`E:\\1111111\\fileSys\\Models\\${folder}\\${file}`);

  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading file:', err });

    // Determine the file type and send appropriate response
    const fileExtension = path.extname(file).toLowerCase();
    if (fileExtension === '.csv') {
      res.type('text/csv').send(data);
    } else if (['.png', '.jpg', '.jpeg', '.gif'].includes(fileExtension)) {
      res.type('image/' + fileExtension.substring(1)).send(data);
    } else {
      res.status(400).json({ message: 'Unsupported file type' });
    }
  });
}
