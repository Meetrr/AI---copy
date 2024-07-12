import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
  model_name: String,
  model_path: String,
  base_model: String,
  config_file: String,
  precision: String,
  model_type: { type: String, enum: ['TensorRT', 'PyTorch'] },
  last_model_path: String,
  model_created_on: String,
  project_type: String,
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'dataset' },
});

const modelData = mongoose.model('model', modelSchema);
export default modelData;