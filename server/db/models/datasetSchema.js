import mongoose from "mongoose";
const datasetSchema = new mongoose.Schema({
  dataset_name: { type: String, unique: true },
  config_file: String,
  train_imgs: String,
  valid_imgs: String,
  test_imgs: String,
  project_type: { type: String, enum: [ 'Object Detection', 'Instance Segmentation' ] }
});

const datasetModel = mongoose.model('dataset', datasetSchema);
export default datasetModel;