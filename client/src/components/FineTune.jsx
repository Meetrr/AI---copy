import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { SiAlwaysdata } from 'react-icons/si';
import swal from 'sweetalert';
import { InfinitySpin } from 'react-loader-spinner';

const FineTune = () => {

  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [sendModel, setSendModel] = useState({
    last_model: '',
    config_file: '',
    epochs: '',
    model_name: ''
  });

  useEffect(() => {
    const fetchModels = async () => {
      const response = await fetch(`${import.meta.env.VITE_FETCH_URL}/get/model`, {
        method: 'GET'
      });

      const data = await response.json();
      setModels(data);
    }
    fetchModels();
  }, []);

  const handleChange = (e) => {
    setSendModel({ ...sendModel, [e.target.name]: e.target.value });
  }

  const handleModelChange = (e) => {
    const selectedModelName = e.target.value;
    const selectedModel = models.find(model => model.model_name === selectedModelName);
    
    if ( selectedModel ) {
      setSendModel({
        ...sendModel,
        last_model: selectedModel.last_model_path,
        config_file: selectedModel.config_file,
        model_name: selectedModel.model_name
      });
    }
  }

  const sendModelsConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_FETCH_GPU_URL}/train_existing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendModel)
      });

      if ( response ) {
        const res = await response.json();
        console.log(res);
        setLoading(false);
        swal({ title: "Training Complete", icon: 'success' });
      } else {
        swal({ title: "Error occured", icon: 'error' });
      }
    } catch (err) {
      console.log('Error in FineTune:', err);
      setLoading(false);
      swal({ title: 'Error occurred', icon: 'error' });
    }
  }

  return (
    <main className="w-full h-full flex gap-2">
      <Sidebar />
      {!loading ? (
        <div id="container" className='h-screen w-full p-[1vw] flex flex-col items-center justify-center gap-5'>
          <table className="table-auto border-collapse">
            <tbody>
              <tr>
                <td className="px-4 py-2 font-bold text-lg">Model</td>
                <td className="px-4 py-2">
                  <select 
                    onChange={ handleModelChange }
                    className="border border-zinc-400 px-3 py-2 w-72 outline-none"
                  >
                    <option defaultValue='' selected disabled>--- Select ----</option>
                    {models.map((item, index) => (
                      <option key={index} value={item.model_name}>{item.model_name}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-lg">Epochs</td>
                <td className="px-4 py-2">
                  <input type="number" 
                    value={sendModel.epochs} 
                    onChange={handleChange}
                    min={1} 
                    max={1000} 
                    name='epochs' 
                    placeholder='Enter Epochs' 
                    className='border border-zinc-400 px-3 py-2 w-72 outline-none' 
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-lg">Model Name</td>
                <td className="px-4 py-2">
                  <input type="text" 
                    value={sendModel.model__name} 
                    onChange={handleChange}
                    name='model_name'
                    placeholder='Enter Model Name' 
                    className='border border-zinc-400 px-3 py-2 w-72 outline-none' 
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={sendModelsConfig} className='bg-lime-700 text-white text-lg font-semibold px-[.5vw] py-[1vh] rounded-[3px] flex items-center gap-[2px] hover:bg-lime-600 transition-all'>
            <i><SiAlwaysdata /></i> &nbsp;FineTune Model
          </button>
        </div>
      ) : (
        <div id="loader" className='w-full h-screen flex flex-col items-center justify-center'>
          <InfinitySpin
            visible={true}
            width="200"
            color="#007FFF"
            ariaLabel="infinity-spin-loading"
          />
          <span className='text-[1.2vw]'>Model training in progress. Please do not close or refresh this page!</span>
        </div>
      )}
      
    </main>
  )
}

export default FineTune;