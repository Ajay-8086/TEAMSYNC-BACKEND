import { Router } from "express";
// importing verification middleware
import { veryifyToken } from "../middlewares/auth";
//importing controller
import authController from "../controllers/authController";
//importing workspace controller
import workSpace from "../controllers/workSpaceController";
import board from "../controllers/boardController";

const router = Router()

// user signup
router.post('/auth/register',authController.createUser)
// verifying otp 
router.post('/auth/verify_otp',authController.verifyOtp)
// user login
router.post('/auth/login',authController.login)

// getting workspaces
router.get('/workspace',veryifyToken,workSpace.gettingWorkspace)
// create workspace 
router.post('/workspace_create',veryifyToken,workSpace.createWorkSpace)
//searching members
router.post('/member_search',veryifyToken,workSpace.searchingMembers)
//Inviting members
router.post('/invite',veryifyToken,workSpace.invitingMembers)
//workspacedetails
router.get('/user/workspaces/:workspaceId',veryifyToken,workSpace.workspaceDetails)
//deleting workspace
router.delete('/user/workspace_delete/:workspaceId',veryifyToken,workSpace.deleteWorkspace)

//board creation
router.post('/boards_create',veryifyToken,board.creatingBoard)
//adding star to board
router.patch('/boards/ad_to_star',veryifyToken,board.toggleStar)
export default router