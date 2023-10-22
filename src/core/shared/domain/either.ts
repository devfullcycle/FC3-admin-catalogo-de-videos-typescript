type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

type Value<Ok, Error> = Ok | Error;

export class Either<Ok = unknown, ErrorType = Error>
  implements Iterable<Value<Ok, ErrorType>>
{
  private _ok: Ok;
  private _error: ErrorType;

  private constructor(ok: Ok, error: ErrorType) {
    this._ok = ok;
    this._error = error;
  }

  get ok() {
    return this._ok;
  }

  get error() {
    return this._error;
  }

  isOk() {
    return this.ok !== null;
  }

  isFail() {
    return this.error !== null;
  }

  static safe<Ok = unknown, ErrorType = Error>(
    fn: () => Ok,
  ): Either<Ok, ErrorType> {
    try {
      return Either.ok(fn());
    } catch (e) {
      return Either.fail(e);
    }
  }

  static of<Ok, ErrorType = Error>(value: Ok): Either<Ok, ErrorType> {
    return Either.ok(value);
  }

  static ok<T, ErrorType = Error>(value: T): Either<T, ErrorType> {
    //@ts-expect-error  - error can be null
    return new Either(value, null);
  }

  static fail<ErrorType = Error, Ok = unknown>(
    error: ErrorType,
  ): Either<Ok, ErrorType> {
    //@ts-expect-error  - ok can be null
    return new Either(null, error);
  }

  /**
   * This method is used to transform the value into a new value.
   * The new value always will be a ok.
   */
  map<NewOk>(fn: (value: Ok) => NewOk): Either<NewOk, ErrorType> {
    if (this.isOk()) {
      return Either.ok(fn(this.ok));
    }
    return Either.fail(this.error);
  }

  /**
   * This method is used to create a new Either from the value of an Either.
   * The new Either can be a fail or a ok.
   */
  chain<NewOk, NewError = Error>(
    fn: (value: Ok) => Either<NewOk, NewError>,
  ): Either<NewOk, ErrorType | NewError> {
    if (this.isOk()) {
      return fn(this.ok);
    }
    return Either.fail(this.error);
  }

  /**
   * This method is used to create a new Either from the value of an Either.
   * This method is used to work with arrays.
   * If one of the values is a fail, the new Either will be a fail.
   * The new Either can be a fail or a ok.
   */
  chainEach<NewOk, NewError>(
    fn: (value: Flatten<Ok>) => Either<Flatten<NewOk>, Flatten<NewError>>,
  ): Either<NewOk, NewError> {
    if (this.isOk()) {
      if (!Array.isArray(this.ok)) {
        throw new Error('Method chainEach only works with arrays');
      }
      const result = this.ok.map((o) => {
        return fn(o);
      });
      const errors = result.filter((r) => r.isFail());
      if (errors.length > 0) {
        return Either.fail(errors.map((e) => e.error)) as any;
      }
      return Either.ok(result.map((r) => r.ok)) as any;
    }
    return Either.fail<ErrorType>(this.error) as any;
  }

  asArray(): [Ok, ErrorType] {
    return [this.ok, this.error];
  }

  [Symbol.iterator](): Iterator<Value<Ok, ErrorType>, any, undefined> {
    return new EitherIterator<Ok, ErrorType>({
      ok: this.ok,
      error: this.error,
    });
  }
}

class EitherIterator<Ok, Error>
  implements Iterator<Value<Ok, Error>, Value<Ok, Error>, undefined>
{
  private _value: { ok: Ok; error: Error };
  private index = 0;

  constructor(value: { ok: Ok; error: Error }) {
    this._value = value;
  }

  next(): IteratorResult<Value<Ok, Error>> {
    if (this.index === 0) {
      this.index++;
      return {
        value: this._value.ok,
        done: false,
      };
    }

    if (this.index === 1) {
      this.index++;
      return {
        value: this._value.error,
        done: false,
      };
    }

    return {
      value: null,
      done: true,
    };
  }
}
