import express from 'express';
import { register,login,updateData, updateProfile } from '../controller/userController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadImageMiddleware.js';


const router=express.Router();

router.post('/register',register);
router.post('/login',login)
router.put('/update-data/:id',protect,updateData)
router.post('/update-profile',protect,upload.single('profileImage'),updateProfile)

export default router;