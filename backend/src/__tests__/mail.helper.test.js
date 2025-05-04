import { sendEmailReceipt } from '../helpers/mail.helper.js';
jest.mock('../config/mail.config.js', () => ({
  getClient: () => ({
    messages: {
      create: jest.fn().mockResolvedValue({ id: 'mocked' }),
    },
  }),
}));
jest.mock('../helpers/mail.helper.js', () => {
  const original = jest.requireActual('../helpers/mail.helper.js');
  return {
    ...original,
    getReceiptHtml: () => '<div>Mocked Receipt</div>',
  };
});
describe('sendEmailReceipt', () => {
  it('should not throw when called with mock order', () => {
    const mockOrder = {
      id: '123',
      user: { email: 'test@example.com' },
      createdAt: new Date(),
      items: [],
    };
    expect(() => sendEmailReceipt(mockOrder)).not.toThrow();
  });
});
