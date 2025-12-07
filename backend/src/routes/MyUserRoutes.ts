import express from 'express';
import { createCurrentUser, getCurrentUser, updateCurrentUser } from './../controllers/MyUserController.js'
import { jwtCheck, jwtParse } from '../middleware/auth.js';
import { validateMyUserRequest } from '../middleware/validation.js';

const router = express.Router();

router.get("/", jwtCheck, jwtParse, getCurrentUser)
router.post("/", jwtCheck, createCurrentUser)
router.put("/", jwtCheck, jwtParse, validateMyUserRequest, updateCurrentUser)


export default router;