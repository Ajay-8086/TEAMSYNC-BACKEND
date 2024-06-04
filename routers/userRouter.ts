import { Router } from "express";

//importing controller
import authController from "../controllers/authController";
const router = Router()

// user signup
router.post('/register',authController.createUser)

export default router