import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; //Шифрование пароля

import UserModel from '../models/User.js';

export const register = async (req, res) => { //1. Создаем реакцию на определенную ссылку(запрос) 2.Импортировали и добавили валидацию вторым аргументом.
  try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); //Алгоритм шифрования пароля.
    const hash = await bcrypt.hash(password, salt); // В этой переменной зашифрованный пароль.

    const doc = new UserModel({ //Изъятие полученных данных от клиента и помещение их в переменную.
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash
    });

    const user = await doc.save(); //Сохраняем полученные данные в переменную.

    const token = jwt.sign(
      { //Задаем параметры шифрования данных.
        _id: user._id, // 1 параметр , шифруем айди
      },
      'secret123', // 2 параметр, ключ шифрования
      {
        expiresIn: '30d', //3 параметр, срок действия валидности токена.
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ //Возвращаем всю инфу о юзере и сам токен.
      ...userData,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден.'
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль.'
      });
    }

    const token = jwt.sign(
      { //Задаем параметры шифрования данных.
        _id: user._id, // 1 параметр , шифруем айди
      },
      'secret123', // 2 параметр, ключ шифрования
      {
        expiresIn: '30d', //3 параметр, срок действия валидности токена.
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ //Возвращаем всю инфу о юзере и сам токен.
      ...userData,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => { //Добавили checkAuth как дополнительную проверку
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};