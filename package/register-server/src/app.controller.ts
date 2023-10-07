import { Body, Controller, Get, Header, Headers, HttpCode, HttpStatus, Options, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterStartDto } from './app.dto';
import { PublicKeyCredentialCreationOptionsJSON } from '@github/webauthn-json/dist/types/basic/json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register-start')
  @Header('Access-Control-Allow-Origin', '*') // FIXME
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  async registerStart(@Body() body: RegisterStartDto): Promise<PublicKeyCredentialCreationOptionsJSON> {

    return this.appService.registerStart(body);
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
