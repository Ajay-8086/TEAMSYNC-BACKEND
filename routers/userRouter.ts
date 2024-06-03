import { Router } from "express";

//importing controller
import authController from "../controllers/authController";
const router = Router()

// user signup
router.post('/signup',authController.createUser)

export default router