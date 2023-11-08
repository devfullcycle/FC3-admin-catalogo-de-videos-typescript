import { Rating, RatingValues, InvalidRatingError } from '../rating.vo';

describe('Rating Value Object', () => {
  it('should create a valid Rating', () => {
    const rating = Rating.with(RatingValues.R10);
    expect(rating.value).toBe(RatingValues.R10);
  });

  it('should fail to create a Rating with invalid value', () => {
    expect(() => Rating.with('invalid' as any)).toThrow(InvalidRatingError);
  });

  it('should create a Rating with RL value', () => {
    const rating = Rating.createRL();
    expect(rating.value).toBe(RatingValues.RL);
  });

  it('should create a Rating with R10 value', () => {
    const rating = Rating.create10();
    expect(rating.value).toBe(RatingValues.R10);
  });

  it('should create a Rating with R12 value', () => {
    const rating = Rating.create12();
    expect(rating.value).toBe(RatingValues.R12);
  });

  it('should create a Rating with R14 value', () => {
    const rating = Rating.create14();
    expect(rating.value).toBe(RatingValues.R14);
  });

  it('should create a Rating with R16 value', () => {
    const rating = Rating.create16();
    expect(rating.value).toBe(RatingValues.R16);
  });

  it('should create a Rating with R18 value', () => {
    const rating = Rating.create18();
    expect(rating.value).toBe(RatingValues.R18);
  });
});
