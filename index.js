import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose'; // Connect to base.

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { handleValitaionErrors, checkAuth } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect('mongodb+srv://admin:wwwwww@cluster0.nl81gg9.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({ //Create storage for image.
  destination: (_, __, cb) => { //First two args empty , last callback
    cb(null, 'uploads'); //1st dont receive any errors, 2nd save imgs to uploads folder.
  },
  filename: (_, file, cb) => { //2nd arg (filename which we are receive)
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); //This string deciphers post request which comes with auth data.
app.use(cors());
app.use('/uploads', express.static('uploads')); //redirect all get request on /uploads to uploads folder and check for coincidence filenames and show suitable.

app.post('/auth/login', loginValidation, handleValitaionErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValitaionErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValitaionErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValitaionErrors, PostController.update);

app.listen(4444, (err) => { //Run app on 4444 port.
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});