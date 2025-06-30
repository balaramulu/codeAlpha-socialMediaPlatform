  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import './css/Home.css';
  import NavBar from "./NavBar";
  import Profile from './Profile'

  function Home() {
    const navigate = useNavigate();
    
    const [posts,setPosts] = useState([]);
    const [user,setUserData] = useState();
    const [liked,setLiked] = useState([]);
    const [follow, setFollow] = useState();
    const [followingUsers,setFollowingUsers] = useState([])
    const username = localStorage.getItem("username");

    const handleLikes = async (postId) => {
        axios.put(`http://localhost:3001/posts/like/${postId}`,{username})
        .then(res => {
          setPosts(prevPosts =>
            prevPosts.map(post => post._id === postId ? { ...post, likes: res.data.likes, likedBy: res.data.likedBy, }  : post
            ));
        })
        .catch(err => {console.log(err)})
    }

    useEffect(()=>{
      axios.get(`http://localhost:3001/posts/${username}`)
      .then(response =>setPosts(response.data))
        .catch(error =>console.error(error));
    },[navigate])

    const followingHandle = (postUsername) => {
      axios.put(`http://localhost:3001/followingUpdate/${postUsername}`,{username})
      .then(res => {
        const action = res.data.message;
        {if (action === "followed") {
        setFollowingUsers(prev => [...prev, postUsername]);
        } else if (action === "unfollowed") {
        setFollowingUsers(prev => prev.filter(user => user !== postUsername));
        }
      }
    })
      .catch(err => console.log(err))
    }


    return (
    <>
      <NavBar />
      {/* <div className="outer"> */}
      <div className="posts-container">
          {posts.length === 0 ? (<p>No posts yet</p>) :
          (
            posts.map((post, index) => (
              <div className="post-card" key={index}>
                <p className="userName"> {post.username}</p><button className="follow-button" onClick={() => followingHandle(post.username)}>{followingUsers.includes(post.username) ? "Unfollow" : "Follow"}</button>
                <p>{post.bio}</p>
                <img src={`http://localhost:3001${post.post}`} alt="Post" />
                <button className="like-button" onClick={() => handleLikes(post._id,post.likes)}>{post.likedBy.includes(username) ? "💘 Like" : "💘 Like"}{" "}
                {post.likes}</button>
              </div>
            ))
          )}
        </div>
      {/* </div> */}

      
    </>
    );
  }

  export default Home;
