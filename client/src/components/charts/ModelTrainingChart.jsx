// import  { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

import { IoTrashBin } from "react-icons/io5";
import swal from 'sweetalert';


const ModelTrainingChart = ({ trainedData }) => {
  Chart.register('linear');

  const discardModel = async () => {
    try {
      
      swal({
        title: "Are you sure?",
        text: "This will discard your model!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then(async result => {
        if ( result ) {
          await fetch(`${import.meta.env.VITE_FETCH_CENTOS_URL}/discard`, {
            method: 'GET',
          })
          .then(() => {
            swal({
              title: 'Model discarded successfully',
              icon: 'success',
              buttons: {
                confirm: {
                  text: 'OK',
                  value: true,
                  visible: true,
                  className: 'confirm-btn',
                  closeModal: true,
                },
              },
            })
            .then((value) => {
              if (value) {
                window.location.reload();
              }
            });
          })
        } else {
          swal("You cancelled the operation!");
        }
      });
  
    } catch (err) {
      console.log('Error while training model: ', err);
      swal('Server error', 'Try again', 'error');
    }
  }

  const data = {
    labels: Array.from({ length: trainedData.epochs }, (_, i) => i + 1), // Array of epochs from 1 to 20
    datasets: [
      {
        label: 'Accuracy',
        data: trainedData.accuracy.map(item => item),
        borderColor: 'blue',
        backgroundColor: 'transparent',
      },
      {
        label: 'Validation Accuracy',
        data: trainedData.val_accuracy.map(item => item),
        borderColor: 'green',
        backgroundColor: 'transparent',
      },
      {
        label: 'Loss',
        data: trainedData.loss.map(item => item),
        borderColor: 'red',
        backgroundColor: 'transparent',
      },
      {
        label: 'Validation Loss',
        data: trainedData.val_loss.map(item => item),
        borderColor: 'orange',
        backgroundColor: 'transparent',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Model Training Metrics',
      },
      pointLabels: {
        display: true, // Display point labels
      },
    },
  };
  

  return (
    <div className='w-[90%] ml-[5%] h-full flex flex-col items-center justify-center'>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <Line data={ data } options={options} />
        <button onClick={ discardModel } className=' mt-[1rem] bg-[#ff0000] flex gap-[.5vw] items-center p-[.6vw] rounded-[5px] text-[1.2vw] font-semibold text-white'>
          Discard <i><IoTrashBin/></i>
        </button>
      </div>
    </div>
  );
};

ModelTrainingChart.propTypes = {
  trainedData: PropTypes.object
}

export default ModelTrainingChart;