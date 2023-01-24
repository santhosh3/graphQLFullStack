const postModel = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const {AuthenticationError,UserInputError} = require('apollo-server')

module.exports = {
    Query: {
        async getPosts(){
            try {
                const posts = await postModel.find().sort({createdAt:-1});
                return posts
            } catch (error) {
              throw new Error(error)
            }
        },
        async getPost(_,{postId}){
            try {
                const post = await postModel.findById(postId);
                if(post) {
                    return post
                }
                else {
                    throw new Error("Post not found");
                }
            } catch (error) {
              throw new Error(error)
            }
        }
    },
    Mutation:{
        async createPost(_,{body},context){
            const user = checkAuth(context);
            if (body.trim() === '') {
              throw new Error('Post body must not be empty');
            }
            const newPost = new postModel({
              body,
              user: user.id,
              username: user.username,
              createdAt: new Date().toISOString()
            });
      
            const post = await newPost.save();
            return post;
        },
        async deletePost(_,{postId},context){
            const user = checkAuth(context);
            try{
                const post = await postModel.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return "post deleted successfully"
                }else{
                    throw new AuthenticationError("Action not allowed")
                }
            }catch(error){
                throw new Error(error)
            }
        },
        async likePost(_, {postId}, context){
            const {username} = checkAuth(context);
            const post = await postModel.findById(postId);

            if(post){
                if(post.likes.find(like => like.username === username)){
                    // already post like, unlike it
                    post.likes = post.likes.filter(like => like.username !== username);
                }else{
                    // Not liked, like the post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post
            }else throw new UserInputError("Post not found")
        }
    }
}