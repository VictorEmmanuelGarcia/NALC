import React, { useState } from 'react';
import nalcLogo from '../../nalcLogo.png';
import './Register.css'

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Perform registration logic here, e.g., send a request to your server
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
  };

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
                <input type="email" class="form-control" id="floatingInput" placeholder="Email"/>
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
            </div>
            <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                {/* <div style={{width: 370, height: 48, left: 0, top: 0, position: 'absolute', background: '#F6F6F6'}} /> */}
                <input type="password" class="form-control" id="floatingInput" placeholder="Password"/>
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
            </div>
            <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                {/* <div style={{width: 370, height: 48, left: 0, top: 0, position: 'absolute', background: '#F6F6F6'}} /> */}
                <input type="password" class="form-control" id="floatingInput" placeholder="Re-enter Password"/>
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
            </div>
            <br/>
            <p className='haveAcc text-maroon'><strong> Already a member? </strong></p>
            <br/>
            <div class="d-grid gap-2 col-6 mx-auto">
                <button class="btn-register" type="button">Register</button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Register;