import { useState, useEffect, useRef} from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
//Navigatiion
import { useNavigate } from 'react-router-dom';
//Backend Connector
import axios from 'axios';
import { API_BACKENDAPI2_URL} from '../BackendConnector/apiRoutes';
//Importing Notification Package
import { toast } from 'react-hot-toast';
//Importing Images
import logoImg from "../assets/images/landingSignUP/logImg.svg";
import registerImg from "../assets/images/landingSignUP/registerImg.svg";
//Hard Coded CSS Responsive with Animation
import './CSS/LogInRegister.css';

const LogInRegister = () => {
  //For Animation Situation of Sign In and Sign Up
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  //Loading Modal
  const [isLoading, setIsLoading] = useState(false);
  //Password Strength
  const [strengthLevel, setStrengthLevel] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [strengthMessage, setStrengthMessage] = useState('');
  const [strengthColor, setStrengthColor] = useState('');
  //Real time Password changes
  const prevPassword = useRef('');
  //Navigation
  const navigate = useNavigate();
  //Fill up Form Data
  const [formData, setFormData] = useState(
    { 
      username: '',
      password: '',
      confirmpassword: '',
      email: ''
    }
);


  //Animation Happening For SignIn and Sign Up buttons for switching two grid columns
  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  // Functionalities of Password Strength
  const evaluatePasswordStrength = (password) => {
    //Checker of Maximum Length of Password
    const passwordLength = password.length;
    //Checker for password, symbol, alphabet are totally met the Regex Functionalities
    const numericCount = (password.match(/[0-9]/g) || []).length;
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const alphabetCount = (password.match(/[a-zA-Z]/g) || []).length;
  
    //Limit the password length into 20 characters only
    if (passwordLength > 20) {
      setStrengthLevel('too-long');
      setStrengthMessage('⚠️ Password should not exceed more than 20 characters');
      setStrengthColor('red');
      return;
    }
  
    //The strength password will start at the 1 character
    const isLengthValid = passwordLength >= 1;
    //The strength password will automatically updated real time when met this conditions
    const hasCharacters = alphabetCount >= 8;
    const hasEnoughNumbers = numericCount >= 2;
    const hasSpecialChar = hasSymbol;
  
    //if all conditions are met, the passChecks will be increased accordingly
    let passedChecks = 0;
    //this is where the password checker will be started
    if (isLengthValid) passedChecks++;
    //if met this condition, the password will be considered as weak
    if (hasCharacters) passedChecks++;
    //if met this condition, the password will be considered as fair
    if (hasEnoughNumbers) passedChecks++;
    //if met this condition, the password will be considered as strong
    if (hasSpecialChar) passedChecks++;

    //Example password: markgarcia_xure071403
  
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

  //This is where the prevPassword will be working real time checker
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


  const handleChange = ({ target: { name, value } }) => {
    const checkerValue = name === 'username' ? value.replace(/[^a-zA-Z0-9]/g, '') : value;
    setFormData((prev) => ({ ...prev, [name]: checkerValue }));
  };
  
  //Register Handler Session
  const handleRegister = async (e) => {
    //this is where checking for the spaces, if the password has been match, and regex validation
    e.preventDefault();
    setIsLoading(true);
  
    //Checking if the username and password does contain spaces
    if (formData.username.includes(' ') || formData.password.includes(' ')) {
      toast.error(" ⚠️ Password should not contain spaces.");
      return;
    }

    //Matching if the password and confirm password are on the same situation
    if (formData.password !== formData.confirmpassword) {
      toast.error(" ⚠️ Your passwords do not match.");
      return;
  }
  
    //Applying Regex for the Username
    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
    if (formData.username.length < 5) {
      toast.error(" ⚠️ Username must be at least 5 characters");
      return;
    }

    if (!usernameRegex.test(formData.username)) {
      toast.error(" ⚠️ Username format is invalid");
      return;
    }
    
    //Checking if the username does contain at least 2 numbers and its mandatory
    const usernameCount = (formData.username.match(/\d/g) || []).length;
    if (usernameCount < 2) {
      toast.error(" ⚠️ Username should contain at least 2 numbers.");
      return;
    }

    //Applying Regex for the Password
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;
    //if the password is less than 8 characters, it will not be accepted
      if (formData.password.length < 8 || !passwordRegex.test(formData.password)) {
        toast.error(" ⚠️ Your password are too short and does not met all the requirements needed.");
        return;
      }

    //Applying Regex for the email to make less special characters and more readable as a email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error(" ⚠️ Please enter a proper email address.");
        return;
      }


    //Calling Rico API of Createuser
    try {
     const response = await axios.post(`${API_BACKENDAPI2_URL}/api/Createuser`, 
      {
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmpassword,
        email: formData.email
      });

      toast.success("🎉 User has been Created! Directing to Sign in.");
      setIsSignUpMode(false);

      //Error Parameters based on Rico Documentation based on Createuser API
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(" ⚠️Username and password are required.");
      } else if (error.response?.status === 409) {
        toast.error("⚠️ Username already exists.");
      } else if (error.response?.status === 500) {
        toast.error("⚠️ Failed to create user.");
      } else {
        toast.error(error.response?.data?.message || " ⚠️ The server is down... Please contact us to fix this issue.");
      }
    } finally  {
      setIsLoading(false);
    }
  };

  //Login Handler Session
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

  //Checking if the user put spaces too on the sign in situation
    if (formData.username.includes(' ') || formData.password.includes(' ')) {
      toast.error(" ⚠️ No spaces allowed in username or password.");
      return;
    }

    //Calling Rico API of Login
    try {
    const response = await axios.post(`${API_BACKENDAPI2_URL}/api/Login`, {
        username: formData.username,
        password: formData.password,
    });

    //Checking if the data response from the API is an array or not for security purposes
    const data = Array.isArray(response.data) ? response.data[0] : response.data;

    //if there is no token included on the API response this will be triggered
    if (!data?.token) {
      toast.error("⚠️ You cannot login without a token. Please contact us.");
      return;
    }
  
   //For the web browser does not support sessionStorage such as the incognito mode.
        try {
          sessionStorage.setItem("username", data.username || formData.username);
          sessionStorage.setItem("token", data.token);
        } catch (storageError) {
          toast.error("⚠️ Unable to save session data. Please check your browser settings.");
          return;
        }
        
        toast.success("🎉 Login Successful! Redirecting to Marketplace...");
        setTimeout(() => {
          navigate('/marketplace');
        }, 1000);
        
      //Error Parameters based on Rico Documentation on Login API
      } catch (error) {
        if (!error.response) {
          toast.error("⚠️ Slow connection detected! Please wait...");
        } else if (error.response.status === 401) {
          toast.error("⚠️ Invalid credentials.");
        } else if (error.response.status === 403) {
          toast.error("⚠️ User account is deactivated.");
        } else if (error.response.status === 400) {
          toast.error("⚠️ Username and password required.");
        } else {
          toast.error(error.response?.data?.message || "⚠️ The server is down... Please contact us to fix this issue.");
        }
      } finally {
        setIsLoading(false);
      }
    };


  
  return (
  <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>

    {/* Loading Modal Situation */}
    {isLoading && (
      <div className="loading-modal active">
        <div className="loading-spinner"></div>
      </div>
    )}

    {/* Form Data Container */}
    <div className="forms-container">
      <div className="signin-signup">

        {/* Sign in Session */}
        <form className="sign-in-form" onSubmit={handleLogin}>
          <h2 className="title">𝐒𝐈𝐆𝐍 𝐈𝐍</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading} // Disable input when loading
              required
            />
          </div>
          <div className="input-field">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading} // Disable input when loading
              required
            />
          </div>
          <input
            type="submit"
            value="LOGIN"
            className="btn solid"
            disabled={isLoading} // Disable button when loading
          />
        </form>

        {/* Sign up Session */}
          <form className="sign-up-form" onSubmit={handleRegister}>
            <h2 className="title">𝐒𝐈𝐆𝐍 𝐔𝐏</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                  <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                  />
              </div>
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      required
                    />
                </div>

          {/* Password Animation when the user click the password field not confirm password */}
          {isPasswordFocused && (
            <div className="password-strength-container">
              <div
                id="strength-bar"
                className={`strength-bar ${strengthLevel}`}
                style={{
                  width:
                    strengthLevel === 'weak'
                      ? '30%'
                      : strengthLevel === 'fair'
                      ? '60%'
                      : strengthLevel === 'strong'
                      ? '100%'
                      : '0%',
                }}
              >   
              </div>
              <div id="password-strength-text" style={{ color: strengthColor }}>
                {strengthMessage}
              </div>
            </div>
          )}

          {isPasswordFocused && ( 
            <ul className="password-requirements">
              <li
                className={
                  formData.password.length >= 8 && /[a-zA-Z]/.test(formData.password)
                    ? 'valid'
                    : ''
                }
              >
                At least 8 alphabet characters
              </li>
              <li
                className={
                  (formData.password.match(/[0-9]/g) || []).length >= 2 ? 'valid' : ''
                }
              >
                At least 2 numeric characters
              </li>
              <li
                className={/[^a-zA-Z0-9]/.test(formData.password) ? 'valid' : ''}
              >
                At least 1 special symbol
              </li>
            </ul>
          )}
              <div className="input-field">
                                <i className="fas fa-lock"></i>
                                <input
                                    type="password"
                                    name="confirmpassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmpassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-inbox"></i>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <input type="submit" className="btn solid" value="SIGNUP" />
                        </form>
                      </div>
                    </div>

          {/* Sign In and Sign Up Designs */}
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
