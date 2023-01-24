const userModel = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../../config');
const {UserInputError} = require('apollo-server');
const {validateRegisterInput, 
       validateLoginInput
      } = require('../../util/validators');

function generateToken(user){
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY,
        {expiresIn: '1h'}
    );
}

module.exports = {

    Mutation: {

       async login(parent, {username,password}, context, info){
             const {errors, valid} = validateLoginInput(username,password);
             if(!valid){
                throw new UserInputError('Errors', {errors})
             }
             const user = await userModel.findOne({username});
             if(!user){
                errors.general = 'User not found';
                throw new UserInputError("User not found", {errors})
             }
             const match = await bcrypt.compare(password,user.password);
             if(!match){
                errors.general = 'wrong crendetials';
                throw new UserInputError("wrong crendetials", {errors});
             }

             const token = generateToken(user);

             return {
                ...user._doc,
                id: user._id,
                token
             }
       },
       async register(parent,
                 {
                    registerInput: {username,email,password,confirmPassword} 
                 },
                 ){
        
            //validate user Data
            const {valid,errors} = validateRegisterInput(username,email,password,confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }
            // make sure user doesnt exist
            const user = await userModel.findOne({username});
            if(user){
                throw new UserInputError("userName is taken",{
                    errors: {
                        username: "This username is taken"
                    }
                })
            }
            password = await bcrypt.hash(password,12);
            const newUser = new userModel({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });
            const res = await newUser.save();
            const token = generateToken(res);

            return{
                ...res._doc,
                id: res._id,
                token
            };
      
      },
    }
}