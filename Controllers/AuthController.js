import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import multer from "multer";
import path from "path";
import User from "../Models/UserModel";
import { createSecretToken } from "../Util/SecretToken";
import csvProcessor from "../Queue/Queue";


export const SignUp = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        const user = await User.create({
            email, password, username, createdAt,
        });
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: true,
        });
        res.status(201).json({
            message: "User signed in successfully", success: true, user
        });
        next();
    } catch (err) {
        console.error(err);
    }
}

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: 'All fields are required' })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'Incorrect password or email' })
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: 'Incorrect password or email' })
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        })
        res.status(201).json({
            message: "User Logged in successfully", success: true
        })
        next();
    } catch (err) {
        console.error(err);
    }
}

export const uploadController = async (req, res) => {
    const upload = multer({ dest: 'uploads/' });

    await upload.single('file');
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    try {
        // Add job to queue
        await csvProcessor.add({ filePath });
        res.status(200).send({ message: 'File uploaded and processing started' });
    } catch (err) {
        res.status(500).send({ message: 'Failed to process file' });
    }
}

export const userVerfication = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({ status: false })
        } else {
            const user = await User.findById(data.id);
            if (user) return res.json({ status: true, user: user.username })
            else return res.json({ status: false })
        }
    })
}

export const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ message: 'No token provided.' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send({ message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
};
