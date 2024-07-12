import { useState } from 'react';
import swal from 'sweetalert';

// Components
import Landing from './Landing';
import Sidebar from './Sidebar';

// Icons
import { FaTelegramPlane } from "react-icons/fa";
import { IoMdThumbsUp } from "react-icons/io";
import { IoMdThumbsDown } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { Comment } from 'react-loader-spinner';


const Home = () => {

	const [predictedData, setPredictedData] = useState('');
	const [checkPredictData, setChekcPredictData] = useState(false);
	const [isBtnDisabled, setBtnDisabled] = useState(true);
	const [showRadioBtn, setShowRadioBtn] = useState(false);
	const [radioDisabled, setRadioDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [inputData, setData] = useState('');
	const [selectedField, setSelectedField] = useState(null);

	const handleChange = e => {
		const { value } = e.target;
		setData(value);
		value.length >= 1 ? setBtnDisabled(false) : setBtnDisabled(true);
	};

	// Sending data to server
	const predictedJSONData = { input_string: inputData };
	const predict = async () => {
		try {
			setLoading(true);
			await fetch(`${import.meta.env.VITE_FETCH_CENTOS_URL}/predict`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(predictedJSONData)
			})
			.then(async res => await res.json())
			.then( data => setPredictedData(data) )
			.then(() => setChekcPredictData(true))
			.then(() => setLoading(false));
		} catch (err) {
			swal({ title: 'Server error', text:'Try again!', icon:'error' });
			console.log(err);
			setLoading(false);
		}
	}

	// Display radio button on Incorrect prediction
	const isCorrectPrediction = () => {
		const btn = document.getElementById('incorrect');
		const btnAttribute = btn.getAttribute('data-string')
		if ( btnAttribute === 'incorrect' ) {
			setShowRadioBtn(true);
		}
	}

	// onChange event of radio buttons
	const handleRadioBtnChange = (code) => {
		setSelectedField(code);
		if (code.toString().split('').length > 0) setRadioDisabled(false)
	}

	// Selection of prediction if displayed is wrong
	const handleIncorrectPrediction = async (code) => {
		const incorrectPrediction = {
			input_string: inputData,
			category_code: code
		}

		try {
			await fetch(`${import.meta.env.VITE_FETCH_CENTOS_URL}/add_data`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( incorrectPrediction )
			})
			.then(async res => {
				if ( res.status === 200 ) {
					swal({ text: 'Successfully added', icon:'success' });
					setShowRadioBtn(false);
					setLoading(false);
				} else {
					swal({ title: 'Something went wrong!', text:'Try again', icon:'error' });
					setShowRadioBtn(false);
					setLoading(false);
				}
			});
		} catch (err) {
			console.log('Error while sending incorrect preddicction CatCode to the server: ', err);
			setLoading(false);
			swal({ text: 'Server error', icon:'error' });
			setShowRadioBtn(false);
		}
	}

  return (
    <>
    <main className='bg-white h-screen w-full flex items-center justify-center'>

			<Sidebar/>
			
			<div id="container" className='h-full w-full p-[1vw] '>
				<div id="visual_area" className=' h-[85%] w-full overflow-hidden overflow-y-scroll' >
					
				{ loading && 
					<div className=' h-full w-full flex items-center justify-center'>
						<Comment
							visible={true}
							height="80"
							width="80"
							ariaLabel="comment-loading"
							wrapperStyle={{ translateX: '50%' }}
							wrapperClass="comment-wrapper"
							color="#fff"
							backgroundColor="#007FFF"
						/> 
					</div>
				}
				{checkPredictData && !loading ? (
					<div className='w-full h-full'>
						<div className=' flex flex-col gap-[10px] h-max w-full items-center justify-center text-[1.5vw]'>
							<span className=' border border-black  rounded-[6px]  mt-[5px] mb-[5px] h-max px-[1vw] py-[1.5vh] text-[1.2vw]'>
								<span className='font-semibold text-[#ff0000] '>Problem</span>
								<span className=' text-[#e70000] font-[450]'>: {predictedData.Problem}</span>
							</span>

							{!showRadioBtn ? (
								<div id='buttons' className='flex gap-[10px] items-center justify-center'>
									<span className=''>Is the above prediction correct?</span>
									<div className=' flex gap-[1rem]'>

										<button id='correct' className='hover:text-green-500' onClick={ () => window.location.reload() }>
											<IoMdThumbsUp className='text-[1.5vw]'/>
										</button>

										<button id='incorrect' data-string='incorrect' onClick={ isCorrectPrediction } className='hover:text-red-600'>
											<IoMdThumbsDown className='text-[1.5vw]'/>
										</button>
									</div>
								</div>
							) : (
								<div id='buttons' className='flex gap-[10px] items-center justify-center'>
									<span className=''>Select the appropriate problem below</span>
									<div className=' flex gap-[1rem]'>
										<button onClick={ () => handleIncorrectPrediction(selectedField) } disabled={ radioDisabled } className={` ${ radioDisabled ? 'bg-zinc-400' : 'bg-[#007FFF]' } flex gap-[.5vw] items-center px-[.5vw] py-[.5vh] rounded-[5px] text-[1vw] font-semibold text-white `}>
											<span>Submit</span> <IoMdSend className='text-[1.2vw]'/>
										</button>
									</div>
								</div>
							)}
						</div>
						
						<table className=' w-full h-full flex flex-col mt-[1.5rem] text-[1.2vw]'>
							<thead className=' w-full bg-zinc-300 h-full py-[1vh]'>
								<tr className='flex justify-between px-[1vw]'>
									<th>Sr no.</th>
									<th className='mr-[4vw]'>Description</th>
									<th className='mr-[1vw]'>Prediction</th>
								</tr>
							</thead>
							<tbody className='w-full flex flex-col gap-[1vh]'>
								{predictedData.Categories.slice().sort((a,b) => b[2] - a[2]).map((item, index) => {
									return <tr key={ index } className='mt-[1rem] flex justify-between px-[3vw] border-b-2 relative'>
										{showRadioBtn && 
											<td className='absolute left-[1vw]'>
												<input type="radio" 
													name='incorrect-prediction' 
													value={ item[0] } 
													checked={ selectedField === item[0] }
													onChange={ () => handleRadioBtnChange(item[0]) }
												/>
											</td>
										}
										<td>{ index + 1 }</td>
										<td>{ item[1] }</td>
										<td>{ item[2] }</td>
									</tr>
								})}
							</tbody>
						</table>
						</div>
					) : !loading && (
						<div className=' w-full h-full'>
							<Landing />
						</div>
					)}
				</div>

				<div id="predict"  className='mt-[10px]  p-[.5vw] flex gap-[1vw] justify-center'>
					<input type="text" className='text-[1vw] border border-black w-1/2 p-[.5vw] rounded-[10px] outline-none placeholder:text-[#555] placeholder:font-medium tracking-tight' 
						name='inputData'
						placeholder='Enter query here'
						value={ inputData } 
						autoComplete='off'
						onChange={ handleChange }
					/>
					<button 
						disabled={ isBtnDisabled }
						onClick={ predict } className={ ` ${ isBtnDisabled ? 'bg-zinc-500' : 'bg-lime-700' } px-[.5vw] rounded-[5px] flex gap-[.5vw] items-center text-[1vw]  text-white` }>Predict <FaTelegramPlane  className='text-[1.2vw]'
					/> </button>
				</div>
			</div>
    </main>
    </>
  )
}

export default Home;