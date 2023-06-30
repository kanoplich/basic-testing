import { getBankAccount } from '.';

jest.mock('lodash');

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(42);
    expect(bankAccount.getBalance()).toBe(42);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(42);
    expect(() => bankAccount.withdraw(50)).toThrow(
      `Insufficient funds: cannot withdraw more than ${bankAccount.getBalance()}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount = getBankAccount(42);
    const toBankAccount = getBankAccount(0);
    expect(() => bankAccount.transfer(50, toBankAccount)).toThrow(
      `Insufficient funds: cannot withdraw more than ${bankAccount.getBalance()}`,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(42);
    expect(() => bankAccount.transfer(40, bankAccount)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(42);
    bankAccount.deposit(100);
    expect(bankAccount.getBalance()).toBe(142);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(42);
    bankAccount.withdraw(32);
    expect(bankAccount.getBalance()).toBe(10);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(42);
    const toBankAccount = getBankAccount(0);
    bankAccount.transfer(22, toBankAccount);
    expect(bankAccount.getBalance()).toBe(20);
    expect(toBankAccount.getBalance()).toBe(22);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount = getBankAccount(42);
    const mockFetchBalance = jest.spyOn(bankAccount, 'fetchBalance');

    mockFetchBalance.mockResolvedValue(1);
    await expect(bankAccount.fetchBalance()).resolves.toEqual(
      expect.any(Number),
    );
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(42);
    bankAccount.fetchBalance = jest.fn().mockReturnValue(20);

    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(20);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(42);
    bankAccount.fetchBalance = jest.fn().mockReturnValue(null);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
