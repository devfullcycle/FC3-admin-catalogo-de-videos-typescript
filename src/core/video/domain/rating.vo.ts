import { Either } from '../../shared/domain/either';
import { ValueObject } from '../../shared/domain/value-object';

export enum RatingValues {
  RL = 'L',
  R10 = '10',
  R12 = '12',
  R14 = '14',
  R16 = '16',
  R18 = '18',
}

export class Rating extends ValueObject {
  private constructor(readonly value: RatingValues) {
    super();
    this.validate();
  }

  private validate() {
    const isValid = Object.values(RatingValues).includes(this.value);
    if (!isValid) {
      throw new InvalidRatingError(this.value);
    }
  }

  static create(value: RatingValues): Either<Rating, InvalidRatingError> {
    return Either.safe(() => new Rating(value));
  }

  static createRL(): Rating {
    return new Rating(RatingValues.RL);
  }

  static create10(): Rating {
    return new Rating(RatingValues.R10);
  }

  static create12(): Rating {
    return new Rating(RatingValues.R12);
  }

  static create14(): Rating {
    return new Rating(RatingValues.R14);
  }

  static create16(): Rating {
    return new Rating(RatingValues.R16);
  }

  static create18(): Rating {
    return new Rating(RatingValues.R18);
  }

  static with = (value: RatingValues) => new Rating(value);
}

export class InvalidRatingError extends Error {
  constructor(value: any) {
    super(
      `The rating must be one of the following values: ${Object.values(
        RatingValues,
      ).join(', ')}, passed value: ${value}`,
    );
  }
}
