import express from 'express';
import mongoose from "mongoose";
import {loginValidation, registerValidation} from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import {getMe, login, register} from "./controllers/UserController.js";
import {create, getAll, getLastTags, getOne, remove, update} from "./controllers/PostController.js";
import {postCreateValidation} from "./validations/post.js";
import multer from "multer";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import cors from "cors";
import * as fs from "fs";


mongoose
    .connect('mongodb+srv://reactdeveloper:P6GTUZzG0ZEi056d@cluster0.ow7te3j.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('DB connection failed',error);
    })

const app = express();

const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: function (_, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage})

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'))

app.post("/auth/login", loginValidation, handleValidationErrors, login)
app.post("/auth/register", registerValidation, handleValidationErrors, register)
app.get("/auth/me", checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', getLastTags)

app.get('/posts', getAll)
app.get('posts/tags', getLastTags)
app.get('/posts/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update)


app.listen(5000, (error) => {
    if (error) {
        console.log(error);
    }
    console.log('Server is running on port 5000');
})
