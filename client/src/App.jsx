
import './App.css';

import { BrowserRouter as Router,  Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import TrainModel from './components/TrainModel';
import ModelTrainingChart from './components/charts/ModelTrainingChart';
import Login from './components/Login';
import TrainNewModel from './components/TrainNewModel';
import FineTune from './components/FineTune';
import ModelDetails from './components/ModelDetails';
import ImgInference from './components/ImgInference';
import VidInference from './components/VidInference';


const App = () => {

  return (
    <>
    <main id="App" className='min-h-screen'>

      <Router>
        <div>
          <Routes>
            <Route path='/' element={ <Login/> } />
            <Route path='/home' element={ <Home/> } />
            <Route path='/train' element={ <TrainModel/> } />
            <Route path='/trainNewModel' element={ <TrainNewModel/> } />
            <Route path='/trainCV' element={ <TrainModel/> } />
            <Route path='/fineTune' element={ <FineTune/> } />
            <Route path='/modelDetails' element={ <ModelDetails/> } />
            <Route path='/img_inf' element={ <ImgInference/> } />
            <Route path='/vid_inf' element={ <VidInference/> } />


            <Route path='/chart' element={ <ModelTrainingChart/> } />
          </Routes>
        </div>
      </Router>

    </main>

    </>
  )
}

export default App;