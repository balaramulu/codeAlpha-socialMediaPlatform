const mongoose = require('mongoose');

const connection = mongoose.connect("mongodb://localhost:27017/social_media");


connection.then(() =>
    console.log("Connected to MongoDB")
)
.catch((err) =>
    console.log("failed to connect mong db")
);


const UserSchama = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    bio:String,
    profilePic:String,
    following:{type:Number,default:0},
    followers:{type:Number,default:0},
    followingUsers:{type:[String],default:[]},
    followersUsers:{type:[String],default:[]}

});

const User = mongoose.model('user',UserSchama);

module.exports = User;