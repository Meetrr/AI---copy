import express from 'express';

import { storeDataset } from '../controllers/storeDataset.controller.js';
import { getDataset } from '../controllers/getDataset.controller.js';
import { storeModels } from '../controllers/storeModels.controller.js';
import { getModels } from '../controllers/getModels.controller.js';
import { modelFiles } from '../controllers/modelFiles.controller.js';
import { allFilesFromFolder } from '../controllers/allFilesFromFolder.controller.js';
import { readFiles } from '../controllers/readFiles.controller.js';
import { inferVideo } from '../controllers/inferVideo.controller.js';

const router = express.Router();

router.post('/model', storeModels); // For storing model url:- /store/model
router.get('/model', getModels) // For getting model url:- /get/model
router.get('/modelFiles', modelFiles) // For getting files of models folder url:- /get/modelFiles
router.post('/allFilesFromFolder/:file', allFilesFromFolder) // For getting all files from Models folders selected by client the client url:- /get/allFilesFromFolder
// router.post('/readFiles/:file', readFiles) // For showing images and CSVs to the frontend url:- /get/readFiles
router.get('/readFile/:folder/:file', readFiles); // For reading file content url:- /get/readFile/:folder/:file


router.post('/infer_video', inferVideo); // For Video inference url:- /



router.post('/dataset', storeDataset); // For storing dataset For url:- /store/dataset
router.get('/dataset', getDataset) // For getting dataset For url:- /get/dataset



router.get('/', (req, res) => {
  res.send('storeLogs Router working');
});

export default router;