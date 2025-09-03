import express from 'express'
import { loginRoute, signupRoute ,logoutRoute, onboard } from '../controllers/auth.controller.js'
import { protectRoute } from '../middlewares/auth.middle.js'


const router = express.Router()

router.post('/signup',signupRoute)
router.post('/login',loginRoute)
router.post('/logout',logoutRoute)

router.post('/onboarding', protectRoute ,onboard)

router.get('/me', protectRoute, (req,res) => {
    res.status(200).json({success : true, user : req.user})
})


export default router