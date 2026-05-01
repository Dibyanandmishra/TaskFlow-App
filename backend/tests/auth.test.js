const request = require('supertest');
const app = require('../src/app');

describe('Auth Endpoints', () => {
  it('should return 401 if token is not provided to protected route', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toEqual(false);
  });
});
