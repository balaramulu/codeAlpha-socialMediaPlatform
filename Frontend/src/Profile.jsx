
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './css/Profile.css';
import NavBar from "./NavBar";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const username = localStorage.getItem("username");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    axios.get(`http://localhost:3001/user/${username}`)
      .then(res => setUserData(res.data.user))
      .catch(err => console.log(err));
  }, [username, navigate]);

  useEffect(() => {
    axios.get(`http://localhost:3001/post/${username}`)
      .then(response => setPosts(response.data))
      .catch(error => console.error(error));
  }, [username]);

  if (!userData) return <h2>Loading...</h2>;

  return (
    <>
      <NavBar />
      <div className="profile-page">
        <div className="profile-left">
          <div className="profile-photo">
            <img
              src={`http://localhost:3001${userData.profilePic}`}
              alt="profile"
            />
          </div>
          <div className="profile-Name">{userData.username}</div>
          <div className="profile-bio">{userData.bio}</div>
        </div>

        <div className="profile-right">
          <div className="profile-Followers">
            <p>Followers</p>
            <p>{userData.followersUsers.length}</p>
          </div>
          <div className="profile-following">
            <p>Following</p>
            <p>{userData.followingUsers.length}</p>
          </div>
          <div className="profile-no-of-posts">
            <p>Posts</p>
            <p>{posts.length}</p>
          </div>
        </div>

        <div className="posts-actions">
          <Link to={'/CreatePost'} className="create-post-button">+ Create Post</Link>
        </div>

        <div className="posts-profile">
          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            posts.map((post) => (
              <div className="post-card" key={post._id}>
                <div className="post-header">
                   <p><img src={`http://localhost:3001${userData.profilePic}`} alt="post" className="profile-photo"/>{post.username}</p>
                    <p>{post.bio}</p>
                </div>
                <div className="post-end">
                    <img src={`http://localhost:3001${post.post}`} alt="Post" />
                     <button className="like-button" > 💘 Like
                {post.likes}</button>
                </div>
              </div>

            ))
          )
          
          }

        </div>
      </div>
    </>
  );
}

export default Profile;

