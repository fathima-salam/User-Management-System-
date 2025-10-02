import express from 'express'
import { addUser, adminLogin, dataFetching, deleteUser, updateUser } from '../controller/adminController.js';
import { protectAdmin,admin } from '../middleware/adminAuthMiddleware.js';


const router=express.Router();

router.post('/login',adminLogin)
router.get('/dataFetching',protectAdmin,admin,dataFetching)
router.post('/addUser',protectAdmin,admin,addUser);
router.put('/updateUser',protectAdmin,admin,updateUser)
router.delete('/deleteUser',protectAdmin,admin,deleteUser)

export default router;