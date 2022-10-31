import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
  .connect('mongodb+srv://admin:wwwwww@cluster0.nl81gg9.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.get('/', (req, res) => { //Если приходит на главный путь, то выполняет функцию которая вернет 2 параметра. Req= что прислал клиент. Res = что высылаем клиенту.
  res.send('Hello world');
});

app.use(express.json()); //Это строчка расшифровывает post запрос который приходит с данными авторизации.

app.post('/auth/login', (req, res) => {

  const token = jwt.sign({ //Задаем параметры, что шифруем.
    email: req.body.email,
    fullName: 'Василий Масилий'
  },
    'secret123'
  );

  res.json({  //Ответ от сервера клиенту
    success: true,
    token
  });
});

app.listen(4444, (err) => { //Запустили приложение на порту 4444
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});