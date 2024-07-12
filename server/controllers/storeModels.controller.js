import datasetModel from '../db/models/datasetSchema.js';
import modelData from '../db/models/modelsSchema.js';

export const storeModels = async (req, res) => {
  try {

    const { model_name, model_path, base_model, config_file, precision, model_type, last_model_path, model_created_on } = req.body;

    const dataset = await datasetModel.findOne({ config_file });

    if ( !dataset ) 
      return res.status(404).json({ message: 'Dataset Not Found' });

    const newModel = new modelData({ model_name, model_path, base_model, config_file, precision, model_type, last_model_path, model_created_on, datasetId: dataset._id });
    await newModel.save();
    return res.status(201).json({ message: 'Model logs added', newModel });

  } catch (err) {
    console.log('Error occured:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}