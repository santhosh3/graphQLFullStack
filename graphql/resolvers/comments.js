const postModel = require('../../models/Post');
const {UserInputError, AuthenticationError} = require('apollo-server');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation: {
        //createComment
        createComment: async(_,{postId,body},context)=>{
            const user = checkAuth(context);
            if(body.trim() === ''){
                throw new UserInputError('Empty comment',{
                    errors:{
                        body:"comment body must not empty"
                    }
                })
            }
            const post = await postModel.findById(postId);
            if(post){
                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post
            }else throw UserInputError('post not found')
        },
        //deleteComment
        async deleteComment(_,{postId,commentId},context){
            const user = checkAuth(context);
            const post = await postModel.findById(postId);
            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                if(post.comments[commentIndex].username === user.username){
                    post.comments.splice(commentIndex,1);
                    await post.save();
                    return post;
                }else{
                    throw new AuthenticationError("Action not allowed")
                }
            }
            else{
                throw new UserInputError("post not found")
            }
        }
    }
}