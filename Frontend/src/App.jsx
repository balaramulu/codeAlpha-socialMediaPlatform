import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login.jsx'
import SignUp from './SiginUp.jsx'
import Home from './Home.jsx'
import Profile from './Profile.jsx'
import CreatePost from './CreatePost.jsx';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/SignUp' element={<SignUp/>}></Route>
        <Route path='/Home' element={<Home />}></Route>
        <Route path='/Profile' element={<Profile />}></Route>
        <Route path='/CreatePost' element={<CreatePost />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
