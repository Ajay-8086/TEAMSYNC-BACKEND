import { Router } from "express";

//importing controller
import authController from "../controllers/authController";
const router = Router()

// user signup
router.post('/register',authController.createUser)
// verifying otp 
router.post('/verify_otp',authController.verifyOtp)

export default router