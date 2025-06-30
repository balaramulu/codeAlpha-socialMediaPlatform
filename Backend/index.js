const express = require('express');
const cors = require('cors');
const SignUpModel = require('./models/SignUpModel.js')
const bcrypt = require('bcrypt');
const path = require('path')
const multer = require('multer')
const PostsModel = require('./models/PostsModel.js')


const app = express();
app.use(express.json());
app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




//profile storage

const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, 'uploads/profiles');
  },
  filename:  (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix); 
  }
});

const profile = multer({storage:storage})

app.post('/SignUp',profile.single('profilePic'), async (req,res)=>{
    try{
        const { username, email, password, bio } = req.body;
        const profilePic = req.file ? `/uploads/profiles/${req.file.filename}` : '/uploads/profiles/default.jpeg';
        const existenceOfUser = await SignUpModel.findOne({username});

        if(existenceOfUser){
            return res.json({message:"User already exists"});
        }

        const hashPassword = await bcrypt.hash(password ,10);

        const user = await SignUpModel.create({username,email,password : hashPassword,bio,profilePic});

        if(user){
            return res.json({message:"User created successfully"});
        }


        // const insert = SignUpModel.create(req.body)
    }
    catch(err){
        console.log(err);
    }
})


app.post('/Login', async (req,res) =>{
    try{
        const {username,password} = req.body;
        const user = await SignUpModel.findOne({username});
        if(!user){
            return res.json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(isMatch){
            return res.json({message:"Login sucessfully",success : true,user:username});
        }  
        else{
            return res.json({message:"Invalid password",success : false});
        }
    }
    catch(err){
        console.log(err);
    }
})



app.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await SignUpModel.findOne({ username });
    if (!user) return res.json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



//posts storage

const postStorage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, 'uploads/posts');
  },
  filename:  (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix); 
  }
});

const posts = multer({storage:postStorage})

//store the posts created

app.post('/post',posts.single('post'),async (req,res) =>{
  try{
    const {username,postBio,likes} = req.body;
    const postFile = req.file ? `/uploads/posts/${req.file.filename}` : '';

    const post = PostsModel.create({username,post:postFile,bio:postBio,likes});
    if(post){
      res.json({message:"post created successfully"})
    }

  }
  catch(err){
    console.log(err);
  }
})




//brig the post to home page


app.get('/posts/:username',async (req,res) =>{
  try{
    const { username } = req.params;
    const posts = await PostsModel.find({ username: { $ne: username } });
    res.json(posts);
    }
    catch(err){
      console.log(err);
      }
})

//post belongs to single user

app.get('/post/:username',async (req,res) =>{
  try{
    const { username } = req.params;
    const SingleUserPosts = await PostsModel.find({username});
    if(!SingleUserPosts) return res.json({message:"error to find posts server busy"})
    res.json(SingleUserPosts);
  }
  catch(err){
    console.log("error");
  }
})

//to increase likes control

app.put('/posts/like/:id', async (req, res) => {
  const { username } = req.body;
  const postId = req.params.id;

  try {
    const post = await PostsModel.findById(postId);
    if (post.likedBy.includes(username)) {
      // Unlike
      post.likedBy = post.likedBy.filter(user => user !== username);
      post.likes = Math.max(post.likes - 1, 0);
    } else {
      // Like
      post.likedBy.push(username);
      post.likes += 1;
    }

    await post.save();
    res.json({ likes: post.likes, likedBy: post.likedBy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




//add followers

app.put('/followingUpdate/:postUsername', async (req, res) => {
  const { postUsername } = req.params;
  const { username: accUserName } = req.body;

  try {
    const addFollower = await SignUpModel.findOne({ username: postUsername });
    const addFollowing = await SignUpModel.findOne({ username: accUserName });

    if (!addFollower || !addFollowing) {
      return res.json({ message: "User not " });
    }

    let action;

    if (addFollower.followersUsers.includes(accUserName) && addFollowing.followingUsers.includes(postUsername)) {
      // Unfollow
      addFollower.followersUsers = addFollower.followersUsers.filter(user => user !== accUserName);
      addFollower.followers = Math.max(addFollower.followers - 1, 0);

      addFollowing.followingUsers = addFollowing.followingUsers.filter(user => user !== postUsername);
      addFollowing.following = Math.max(addFollowing.following - 1, 0);

      action = "unfollowed";
    } else {
      // Follow
      addFollower.followersUsers.push(accUserName);
      addFollower.followers += 1;

      addFollowing.followingUsers.push(postUsername);
      addFollowing.following += 1;

      action = "followed";
    }

    await addFollower.save();
    await addFollowing.save();

    res.json({
      message: action,
      follower: addFollower,
      following: addFollowing
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

  


app.listen(3001,()=>{
    console.log('server is running on port 3000');
})  