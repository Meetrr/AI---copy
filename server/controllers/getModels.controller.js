import modelData from "../db/models/modelsSchema.js";

export const getModels = async (req, res) => {
  try {
    const models = await modelData.find();
    res.send(models);
  } catch (err) {
    console.log('Error in getModels controller:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}