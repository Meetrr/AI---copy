// =================================
//  ** Train Neural Network Model
// =================================

import { useState } from 'react'
import Sidebar from './Sidebar';

import { SiAlwaysdata } from "react-icons/si";
import swal from 'sweetalert';

import { InfinitySpin } from 'react-loader-spinner';

import ModelTrainingChart from './charts/ModelTrainingChart';
import SettingsConfig from './SettingsConfig';

const TrainModel = () => {

  const [loading, setLoading]= useState(false);
  const [isModelTrained, setModelTrained] = useState(false);
  const [trainingData, setTrainingData] = useState('');

  const [trainData, setTrainData] = useState({
    test_size: 0.2,
    num_words: 2000,
    glove_path: '/home/cetai/GitAI/glove.6B.100d.txt',
    dropout: 0.6,
    embedding_dim: 100,
    epochs: 20,
    batch_size: 32,
  });

  const handleTrainDataChange = (newTrainData) => {
    setTrainData(newTrainData);
  };

  // Start training model
  const trainnModel = () => {
    try {
      swal({
        title: "Are you sure?",
        text: "This will start training of your model!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then(async result => {
        if ( result ) {
          setLoading(true);
          await fetch(`${import.meta.env.VITE_FETCH_CENTOS_URL}/train`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainData)
          })
          .then(async res => await res.json())
          .then(data => setTrainingData(data))
          .then(() => setModelTrained(true))
          .then(() => setLoading(false))
        } else {
          swal("You cancelled the operation!");
        }
      });
    } catch (err) {
      console.log('Error while training model: ', err);
      swal('Server error', 'Try again', 'error');
      setLoading(false);
    }
  }

  return (
    <>
    <main className='flex h-full w-full'>
      <Sidebar/>
      <div id="page" className='w-full h-screen p-[1vw] '>
        {!isModelTrained && !loading ? (
          <div id="top" className='w-full h-full flex flex-col gap-[1.5vh] justify-center items-center '>

            <SettingsConfig onTrainDataChange={ handleTrainDataChange  } />

            <button onClick={ trainnModel } className='bg-lime-700 text-white font-semibold px-[.5vw] py-[1vh] rounded-[3px] flex items-center gap-[2px] hover:bg-lime-600 transition-all'>
              <i><SiAlwaysdata/></i>Train Model
            </button>
            <p className='font-semibold  text-[.9vw]'>This process will start training the model.
              <br />This may take some time. Please be patient.
            </p>
          </div> 
          ) : loading && (
          <div id="loader" className='w-full h-full flex flex-col items-center justify-center'>
            <InfinitySpin
              visible={true}
              width="200"
              color="#007FFF"
              ariaLabel="infinity-spin-loading"
            />
            <span className='text-[1.2vw]'>Model training in progress. Please do not close or refresh this page!</span>
          </div>
        )}
        {isModelTrained && (
          <ModelTrainingChart trainedData={ trainingData } />
        )}
      </div>
    </main>
    </>
  )
}

export default TrainModel;