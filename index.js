const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');
const {MONGODB} = require('./config');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');


const server = new ApolloServer({
    typeDefs, resolvers,
    context: ({ req }) => ({ req })
})
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB, {useNewUrlParser:true})
    .then(() => {
        console.log("MongoDB is connected")
        return server.listen({port:5000})
     }).then((res) => {
    console.log(`server running on ${res.url}`)
}).catch(err => console.log(err))
      

//kong hq
//microservice gateway
//ApI six apachi
//tyk.io
//express gateway.io
//krakend.io
//wso2.com
