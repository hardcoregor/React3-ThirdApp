import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123'); //Расшифровка токена с помощью фразы которой шифровали.

      req.userId = decoded._id;
      next(); //Если все окей, то даем команду продолжать выполнять следующие функции.
    } catch (error) {
      return res.status(403).json({ //Если не смогли расшифровать, то выдаем ошибку.
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({  // От лица сервера отправляем ответ с ошибкой если токена нет
      message: 'Нет доступа',
    });
  }
};