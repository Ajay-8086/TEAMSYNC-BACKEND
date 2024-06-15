import { Router } from "express";
// importing verification middleware
import { veryifyToken } from "../middlewares/auth";
//importing controller
import authController from "../controllers/authController";
//importing workspace controller
import workSpace from "../controllers/workSpaceController";

const router = Router()

// user signup
router.post('/auth/register',authController.createUser)
// verifying otp 
router.post('/auth/verify_otp',authController.verifyOtp)
// user login
router.post('/auth/login',authController.login)


// create workspace 
router.post('/workspace_create',veryifyToken,workSpace.createWorkSpace)
//searching members
router.post('/member_search',veryifyToken,workSpace.searchingMembers)


export default router