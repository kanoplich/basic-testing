import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    __esModule: true,
    ...originalModule,
    mockOne: () => console.log('mockOne'),
    mockTwo: () => console.log('mockTwo'),
    mockThree: () => console.log('mockThree'),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const logSpy = jest.spyOn(console, 'log');

    mockOne();
    mockTwo();
    mockThree();

    expect(logSpy).toHaveBeenCalledWith('mockOne');
    expect(logSpy).toHaveBeenCalledWith('mockTwo');
    expect(logSpy).toHaveBeenCalledWith('mockThree');

    logSpy.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const logSpy = jest.spyOn(console, 'log');

    unmockedFunction();
    expect(logSpy).toHaveBeenCalledWith('I am not mocked');

    logSpy.mockRestore();
  });
});
