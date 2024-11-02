import { WritingPipe } from './writing.pipe';

describe('WritingPipe', () => {
  it('create an instance', () => {
    const pipe = new WritingPipe();
    expect(pipe).toBeTruthy();
  });
});
