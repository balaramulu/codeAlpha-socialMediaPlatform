const mongoose = require('mongoose')


const connection = mongoose.connect("mongodb://localhost:27017/social_media")

connection.then(() =>
    console.log("Connected to MongoDB")
)
.catch((err) =>
    console.log("failed to connect mong db")
);


const PostSchema = new mongoose.Schema({
    username:String,
    post:String,
    bio:String,
    likes:{type:Number,default:0},
    likedBy : {type:[String],default:[]}
    
});

const Post = mongoose.model('posts',PostSchema);

module.exports = Post;