import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&amp;*(),.?":{}|&lt;&gt;])(?=.{8,})/;
    return regex.test(password);
  }

  defaultMessage() {
    return 'Password must contain at least one uppercase letter, one special character, and be at least 8 characters long.';
  }
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
}
