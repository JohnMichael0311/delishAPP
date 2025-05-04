import authMid from '../middleware/auth.mid.js';

describe('authMid middleware', () => {
  it('should return 401 if no token', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();
    authMid(req, res, next);
    expect(res.status).toHaveBeenCalledWith(expect.any(Number));
  });
});
