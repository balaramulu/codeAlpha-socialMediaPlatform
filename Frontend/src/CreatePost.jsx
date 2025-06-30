import React, { useState } from "react";
import NavBar from "./NavBar";
import './css/CreatePost.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";


function CreatePost(){

    const [post,setPost] = useState();
    const [postBio ,setPostBio] = useState();
    const navigate = useNavigate()
    const username = localStorage.getItem("username");

    const Create = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("username",username);
        formData.append("post",post);
        formData.append("postBio",postBio);

        axios.post('http://localhost:3001/post',formData)
        .then(result =>{console.log("post created")
            alert("post created suceessfully")
            navigate('/Profile');
        })
        .catch(error => console.log(error))
    }
    return(
    <>
      <NavBar />
      <div className="create-post">
        <h2>Create a New Post</h2>
        <form className="create-post-form" onSubmit={Create}>
          <input type="file" className="upload-post" onChange={(e) => setPost(e.target.files[0])} required />
          <input type="text" placeholder="Write something..." className="post-bio"  onChange={(e)=>setPostBio(e.target.value)}required />
          <button type="submit">Create</button>
        </form>
      </div>
    </>
    );
}

export default CreatePost