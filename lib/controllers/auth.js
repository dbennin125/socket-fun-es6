import { Router } from 'express';

import ensureAuth from '../middleware/ensure-auth.js';
import UserService from '../services/UserServices.js';

const attachCookieToUser = (res, user) => {
  res.cookie('session', UserService.authToken(user), {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameStie: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
};

export default Router()
  .post('/signup', (req, res, next) => {
    UserService
      .create(req.body)
      .then(user => {
        attachCookieToUser(res, user);
        res.send(user);
      })
      .catch(next);
  })
  .post('/login', (req, res, next) => {
    UserService
      .authorize(req.body) 
      .then(user => {
        attachCookieToUser(res, user);
        res.send(user);
      })
      .catch(next);
  })
  .get('/verify', ensureAuth, (req, res, next) => {
    try{
      res.send(req.user);
      next();
    }  catch(err) {
      res.status(500);
      next(err);
    }
  });
