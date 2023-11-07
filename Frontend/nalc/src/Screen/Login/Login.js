import React , {useState} from 'react';
import nalcLogo from '../../nalcLogo.png';
import './Login.css';

function Login() {

  const [email , setEmail] = useState("");
  const [pwd , setPwd] = useState("");

  const handleLogin = () => {
    // Login Logic here 
    console.log(email);
    console.log(pwd);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePwdChange = (event) => {
    setPwd(event.target.value);
  };


  return (
    <div className="container-fluid gx-0">
      <div className="title">
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
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
            </p>
        </div>
        <br/>
        <div className='row inputs'>
            <form>
                <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                    <input type="email" class="form-control" id="floatingInput" placeholder="Email" onChange={handleEmailChange}/>
                    <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
                </div>
                <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                    <input type="password" class="form-control" id="floatingInput" placeholder="Password" onChange={handlePwdChange}/>
                    <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
                </div>
                <br/>
                <p className='createAcc text-maroon'><strong> Not yet a member? </strong></p>
                <br/>
                <div class="d-grid gap-2 col-6 mx-auto">
                    <button class="btn-login" type="button" onClick={handleLogin}>Login</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
