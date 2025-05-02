import { ExchangeRatePipe } from './multiply.pipe';

describe('MultiplyPipe', () => {
  it('create an instance', () => {
    const pipe = new ExchangeRatePipe();
    expect(pipe).toBeTruthy();
  });
});
