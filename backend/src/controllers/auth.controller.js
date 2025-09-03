import { generateToken } from "../lib/utils.js";
import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import bycrypt from 'bcryptjs'
import { upsertStreamUser } from "../lib/stream.js";


export const signupRoute = async (req,res) => {
    const { email , fullName , password } = req.body;
    try {
        
        if(!email || !fullName || !password ){
            return res.status(400).json({
                message : 'All fields are required'
            })
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!regex.test(email)){
            return res.status(400).json({
                Error : 'Invalid email format'
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                message : 'password must be at least 6 character'
            })
        }


        const user = await User.findOne({ email })

        if(user){
            return res.status(401).json({
                message : 'email already exist, please use different email to signup'
            })
        }

        
        //generate random number betn 1 to 100
        const index = Math.floor(Math.random() * 100) + 1;
        const avatar = `https://avatar.iran.liara.run/public/${index}`;
        
                
        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic : avatar
        })

        try {
            await upsertStreamUser({
                id : newUser._id.toString(),
                name : newUser.fullName,
                image : newUser.profilePic || '',
            });
            
            console.log(`stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log(`Error while creating stream user : ${error}`);
        }

        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn : '7d'
        })

        res.cookie('jwt',token,{
            maxAge : 7 * 24 * 60 * 60 * 100,
            httpOnly : true,
            sameSite : 'strict',
            secure : process.env.NODE_ENV === 'production'

        })

        res.status(201).json({success : true, user : newUser})

    } catch (error) {
        console.log(`Error in singup route controller : ${error}`)
        res.status(500).json({
            error : 'Internal server error'
        })
    }

} 


export const loginRoute = async (req,res) => {
    try {

        const { email , password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                message : 'All fields are required'
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                message : 'Invalid email or password please try again'
            })
        }


        // const isValidPassword = await bycrypt.compare(password,user.password) 
        const isValidPassword = await user.matchPassword(password)

        if(!isValidPassword){
            return res.status(401).json({
                message : 'Invalid email or password please try again'
            })
        }

        generateToken(user._id,res)

        res.status(201).json({ success : true ,message : 'logged in succesfully', user : user})


    } catch (error) {
        console.log(`Error in login controller : ${error}`)
        res.status(500).json({
            message : 'Internal server error'
        })
    }
}


export const logoutRoute = async (req,res) => {

    try {
        res.clearCookie('jwt')
        res.status(200).json({
            message : 'logout successfully'
        })
    } catch (error) {
        console.log(`Error in logout controller : ${error} `)
        res.status(500).json({
            message : 'Internal server error'
        })   
    }

}

export const onboard = async (req,res) => {
    try {
        const userId = req.user._id;
        const { fullName , bio , nativeLanguage , location , learningLanguage } = req.body;

        if(!fullName || !bio || !nativeLanguage || !location || !learningLanguage){
            return res.status(400).json({
                message : 'All fields are required',
                missingField : [
                    !fullName && 'fullName',
                    !bio && 'bio',
                    !nativeLanguage && 'nativalanguage',
                    !location && 'location',
                    !learningLanguage && 'learninglanguage'
                ].filter(Boolean)
            });
        }

        const user = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarding : true,
        },{ new : true }).select('-password')
      
        if(!user){
            return res.status(404).json({
                message : 'user not found'
            });
        }    

        try {
            await upsertStreamUser({
                id : user._id,
                name : user.fullName,
                image : user.image
            })
            
            console.log('stream user updated after onboarding ',user.fullName);
        } catch (streamError) {
            console.log(`Error updating stream user during onboarding : ${streamError}` )
        }


        res.status(200).json({
            success : true,
            message : 'onboarding completed',
            user : user
        })

    } catch (error) {
        console.log(`Error in Onboard route controller : ${error}`);
        res.status(500).json({
            message : 'Internal server error'
        })
    }
}