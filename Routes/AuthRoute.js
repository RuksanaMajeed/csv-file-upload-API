const { SignUp, Login, userVerfication, uploadController } = require("../Controllers/AuthController");
// const uploadController = require("../Controllers/UploadController")

const router = require("express").Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/upload", uploadController)
router.post('/', userVerfication)
module.exports = router;