import mongoose from "mongoose";
import bycrypt from 'bcryptjs'


const UserSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        minlenght : 6,
        required : true
    },
    //if you wanna keep something empty at beginning you can just make it as default : ""
    bio : {
        type : String,
        default : ''
    },

    profilePic : {
        type : String,
        default : ''
    },

    nativeLanguage : {
        type : String,
        default : ''
    },

    learningLanguage : {
        type : String,
        default : ''
    },

    location : {
        type : String,
        default : ''
    },
    //if user complete onboarding then he would allow to chatPage 
    //for we are using boolean value 
    isOnboarding : {
        type : Boolean,
        default : false
    },

    friends : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }]
    

}, { timestamps : true })


UserSchema.pre('save', async function(next) {
    //if password is not provided don't hash it
    if(!this.isModified('password')) return next()
        
    try {
        const saltRound = 10 
        const salt = await bycrypt.genSalt(saltRound)
        this.password = await bycrypt.hash(this.password,salt)
        next() 

    } catch (error) {
        next(error)
        console.log(`Error while converting password into hash : ${error}`)
    }
})

UserSchema.methods.matchPassword = async function(loginPassword) {
    const isValidPassword = await bycrypt.compare(loginPassword,this.password)
    return isValidPassword
}


const User = mongoose.model('User',UserSchema)

export default User