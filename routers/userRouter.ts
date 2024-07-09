import { Router } from "express";
// importing verification middleware
import { veryifyToken } from "../middlewares/auth";
//importing controller
import authController from "../controllers/authController";
//importing workspace controller
import workSpace from "../controllers/workSpaceController";
import board from "../controllers/boardController";
import task from "../controllers/taskController";

const router = Router()

// user signup
router.post('/auth/register',authController.createUser)
// verifying otp 
router.post('/auth/verify_otp',authController.verifyOtp)
// user login
router.post('/auth/login',authController.login)
// user profile
router.post('/profile_create',veryifyToken,authController.profile)
// user profile get
router.get('/profile/:userId',veryifyToken,authController.getProfile)

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
// getting all the workspace invitations
router.get('/invitations',veryifyToken,workSpace.getPendingInvitations)

//board creation
router.post('/boards_create',veryifyToken,board.creatingBoard)
//adding star to board
router.patch('/boards/ad_to_star',veryifyToken,board.toggleStar)
// getting board details 
router.get('/user/boards/:boardId',veryifyToken,board.getBoardDetails)
// creating the columns in the task
router.post('/user/boards/create_column',veryifyToken,board.createColumn)


// creating the task
router.post('/user/task/create',veryifyToken,task.creatingTask)
// updating task and its postion
router.put('/task/position',veryifyToken,task.updatingTaskAndColumn)

export default router