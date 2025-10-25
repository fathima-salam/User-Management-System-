import express from 'express';
import { register, login, updateData, updateProfile } from '../controller/userController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadImageMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update-data/:id', protect, updateData);

router.post('/update-profile', protect, (req, res, next) => {
    const uploadSingle = upload.single('profileImage');
    
    uploadSingle(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        }
        
        next();
    });
}, updateProfile);

export default router;