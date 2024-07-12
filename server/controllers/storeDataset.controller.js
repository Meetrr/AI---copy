export const storeDataset = async (req, res) => {
  try {
    const { dataset_name, config_file, train_imgs, valid_imgs, test_imgs, project_type } = req.body;

    const dataset = datasetModel.create({
      dataset_name,
      config_file,
      train_imgs,
      valid_imgs,
      test_imgs,
      project_type,
    });

    return res.status(201).json({ message: 'Dataset Added', dataset });
  } catch (err) {
    console.log(err);
  }
}