import { ValueObject } from '../shared/domain/value-object';
import { FieldsErrors } from './shared/domain/validators/validator-fields-interface';

declare global {
  namespace jest {
    interface Matchers<R> {
      //containsErrorMessages: (expected: FieldsErrors) => R;
      notificationContainsErrorMessages: (expected: Array<FieldsErrors>) => R;
      toBeValueObject: (expected: ValueObject) => R;
    }
  }
}
