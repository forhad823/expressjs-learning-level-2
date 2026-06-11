import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();


// creating users
router.post("/", userController.createUser);

// getting all users
router.get("/", auth(USER_ROLE.admin, USER_ROLE.agent), userController.getAllUser);

// getting a single user
router.get("/:id", userController.getSingleUser);

// --- Update user
router.put("/:id", userController.updateUser);

// --- Delete user
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
