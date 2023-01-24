const {gql} = require('apollo-server');

module.exports = gql`
    type post{
     id: ID
     body: String
     createdAt: String
     username: String
     comments: [Comment]
     likes: [Like]
     likeCount: Int
     commentCount: Int
   }
   type Comment{
    id: ID
    createdAt: String
    username: String
    body: String
   }
   type Like{
    id:ID
    createdAt:String
    username: String
   }
   type User{
     id: ID
     email: String
     token: String
     username: String
     createdAt: String
   }
   input RegisterInput{
     username: String
     password: String
     confirmPassword: String
     email: String
   }
    type Query{
     getPosts : [post]
     getPost(postId : ID) : post
   }
    type Mutation{
        register(registerInput: RegisterInput): User
        login(username: String, password: String): User
        createPost(body: String): post
        deletePost(postId: ID): String
        createComment(postId: String, body: String): post
        deleteComment(postId: ID, commentId: ID): post
        likePost(postId: ID):post
    }
`