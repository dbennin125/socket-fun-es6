import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export default  class UserService {
  static async create({ userName, email, password }) {
    const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    const user = await User.insert({ userName, email, passwordHash });
    return user;
  }

  static async authorize({ email, password }) {
    try {
      const user = await User.findByEmail(email);
      const matchedPassword = await bcrypt.compare(password, user.passwordHash);
      
      if(!matchedPassword) throw new Error('Invalid Password');
      else return user;

    } catch(err) {
      err.status = 401;
      throw err;
    }
  }

  static authToken(user) {
    return jwt.sign({ user: user.toJSON() }, process.env.APP_SECRET, {
      expiresIn: '24h'
    });
  }
  
  static verifyAuthToken(token) {
    const { user } = jwt.verify(token, process.env.APP_SECRET);
    return user;
  }
  
}
