import express from "express";
import {
    SignUp,
    Login,
    userVerfication,
    uploadController,
} from "../Controllers/AuthController";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/upload", uploadController)
router.post('/', userVerfication)
module.exports = router;