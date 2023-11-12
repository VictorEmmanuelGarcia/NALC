import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import nalcLogo from '../../nalcLogo.png';
import './Register.css'

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Perform registration logic here, e.g., send a request to your server
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/register/', {
        email: email,
        password: password,
        name: name,
      });
      if (response.status >= 200 && response.status < 300) {
        // Login Successfull
        navigate('/');
      } else {
        // Login Failedd
        alert("Please fill up all required form!");
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert("An error occurred during Registration. Please try again.");
    }
  };

  const handleInputChange = (identifier) => (e) =>{
    if(identifier == 'email'){
      setEmail(e.target.value);
    } else if (identifier == 'name'){
      setName(e.target.value);
    } else if (identifier == 'pwd'){
      setPassword(e.target.value);
    }
  }
  return (
    <div className='containter-fluid'>
      <div className='big-space'></div>
      <div className='row logo-r'>
        <img src={nalcLogo} alt="NALC Logo" />
      </div>
      <div className='title-r'>
        <div className='row'>
          <h2 className='text-maroon'><strong>Create Account</strong></h2>
        </div>
      </div>
      <div className='row inputs'>
        <form>
            <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                {/* <div style={{width: 370, height: 48, left: 0, top: 0, position: 'absolute', background: '#F6F6F6'}} /> */}
                <input type="email" class="form-control" id="floatingInput" placeholder="Email" required onChange={handleInputChange('email')}/>
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
            </div>
            <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                {/* <div style={{width: 370, height: 48, left: 0, top: 0, position: 'absolute', background: '#F6F6F6'}} /> */}
                <input type="text" class="form-control" id="floatingInput" placeholder="Name" required onChange={handleInputChange('name')}/>
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
            </div>
            <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                {/* <div style={{width: 370, height: 48, left: 0, top: 0, position: 'absolute', background: '#F6F6F6'}} /> */}
                <input type="password" class="form-control" id="floatingInput" placeholder="Enter Password" required onChange={handleInputChange('pwd')}/>
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
            </div>
            <div class="d-grid gap-2 col-6 mx-auto">
              <a className="haveAcc text-maroon" href="/" role="button"><strong> Already a member? </strong></a>
              <br/>
              <button class="btn-register" type="button" onClick={handleRegister}>Register</button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Register;