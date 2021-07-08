import { Router } from 'express';

export default Router()
  .get('/', (req, res, next) => {
    try {
      res.send('Hi');
      next();
  
    } catch(err) {
      err.status = 500;
      next(err);
    }
  });
