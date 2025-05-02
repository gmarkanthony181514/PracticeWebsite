import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
//Backend and API Calls
import axios from 'axios';
import { API_BACKENDAPI_URL} from '../BackendConnector/apiRoutes';
//Installed Package Notification
import { toast } from 'react-hot-toast';
//Imported Files & Images
import '@fortawesome/fontawesome-free/css/all.min.css';
import './CSS/LogInRegister.css';
import logoImg from "../assets/images/landingSignUP/logImg.svg";
import registerImg from "../assets/images/landingSignUP/registerImg.svg";

const LogInRegister = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: ''});
  const navigate = useNavigate();
  //Password Strength Checker
  const [passwordStrength, setPasswordStrength] = useState('');
  const [strengthLevel, setStrengthLevel] = useState('');
  const [strengthMessage, setStrengthMessage] = useState('');
  const [strengthColor, setStrengthColor] = useState('');
  const prevPassword = useRef('');
  //Error handling
  const showError = (message) => {
    toast.error(message);
  };
  const showSuccess = (message) => {
    toast.success(message);
  };

  //Animation Card Click
  const handleSignInClick = () => {
    setIsSignUpMode(false);
    setShowIntro(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
    setShowIntro(false);
  };

  // Functionalities of Password Strength
  const evaluatePasswordStrength = (password) => {
    const passwordLength = password.length;
    const numericCount = (password.match(/[0-9]/g) || []).length;
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const alphabetCount = (password.match(/[a-zA-Z]/g) || []).length;
  
    if (passwordLength > 20) {
      setStrengthLevel('too-long');
      setStrengthMessage('⚠️ Password should not exceed 20 characters.');
      setStrengthColor('red');
      return;
    }
  
    const isLengthValid = passwordLength >= 1;
    const hasCharacters = alphabetCount >= 8;
    const hasEnoughNumbers = numericCount >= 2;
    const hasSpecialChar = hasSymbol;
  
    if (!hasCharacters) {
      setStrengthLevel('weak');
      setStrengthMessage('Must include at least 8 alphabet character');
      setStrengthColor('red');
      return;
    }
  
    let passedChecks = 0;
    if (isLengthValid) passedChecks++;
    if (hasEnoughNumbers) passedChecks++;
    if (hasSpecialChar) passedChecks++;
    if (hasCharacters) passedChecks++;
  
    if (passedChecks === 0) {
      setStrengthLevel('');
      setStrengthMessage('');
      setStrengthColor('');
    } else if (passedChecks === 1) {
      setStrengthLevel('weak');
      setStrengthMessage('Weak Password');
      setStrengthColor('red');
    } else if (passedChecks === 2) {
      setStrengthLevel('fair');
      setStrengthMessage('Fair Password');
      setStrengthColor('orange');
    } else if (passedChecks === 3) {
      setStrengthLevel('strong');
      setStrengthMessage('Strong Password');
      setStrengthColor('green');
    }
  };  

  useEffect(() => {
    if (formData.password && formData.password !== prevPassword.current) {
      evaluatePasswordStrength(formData.password);
      prevPassword.current = formData.password;
    } else if (!formData.password) {
      setStrengthLevel('');
      setStrengthMessage('');
      setStrengthColor('');
    }
  }, [formData.password]);  
  
  //Real time changes
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'username') {
      const filteredUsername = value.replace(/[^a-zA-Z0-9]/g, '');
      setFormData((prevState) => ({
        ...prevState, [name]: filteredUsername,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState, [name]: value,
      }));
  
      if (name === 'password') {
        evaluatePasswordStrength(value);
      }
    }
  };  

  //Sign up Session
  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (formData.username.includes(' ') || formData.password.includes(' ')) {
      showError(" ⚠️ Username and password should not contain spaces.");
      return;
    }
  
    // Regex Functionalities
    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
    if (formData.username.length < 5) {
      showError(" ⚠️ Username must be at least 5 characters");
      return;
    }
    
    const digitCount = (formData.username.match(/\d/g) || []).length;
    if (digitCount < 2) {
      showError(" ⚠️ Username must contain at least 2 numbers");
      return;
    }
    
    if (!usernameRegex.test(formData.username)) {
      showError(" ⚠️ Username format is invalid");
      return;
    }
    
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;
    if (formData.password.length < 8 || !passwordRegex.test(formData.password)) {
      showError(" ⚠️ Password didn't appear to be strong enough. Please try again.");
      return;
    }

    //Calling API Endpoints
    try {
     const res = await axios.post(`${API_BACKENDAPI_URL}/api/createuser`, 
      {
        username: formData.username,
        password: formData.password
      });

      showSuccess("🎉 Registered Successfully! Directing to Log in.");
      setIsSignUpMode(false);
    } catch (error) {
      if (error.response?.status === 409) {
        showError(" ⚠️ Username or password already exists. Try a different one.");
      } else if (error.code === 'ECONNABORTED') {
        showError(" ⚠️ Server took too long to respond. Check your internet connection.");
      } else {
        showError(error.response?.data?.message || " ⚠️ Something went wrong. Please try again.");
      }
    }
  };

  //Sign in Session
  const handleLogin = async (e) => {
    e.preventDefault();

    if (formData.username.includes(' ') || formData.password.includes(' ')) {
      showError(" ⚠️ No spaces allowed in username or password.");
      return;
    }

    //Calling API Endpoints
    try {
      const response = await axios.post(`${API_BACKENDAPI_URL}/api/Login`, {
        username: formData.username,
        password: formData.password
    });

      const data = response.data?.[0];

    if (!data?.token) {
      showError(" ⚠️ Login failed: Incorrect username or password!");
        return;
    }
  
    //Saving Username & Token on Storage
    try {
        sessionStorage.setItem("username", formData.username);
        sessionStorage.setItem("token", data.token);
        showSuccess(" 🎉 Login Successful! Redirecting to Marketplace...");
        setTimeout(() => {
          window.location.href = '/marketplace';
        }, 1000);
    } catch (storageError) {
      showError(" ⚠️ Failed to save session data. Please check your browsing settings.");
    }
      } catch (error) {
        if (!error.response) {
          showError(" ⚠️ Network error. Please check you internet connection.");
        } else if (error.response.status === 401) {
          showError(" ⚠️ Incorrect username or password")
        } else {
          showError(error.response?.data?.message || " ⚠️ Login failed. Please try again.");
        }
      }
  };

  return (
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''} ${showIntro ? 'show-intro' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign in Session */}
            <form className="sign-in-form" onSubmit={handleLogin}>
              <h2 className="title"> 𝐒𝐈𝐆𝐍 𝐈𝐍 </h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="input-field">
              <i className="fas fa-lock"></i>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>
        <input type="submit" value="LOGIN" className="btn solid" />
      </form>
          {/* Sign up Session */}
            <form className="sign-up-form" onSubmit={handleRegister}>
              <h2 className="title"> 𝐒𝐈𝐆𝐍 𝐔𝐏 </h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="input-field">
              <i className="fas fa-lock"></i>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="password-strength-container">
        <div
          id="strength-bar"
            className={`strength-bar ${strengthLevel}`}
              style={{
                width: 
                  strengthLevel === 'weak' ? '30%' :
                    strengthLevel === 'fair' ? '60%' :
                      strengthLevel === 'strong' ? '100%' : '0%',
                    }}
              ></div>
            <div id="password-strength-text" style={{ color: strengthColor }}>{strengthMessage}</div>
          </div>
        <ul className="password-requirements">
          <li className={formData.password.length >= 8 && /[a-zA-Z]/.test(formData.password) ? 'valid' : ''}>
            At least 8 alphabet characters
              </li>
                <li className={(formData.password.match(/[0-9]/g) || []).length >= 2 ? 'valid' : ''}>
                  At least 2 numeric characters
                    </li>
                      <li className={/[^a-zA-Z0-9]/.test(formData.password) ? 'valid' : ''}>
                        At least 1 special symbol
                        </li>
                      </ul>
                    <input type="submit" className="btn solid" value="SIGNUP" />
                  </form>
               </div>
            </div>
          <div className="panels-container">
        <div className="panel left-panel">
      <div className="content">
        <h3> 𝐍𝐞𝐰 𝐭𝐨 𝐅𝐚𝐤𝐞 𝐒𝐭𝐨𝐫𝐞? </h3>
           <p> 𝙎𝙞𝙜𝙣 𝙐𝙥 𝙣𝙤𝙬 𝙖𝙣𝙙 𝙪𝙣𝙡𝙤𝙘𝙠 𝙩𝙝𝙚 𝙛𝙪𝙡𝙡 𝙚𝙭𝙥𝙚𝙧𝙞𝙚𝙣𝙘𝙚! </p>
            <button className="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}>Sign up</button>
          </div>
          <img src={logoImg} className="image" alt="signIn" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3> 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐚 𝐦𝐞𝐦𝐛𝐞𝐫 𝐨𝐟 𝐅𝐚𝐤𝐞 𝐒𝐭𝐨𝐫𝐞? </h3>
            <p> 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒃𝒂𝒄𝒌! 𝑺𝒊𝒈𝒏 𝒊𝒏 𝒕𝒐 𝒄𝒐𝒏𝒕𝒊𝒏𝒖𝒆 𝒚𝒐𝒖𝒓 𝒋𝒐𝒖𝒓𝒏𝒆𝒚 𝒘𝒊𝒕𝒉 𝑭𝒂𝒌𝒆 𝑺𝒕𝒐𝒓𝒆. </p>
            <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>Sign in</button>
          </div>
          <img src={registerImg} className="image" alt="signUp" />
        </div>
      </div>
    </div>
  );
};

export default LogInRegister;
