import {
  Body,
  Controller,
  Header,
  HttpCode,
  Options,
  Post,
} from '@nestjs/common';
import { LoginService } from './login.service';

import {
  LoginCompleteRequestDto,
  LoginCompleteResponseDto,
  LoginStartResponseDto,
} from './login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('start')
  @Header('Access-Control-Allow-Origin', '*') // FIXME
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  async loginStart(): Promise<LoginStartResponseDto> {
    return this.loginService.loginStart();
  }

  @Post('complete')
  @Header('Access-Control-Allow-Origin', '*') // FIXME
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  async loginCompelete(
    @Body() body: LoginCompleteRequestDto,
  ): Promise<LoginCompleteResponseDto> {
    return this.loginService
      .loginComplete(body)
      .then((v) => ({ encrypted: v }));
  }

  /**
   * For preflight request
   * @returns
   */
  @Options('/*')
  @HttpCode(200)
  @Header('Access-Control-Allow-Origin', '*') // FIXME
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  option(): void {
    return;
  }
}
