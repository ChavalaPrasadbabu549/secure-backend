import { Router } from "express";
import {
    register,
    verifyregister,
    login,
    verifylogin,
    Getall,
    Updateuser,
    GetuserId
} from "../controllers/UserController";
import { isAuth } from "../middleware/auth";


const router = Router();
router.post("/register", register);
router.post("/verifyregister", verifyregister);
router.post("/login", login);
router.post("/verifylogin", verifylogin);
router.put("/update/:userId", isAuth, Updateuser);
router.get("/:userId", isAuth, GetuserId);
router.get("/getProfile", Getall);


export default router;
