import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserServices.js';

describe('demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('allows a user to signup via POST', async() => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ userName: 'userName', email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          userName: 'userName',
          email: 'test@test.com'
        });
      });
  });

  it('allows a user to login via POST', async() => {
    const user = await UserService.create({
      userName: 'userName',
      email: 'test@test.com',
      password: 'password'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    expect(res.body).toEqual({
      id: user.id,
      userName: 'userName',
      email: 'test@test.com'
    });
  });

  it('verifies a user is logged in', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      userName: 'userName',
      email: 'test@test.com',
      password: 'password'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    const res = await agent
      .get('/api/v1/auth/verify');

    expect(res.body).toEqual({
      id: user.id,
      userName: 'userName',
      email: 'test@test.com'
    });
  });

  it('throws a middleware error message when no token', async() => {
    return request(app)
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({ message: 'jwt must be provided', status: 401 });
      });
  });
    
});
