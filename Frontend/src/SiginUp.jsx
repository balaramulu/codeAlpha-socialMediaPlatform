import React, { useState, useEffect } from 'react';
import './css/SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/Home");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔸 Create FormData to handle image and text
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("bio", bio);
    formData.append("profilePic", profilePic);

    axios.post("http://localhost:3001/SignUp", formData)
      .then(result => {
        setMessage(result.data.message);
        if (result.data.message === 'User already exists') {
          setMessage(result.data.message);
        } else {
          alert(result.data.message);
          navigate('/');
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="signup-container">
      
      <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <p style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>
        <h1 className="signup-title">Create Account</h1>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <textarea placeholder="Bio (optional)" value={bio} onChange={(e) => setBio(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])}  />
        <button type="submit">Sign Up</button>
        <p className="login-link">
          Already have an account? <Link to={'/'}>Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
