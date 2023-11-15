import React , {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import nalcLogo from '../../nalcLogo.png';
import './Login.css';

function Login() {

  const [email , setEmail] = useState("");
  const [pwd , setPwd] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Show loading indicator here
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
        email: email,
        password: pwd,
      });
      if (response.status >= 200 && response.status < 300) {
        // Save auth token
        const authToken = response.data.access_token;

        // Add the token to the headers for subsequent requests
        localStorage.setItem('authToken', authToken);

        // Login Successfull
        navigate('/home');
      } else {
        // Login Failedd
        alert("Email or Password is incorrect");
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert("Email or Password is incorrect");
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePwdChange = (event) => {
    setPwd(event.target.value);
  };


  return (
    <div className="container-fluid gx-0">
      <div className="title" style={{ backgroundColor: '#FFF4C5' }}>
        <div className="row logo">
          <img src={nalcLogo} alt="NALC Logo" />
        </div>
        <div className="row words">
          <h1>
            <strong>
                Narrative Association for Linked Content
                for IPAMS
            </strong>
            <br />
            <small style={{ fontSize: '60%' }}>
              (Intellectual Property Asset Management System)
            </small>
          </h1>
        </div>
      </div>
      <div className="form">
        <div className='row'>
            <h1 className='text-maroon'>Login Account</h1>
        </div>
        <br/>
        <div className='row'>
            <p>
                It is a long established fact that a reader will be distracted by 
                the readable content of a page when looking at its layout. 
            </p>
        </div>
        <br/>
        <div className='row inputs'>
            <form>
                <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                    <input type="email" class="form-control" id="floatingInput" placeholder="Email" onChange={handleEmailChange} 
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleLogin();
                        }}}
                      />
                    <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
                </div>
                <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                    <input type="password" class="form-control" id="floatingInput" placeholder="Password" onChange={handlePwdChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleLogin();
                        }}}
                    />
                    <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
                </div>
                <div class="d-grid gap-2 col-6 mx-auto">
                  <a class="createAcc text-maroon" href="/register" role="button"><strong> Not yet a member? </strong></a>
                  <br/>
                  <button class="btn-login" type="button" onClick={handleLogin}>Login</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
