import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from 'supertest';

//@ts-expect-error - this is a hack to extend the Test class
Test.prototype.authenticate = function (
  app: INestApplication,
  forceAdmin = true,
) {
  const jwtService = app.get(JwtService);
  const token = jwtService.sign(
    forceAdmin
      ? {
          realm_access: {
            roles: ['admin-catalog'],
          },
        }
      : {},
  );
  return this.set('Authorization', `Bearer ${token}`);
};
