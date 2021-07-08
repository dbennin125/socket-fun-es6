import UserService from '../services/UserServices.js';

export default (req, res, next) => {
  try {
    const token = req.cookies.session;
    req.user = UserService.verifyAuthToken(token);
    next();

  } catch(err) {
    err.status = 401;
    next(err);
  }
};
