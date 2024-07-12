import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './db/connectDB.js';

import storeLogsRouter from './routes/storeLogs.routes.js';

dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(`E:\\1111111\\fileSys\\Models`));


app.use('/store', storeLogsRouter);
app.use('/get', storeLogsRouter);



app.get('/', async (req, res) => {
  res.send('Server.js working');
});

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0',() => {
  connectDB();
  console.log('Server is running on', PORT);
});