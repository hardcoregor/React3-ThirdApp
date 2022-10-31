import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),  //Проверка есть ли емейл корректный, пропускаем и т.д.
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }), //Минимум 5 символов в пароле должно быть.
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),  //Проверка есть ли емейл корректный, пропускаем и т.д.
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }), //Минимум 5 символов в пароле должно быть.
  body('fullName', 'Укажите имя').isLength({ min: 3 }), //Минимум 3 символов в имени должно быть.
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),  //Проверка есть ли емейл корректный, пропускаем и т.д.
  body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(), //Минимум 5 символов в пароле должно быть.
  body('tags', 'Неверный формат тэгов.').optional().isString(), //Минимум 3 символов в имени должно быть.
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];