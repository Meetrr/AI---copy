import 'chart.js/auto';
import { useState } from 'react';
import { Line } from "react-chartjs-2";

import PropTypes from 'prop-types';


const MetricsCharts = ({ chartsResponse, model }) => {
  // eslint-disable-next-line no-unused-vars
  const [chartData, setChartData] = useState(chartsResponse);
  console.log(model)

  const [fullScreenChart, setFullScreenChart] = useState(null);

  const createChartData = (label, yData) => {
    if (!yData || yData.length !== chartData.epochs.length) {
      return {
        labels: [],
        datasets: [],
      };
    }

    return {
      labels: chartData.epochs,
      datasets: [
        {
          label,
          data: chartData.epochs.map((epoch, index) => ({
            x: epoch,
            y: yData[index]
          })),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'blue',
          fill: false,
          lineTension: 0.2
        },
      ],
    };
  };

  const commonOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Epoch',
        },
      },
      y: {
        title: {
          display: true,
          text: title,
        },
      },
    },
  });

  const filteredCharts = [
    { data: createChartData('Train Box Loss', chartData.train_box_loss), options: commonOptions('Train Box Loss') },
    { data: createChartData('Train CLS Loss', chartData.train_cls_loss), options: commonOptions('Train CLS Loss') },
    { data: createChartData('Train DFL Loss', chartData.train_dfl_loss), options: commonOptions('Train DFL Loss') },
    { data: createChartData('Precision (B)', chartData.precision_b), options: commonOptions('Precision(B)') },
    { data: createChartData('Recall (B)', chartData.recall_b), options: commonOptions('Recall (B)') },
    { data: createChartData('Val Box Loss', chartData.val_box_loss), options: commonOptions('Val Box Loss') },
    { data: createChartData('Val CLS Loss', chartData.val_cls_loss), options: commonOptions('Val CLS Loss') },
    { data: createChartData('Val DFL Loss', chartData.val_dfl_loss), options: commonOptions('Val DFL Loss') },
    { data: createChartData('MAP50 (B)', chartData.map50_b), options: commonOptions('MAP50 (B)') },
    { data: createChartData('MAP50-95 (B)', chartData.map5095_b), options: commonOptions('MAP50-95 (B)') },
  ];

  const fullCharts = [
    { data: createChartData('Train Box Loss', chartData.train_box_loss), options: commonOptions('Train Box Loss') },
    { data: createChartData('Train Seg Loss', chartData.train_seg_loss), options: commonOptions('Train Seg Loss') },
    { data: createChartData('Train CLS Loss', chartData.train_cls_loss), options: commonOptions('Train CLS Loss') },
    { data: createChartData('Train DFL Loss', chartData.train_dfl_loss), options: commonOptions('Train DFL Loss') },
    { data: createChartData('Precision (B)', chartData.precision_b), options: commonOptions('Precision(B)') },
    { data: createChartData('Recall (B)', chartData.recall_b), options: commonOptions('Recall (B)') },
    { data: createChartData('Precision (M)', chartData.precision_m), options: commonOptions('Precision (M)') },
    { data: createChartData('Recall (M)', chartData.recall_m), options: commonOptions('Recall (M)') },
    { data: createChartData('Val Box Loss', chartData.val_box_loss), options: commonOptions('Val Box Loss') },
    { data: createChartData('Val Seg Loss', chartData.val_seg_loss), options: commonOptions('Val Seg Loss') },
    { data: createChartData('Val CLS Loss', chartData.val_cls_loss), options: commonOptions('Val CLS Loss') },
    { data: createChartData('Val DFL Loss', chartData.val_dfl_loss), options: commonOptions('Val DFL Loss') },
    { data: createChartData('MAP50 (B)', chartData.map50_b), options: commonOptions('MAP50 (B)') },
    { data: createChartData('MAP50-95 (B)', chartData.map5095_b), options: commonOptions('MAP50-95 (B)') },
    { data: createChartData('MAP50 (M)', chartData.map50_m), options: commonOptions('MAP50 (M)') },
    { data: createChartData('MAP50-95 (M)', chartData.map5095_m), options: commonOptions('MAP50-95 (M)') },
  ];

  const isFilteredSegment = !('train_seg_loss' in chartData) || chartData.train_seg_loss.length === 0;

  const chartsToDisplay = isFilteredSegment ? filteredCharts : fullCharts;

  const handleChartClick = (index) => {
    setFullScreenChart(index);
  };

  const handleFullScreenClose = () => {
    setFullScreenChart(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '2vw', maxHeight: '100%' }}>
        {chartsToDisplay.map((chart, index) => (
          <div
            key={index}
            style={{
              width: isFilteredSegment ? '15%' : '10%',
              height: '450px',
              transition: 'transform 0.2s ease-in-out',
              cursor: 'pointer'
            }}
            className="chart-container"
            onClick={() => handleChartClick(index)}
          >
            <Line data={chart.data} options={chart.options} />
          </div>
        ))}
      </div>
      {fullScreenChart !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={ handleFullScreenClose }
        >
          <div style={{ width: '80%', height: '80%' }}>
            <Line
              data={ chartsToDisplay[fullScreenChart].data }
              options={ chartsToDisplay[fullScreenChart].options }
            />
          </div>
        </div>
      )}
    </div>
  );
};

MetricsCharts.propTypes = {
  chartsResponse: PropTypes.any,
  model: PropTypes.any
}

export default MetricsCharts;