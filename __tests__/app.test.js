import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('gets a greetings via / route', async() => {
    return request(app)
      .get('/api/v1/greetings')
      .then(res => {
        expect(res.text).toEqual('Hi');
      });
  });
    
});
