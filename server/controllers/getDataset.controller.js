import datasetModel from "../db/models/datasetSchema.js";

export const getDataset = async (req, res) => {
  try {
    const datasets = await datasetModel.find();
    res.send(datasets);
  } catch (err) {
    console.log('Error in getDataset controller');
    return res.status(500).json({ message: 'Internal server error' });
  }
}