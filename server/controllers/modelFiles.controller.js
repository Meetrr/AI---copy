import path from 'path';
import fs from 'fs';

export const modelFiles = async (req, res) => {

  const dirpath = path.join('E:\\1111111\\fileSys\\Models');

  try {
    fs.readdir(dirpath, (err, files) => {
      if ( err ) console.log('Error fetching files:', err);

      res.send(files);
    });
  } catch (err) {
    console.log('Error in modelFile controller:', err);
    return res.status(500).sjon({ message: 'Internal server error' });
  }
}