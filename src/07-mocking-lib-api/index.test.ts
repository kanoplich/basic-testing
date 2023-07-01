import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const axiosSpy = jest.spyOn(axios.Axios.prototype, 'get');

    await throttledGetDataFromApi('/users');
    expect(axiosSpy).toHaveBeenCalled();
  });

  test('should perform request to correct provided url', async () => {
    const response = { data: 'some data' };
    const axiosSpy = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementation(async () => ({ data: response }));
    await throttledGetDataFromApi('some-path');
    jest.runAllTimers();

    const getRelativePath = axiosSpy.mock.calls[0]?.[0];
    expect(axiosSpy).toHaveBeenLastCalledWith(getRelativePath);
  });

  test('should return response data', async () => {
    const response = { data: 'some data' };
    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementation(async () => ({ data: response }));

    const result = await throttledGetDataFromApi('some-path');
    expect(result).toEqual(response);
  });
});
