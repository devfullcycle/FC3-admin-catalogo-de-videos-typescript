import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(email: string, password: string) {
    //alguma logica para buscar o usuário no banco pelo e-mail
    //verificar as senhas
    const payload = { email, name: 'test' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
