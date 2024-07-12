
import { useState } from 'react';
import swal from 'sweetalert';

import logo from '../assets/img/CET_AI_3.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword,  setShowPassword] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const Navigate = useNavigate();

  const loginData = {
    user: username,
    pass: password
  };

  const handleLogin = async e => {
    e.preventDefault();

    if ( !username  ) {
      swal({ title: 'Enter username', icon: 'warning' })
    } else if ( !password ) {
      swal({ title: 'Enter password', icon: 'warning' })
    }else {
      try {
        await fetch(`${import.meta.env.VITE_FETCH_CENTOS_URL}/login`, {
          method: 'POST',
          headers: {  'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
        })
        .then(async res => await res.json())
        .then(data => {
          if ( data.response == 'Access Granted' ) {
            Navigate('/home');
          } else {
            swal({ title: 'Invalid credentials', icon: 'error' });
            setUsername('');
            setPassword('');
          }
        })
      } catch (err) {
        console.log('Server error while Login: ', err);
        swal({ title: 'Server error', icon: 'error' });
      }
    }
  }

  return (
    <>
    <main className="w-full h-screen flex items-center justify-center bg-zinc-800 text-white">
      <div id="login_page" className="w-1/2 h-max p-[2vw] rounded-[5px] ">
        <div id="login_form" className='w-full h-full transition delay-1000'>
          {!showLoginForm ? (
            <div id="logo_img" className='w-full h-full flex flex-col items-center justify-center transition duration-300'>
              <img src={ logo } alt="logo" id='logo' className='mb-5' />
              <button onClick={ () => setShowLoginForm(true) } className='border-2 border-black px-[2.5vw] py-[1vh] rounded-xl bg-[#007FFF] text-white text-[1.3vw] font-semibold hover:border-white hover:bg-blue-500 transition-all active:scale-95'>Login</button>
            </div>
          ) : (
            <form onSubmit={ handleLogin } className=' w-full h-full flex flex-col items-center justify-center gap-[1vh]'>
              <img src={ logo } alt="logo" id='logo' className='mb-5 w-1/2 h-1/2 ' />
              <div id="input_boxes" className='grid gap-[1vw]'>
                <div id="input_box" className='relative w-full h-full'>
                  <input type="text" 
                    name='user'
                    value={ username }
                    onChange={ e => setUsername(e.target.value) }
                    className='bg-transparent border rounded-[3px] px-[.5vw] py-[1vh] text-[1.1vw] outline-none' 
                  />
                  <span className='absolute left-0 pointer-events-none bg-zinc-800 -translate-y-[13px] translate-x-[10px] px-[3px] text-[.8vw]'>Username</span>
                </div>
                <div id="input_box" className='relative w-full h-full '>
                  <input type={ showPassword ? 'text' : 'password' }
                    name='pass'
                    value={ password }
                    onChange={ e => setPassword(e.target.value) }
                    className='bg-transparent border rounded-[3px] px-[.5vw] py-[1vh] text-[1.1vw] outline-none' 
                  />
                  <span className='absolute left-0 pointer-events-none bg-zinc-800 -translate-y-[13px] translate-x-[10px] px-[3px] text-[.8vw]'>Password</span>
                  <i onClick={ () => setShowPassword(!showPassword) } className='absolute text-[1.2vw] right-[10px] top-[15px] '>
                    {showPassword ? <FaEyeSlash/> : <FaEye/> }
                  </i>
                </div>
              </div>
              <button className='mt-[10px] border rounded-[3px] px-[1vw] py-[.5vh] text-[1.1vw] '>Login</button>
            </form>
          )}
        </div>
      </div>
    </main>
    </>
  )
}

export default Login;