import express from "express";
import { deleteUser, getAllUsers, updateAdminProfile } from "../controllers/adminController.js";
import { isAdmin, protect} from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Only admin can manage users
router.delete("/user/:id", protect, isAdmin, deleteUser);
router.get("/users", protect, isAdmin, getAllUsers);

router.put('/admin-profile', protect, isAdmin, upload.single('image'), updateAdminProfile);

export default router;