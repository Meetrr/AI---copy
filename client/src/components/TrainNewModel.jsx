import { useEffect, useState } from 'react';
import { SiAlwaysdata } from "react-icons/si";
import Sidebar from "./Sidebar";
import swal from 'sweetalert';
import { InfinitySpin } from 'react-loader-spinner';
import MetricsCharts from './charts/MetricsCharts';
import PropTypes from 'prop-types';


import { IoMdCloseCircle } from "react-icons/io";


// Popup component for displaying full-screen chart
const PopupChart = ({ isOpen, closePopup, chartsResponse }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center w-full h-full">
          <div className="relative bg-white w-full h-full m overflow-auto">
            <button
              className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-900"
              onClick={closePopup}
            >
              <IoMdCloseCircle className='text-red-500 text-4xl' />
            </button>
            <MetricsCharts chartsResponse={chartsResponse} />
          </div>
        </div>
      )}
    </>
  );
};

const TrainNewModel = () => {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [datasetName, setDatasetName] = useState([]);
  const [models, setModels] = useState([]);
  const [chartsResponse, setChartsResponse] = useState();
  const [isTrainingComplete, setTrainingComplete] = useState(false);
  const [isModelSelectedTOShowDetials, setModelSelectToShowDetails] = useState(false);
  const [showModelDetails, setShowModelDetails] = useState([]);

  
  // eslint-disable-next-line no-unused-vars
  const [displayeChartOfDetails, setDisplayChartOfDetails] = useState(false);

  const [sendCnfigDB, setSendCnfigDB] = useState({
    base_model: '',
    dataset_name: '',
    epochs: '',
    model_name: '',
    config_file: ''
  });

  const [popupOpen, setPopupOpen] = useState(false); // State to control popup display

  const handleChange = (e) => {
    setSendCnfigDB({ ...sendCnfigDB, [e.target.name]: e.target.value });
  }

  // For fetching Datasets and Models from backend MongoDB
  useEffect(() => {
    const fetchDataset = async () => {
      const datasetResponse = await fetch(`${import.meta.env.VITE_FETCH_URL}/get/dataset`, {
        method: "GET",
      });
      const modelResponse = await fetch(`${ import.meta.env.VITE_FETCH_URL }/get/model`, {
        method: 'GET'
      });
      const datasets = await datasetResponse.json();
      const model = await modelResponse.json();
      setDatasetName(datasets);
      setModels(model)
    };
    fetchDataset();
  }, []);

  // For Fetching config_file automatically after selecting Dataset Name
  useEffect(() => {
    const selectedDataset = datasetName.find(dataset => dataset.dataset_name === sendCnfigDB.dataset_name);
    if (selectedDataset) {
      setSendCnfigDB(prevState => ({
        ...prevState,
        config_file: selectedDataset.config_file
      }));
    }
  }, [sendCnfigDB.dataset_name, datasetName]);

  const handleModelSelect = async (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    setModelSelectToShowDetails(true);

    try {
      const filteredModels = models.filter(model => {
        if (selectedValue === 'objectDetection') {
          return model.project_type === 'detect';
        } else if (selectedValue === 'instanceSegmentation') {
          return model.project_type === 'segment';
        }
        return false;
      });

      if (filteredModels.length > 0) {
        setShowModelDetails(filteredModels);
        console.log(selectedValue + " Models:", filteredModels.map(model => model));
      } else {
        setShowModelDetails(null);
        console.log(`No ${selectedValue} models found.`);
      }
    } catch (err) {
      console.log('Error handling model select:', err);
      swal({ title: 'Error occurred', icon: 'error' });
    }
  };

  const sendModelPathWithCSVext = async (modelPath) => {
    try {
      const weightIndex = modelPath.indexOf('weights');
      if (weightIndex !== -1) modelPath = modelPath.substring(0, weightIndex) + '\\results.csv';

      const response = await fetch(`${import.meta.env.VITE_FETCH_GPU_URL}/plot_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_data_path: modelPath })
      });
      const data = await response.json();
      // console.log(data);
      setChartsResponse(data);
      setDisplayChartOfDetails(true);
      setPopupOpen(true); // Open the popup after receiving the response
    } catch (err) {
      console.error('Error sendModelPathWithCSVext:', err);
      swal({ title: 'Error occurred', icon: 'error' });
    }
  }

  // Sending all configuration to backend
  const sendConfiguration = async () => {
    if (!selectedOption || !sendCnfigDB.base_model || !sendCnfigDB.config_file || !sendCnfigDB.dataset_name || !sendCnfigDB.epochs || !sendCnfigDB.model_name) {
      swal({ title: 'Enter all fields', icon: 'warning' });
    } else {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_FETCH_GPU_URL}/train_new`, {
          method: 'POST',
          headers: { "Content-Type": 'application/json' },
          body: JSON.stringify(sendCnfigDB)
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setChartsResponse(data);
          setLoading(false);
          setTrainingComplete(true);
          swal({ title: "Training Complete", icon: 'success' });
        } else {
          swal({ title: "Error occurred", icon: 'error' });
        }

      } catch (err) {
        console.log('Error sending configuration to backend:', err);
        setLoading(false);
        swal({ title: 'Error occurred', icon: 'error' });
      }
    }
  }

  // Close popup function
  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <main className="w-full h-full flex gap-2">
      <Sidebar />
      {!loading && !isTrainingComplete ? (
        <div id="container" className='h-screen w-full p-[1vw] flex items-center justify-center gap-5 overflow-hidden'>
          <div id="configuration_div" className='w-1/2 h-full shadow-xl flex flex-col items-center justify-center'>
            <table className="table-auto border-collapse ">
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-bold text-lg">Project Type</td>
                  <td className=" px-4 py-2">
                    <select className="border border-zinc-400 px-3 py-2 w-72 outline-none"
                      onChange={handleModelSelect}
                      value={selectedOption}
                    >
                      <option value="" disabled>--- Select ----</option>
                      <option value="objectDetection">Object Detection</option>
                      <option value="instanceSegmentation">Instance Segmentation</option>
                    </select>
                  </td>
                </tr>
                {selectedOption === 'objectDetection' && (
                  <tr>
                    <td className="px-4 py-2 font-bold text-lg">Base Model</td>
                    <td className=" px-4 py-2">
                      <select name="base_model" id="objectDetectionModel" className="border border-zinc-400 px-3 py-2 w-72 outline-none"
                        onChange={handleChange}
                        value={sendCnfigDB.base_model}
                        defaultValue='-- Select Base Model For OD --'
                      >
                        <option value='' disabled>-- Select Base Model For OD --</option>
                        <option value="yolov8n.pt">YoloV8n</option>
                        <option value="yolov8s.pt">YoloV8s</option>
                        <option value="yolov8m.pt">YoloV8m</option>
                      </select>
                    </td>
                  </tr>
                )}
                {selectedOption === 'instanceSegmentation' && (
                  <tr>
                    <td className="px-4 py-2 font-bold text-lg">Base Model</td>
                    <td className=" px-4 py-2">
                      <select name="base_model" id="instanceSegmentationModel" className="border border-zinc-400 px-3 py-2 w-72 outline-none"
                        onChange={handleChange}
                        value={sendCnfigDB.base_model}
                        defaultValue="-- Select Base Model For IS --"
                      >
                        <option value="" disabled>-- Select Base Model For IS --</option>
                        <option value="yolov8n-seg.pt">YoloV8n - seg</option>
                        <option value="yolov8s-seg.pt">YoloV8s - seg</option>
                        <option value="yolov8m-seg.pt">YoloV8m - seg</option>
                      </select>
                    </td>
                  </tr>
                )}
                {(selectedOption === 'objectDetection' || selectedOption === 'instanceSegmentation') && (
                  <>
                    <tr>
                      <td className="px-4 py-2 font-bold text-lg">Dataset</td>
                      <td className=" px-4 py-2">
                        <select name="dataset_name"
                          onChange={handleChange}
                          value={sendCnfigDB.dataset_name}
                          className='border border-zinc-400 px-3 py-2 w-72 outline-none'
                          defaultValue='--- Select Dataset ----'
                        >
                          <option value="" disabled>--- Select Dataset ----</option>
                          {datasetName.map((item, index) => (
                            <option key={index} value={item.dataset_name}>{item.dataset_name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-lg">Epochs</td>
                      <td className=" px-4 py-2">
                        <input type="number" min={1} max={1000} name='epochs' onChange={handleChange} placeholder='Enter Epochs' className='border border-zinc-400 px-3 py-2 w-72 outline-none' value={sendCnfigDB.epochs} />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-lg">Model Name</td>
                      <td className=" px-4 py-2">
                        <input type="text" name='model_name' onChange={handleChange} placeholder='Enter Model Name' className='border border-zinc-400 px-3 py-2 w-72 outline-none' value={sendCnfigDB.model_name} />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <button onClick={sendConfiguration} className='bg-lime-700 text-white font-semibold px-[.5vw] py-[1vh] rounded-[3px] flex items-center gap-[2px] hover:bg-lime-600 transition-all'>
              <i><SiAlwaysdata /></i>Train Model
            </button>
          </div>

          <div id="details_div" className='w-1/2 h-full shadow-2xl p-5 overflow-hidden overflow-y-scroll'>
            <h3 className='text-xl font-semibold'>Available Models</h3>
            <hr className='mt-3' />
            {isModelSelectedTOShowDetials ? (
              <div id='model_details' className='w-full h-auto mt-5 overflow-y-scroll flex flex-col  gap-3'>
                {showModelDetails.map((item, index) => {
                  return <div id="details" key={index} className='shadow-lg p-3 w-full flex items-center'>
                    <table className='flex flex-col w-full'>
                      <tbody>

                        <tr>
                          <th>Model Name: &nbsp;</th>
                          <td>{item.model_name}</td>
                        </tr>
                        <tr>
                          <th>Model Type: &nbsp;</th>
                          <td>{item.model_type}</td>
                        </tr>
                        <tr>
                          <th>Created on: &nbsp;</th>
                          <td>{item.model_created_on}</td>
                        </tr>
                      </tbody>
                    </table>
                    <button onClick={() => sendModelPathWithCSVext(item.model_path)} className='mr-3 bg-blue-500 h-max px-4 py-2 rounded text-white'>View</button>
                  </div>
                })}
              </div>

            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <span className='text-xl font-semibold capitalize'>Select a model view its details</span>
              </div>
            )}
          </div>

        </div>
      ) : loading ? (
        <div id="loader" className='w-full h-screen flex flex-col items-center justify-center'>
          <InfinitySpin
            visible={true}
            width="200"
            color="#007FFF"
            ariaLabel="infinity-spin-loading"
          />
          <span className='text-[1.2vw]'>Model training in progress. Please do not close or refresh this page!</span>
        </div>
      ) : isTrainingComplete ? (
        <MetricsCharts chartsResponse={chartsResponse} model={selectedOption} />
      ) : null}


      <PopupChart isOpen={popupOpen} closePopup={closePopup} chartsResponse={chartsResponse} />
    </main>
  );
}



// isOpen, closePopup, chartsResponse
PopupChart.propTypes = {
  isOpen: PropTypes.any,
  closePopup: PropTypes.any,
  chartsResponse: PropTypes.any
}

export default TrainNewModel;
