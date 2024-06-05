import { Router } from "express";

//importing controller
import authController from "../controllers/authController";
const router = Router()

// user signup
router.post('/register',authController.createUser)
// verifying otp 
router.post('/verify_otp',authController.verifyOtp)
// user login
router.post('/login',authController.login)

export default router