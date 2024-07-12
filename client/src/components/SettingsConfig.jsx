import { useState } from "react";
import PropTypes from 'prop-types'

const SettingsConfig = ({ onTrainDataChange }) => {

  const  [trainData, setTrainData] = useState({
    test_size:  0.2,
    num_words: 2000,
    glove_path: '/home/cetai/GitAI/glove.6B.100d.txt',
    dropout: 0.6,
    epochs: 20,
    batch_size: 32,
    embedding_dim: 100,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    let newTrainData = {...trainData, [name]: value };
  
    // Update embedding_dim based on glove_path
    if (name === 'glove_path') {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const embeddingDim = selectedOption.textContent;
      newTrainData.embedding_dim = embeddingDim;
    }
  
    setTrainData(newTrainData);
    onTrainDataChange(newTrainData);
  };
  
  return (
    <>
    <div id="settings_config" className='w-full h-[30%] rounded-[3px] p-[1vw] flex flex-wrap gap-[1vw] justify-center items-center'>
      <div id="test_size"  className='flex items-center gap-[.5vw] bg-zinc-200 px-[1vw] py-[1vh] rounded-full'>
        <span className='text-1vw'>Test size</span>
        <select name="test_size" className='bg-white outline-none rounded-[3px] text-[.8vw] border border-black' value={ trainData.test_size } onChange={ handleChange }>
          <option value="0.1">0.1</option>
          <option value="0.2">0.2</option>
          <option value="0.3">0.3</option>
          <option value="0.4">0.4</option>
        </select>
      </div>

      <div id="num_words"  className='flex items-center gap-[.5vw] bg-zinc-200 px-[1vw] py-[1vh] rounded-full'>
        <span className='text-1vw'>Number of words</span>
        <select name="num_words" className='bg-white outline-none rounded-[3px] text-[.8vw] border border-black' value={ trainData.num_words } onChange={ handleChange }>
          <option value="2000">2000</option>
          <option value="3000">3000</option>
          <option value="4000">4000</option>
          <option value="5000">5000</option>
          <option value="6000">6000</option>
          <option value="7000">7000</option>
          <option value="8000">8000</option>
          <option value="9000">9000</option>
          <option value="10000">10000</option>
        </select>
      </div>

      <div id="glove_path"  className='flex items-center gap-[.5vw] bg-zinc-200 px-[1vw] py-[1vh] rounded-full'>
        <span className='text-1vw'>Glove Dimensions</span>
        <select name="glove_path" className='bg-white outline-none rounded-[3px] text-[.8vw] border border-black' value={ trainData.glove_path } onChange={ handleChange }>
          <option value="/home/cetai/GitAI/glove.6B.50d.txt">50</option>
          <option value="/home/cetai/GitAI/glove.6B.100d.txt">100</option>
          <option value="/home/cetai/GitAI/glove.6B.200d.txt">200</option>
        </select>
      </div>

      <div id="dropout"  className='flex items-center gap-[.5vw] bg-zinc-200 px-[1vw] py-[1vh] rounded-full'>
        <span className='text-1vw'>Dropout</span>
        <select name="dropout" className='bg-white outline-none rounded-[3px] text-[.8vw] border border-black' value={ trainData.dropout } onChange={ handleChange }>
          <option value="0.5">0.5</option>
          <option value="0.6">0.6</option>
          <option value="0.7">0.7</option>
          <option value="0.8">0.8</option>
        </select>
      </div>

      <div id="batch_size"  className='flex items-center gap-[.5vw] bg-zinc-200 px-[1vw] py-[1vh] rounded-full'>
        <span className='text-1vw'>Batch Size</span>
        <select name="batch_size" className='bg-white outline-none rounded-[3px] text-[.8vw] border border-black' value={ trainData.batch_size } onChange={ handleChange }>
          <option value="32">32</option>
          <option value="16">16</option>
          <option value="64">64</option>
        </select>
      </div>

      <div id="epochs" className='flex items-center gap-[.5vw] bg-zinc-200 px-[1vw] py-[1vh] rounded-full'>
        <span className='text-1vw'>Epochs</span>
        <input value={ trainData.epochs } type="number" name="epochs" onChange={ handleChange } className="outline-none px-[.5vw] py-[.5vh] text-[.7vw]" min={0} />
      </div>

    </div>
    </>
  )
}

SettingsConfig.propTypes = {
  onTrainDataChange: PropTypes.func
};

export default SettingsConfig;