import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './css/NavBar.css'




function NavBar(){

    const navigate = useNavigate();

    const LogOut = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("username");
    navigate('/');
  };


    return (
    <nav className="navbar">
      <h2 className="navbar-logo">Intaract Socials</h2>
      <div className="navbar-links">
        <Link to={'/Home'} className="navbar-link">Home</Link>
        <Link to={'/Profile'} className="navbar-link">My Profile</Link>
        <button onClick={LogOut} className="navbar-logout">Log Out</button>
      </div>
    </nav>
    )
}

export default NavBar