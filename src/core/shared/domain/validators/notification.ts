export class Notification {
  errors = new Map<string, string[] | string>();

  addError(error: string, field?: string) {
    if (field) {
      const errors = (this.errors.get(field) ?? []) as string[];
      errors.indexOf(error) === -1 && errors.push(error);
      this.errors.set(field, errors);
    } else {
      this.errors.set(error, error);
    }
  }

  setError(error: string | string[], field?: string) {
    if (field) {
      this.errors.set(field, Array.isArray(error) ? error : [error]);
    } else {
      if (Array.isArray(error)) {
        error.forEach((value) => {
          this.errors.set(value, value);
        });
        return;
      }
      this.errors.set(error, error);
    }
  }

  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  copyErrors(notification: Notification) {
    notification.errors.forEach((value, field) => {
      this.setError(value, field);
    });
  }

  toJSON() {
    const errors: Array<string | { [key: string]: string[] }> = [];
    this.errors.forEach((value, key) => {
      if (typeof value === 'string') {
        errors.push(value);
      } else {
        errors.push({ [key]: value });
      }
    });
    return errors;
  }
}
