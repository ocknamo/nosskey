import {
  Body,
  Controller,
  Header,
  HttpCode,
  Options,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  RegisterCompleteRequestDto,
  RegisterStartRequestDto,
  RegisterStartResponseDto,
} from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register-start')
  @Header('Access-Control-Allow-Origin', '*') // FIXME
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  async registerStart(
    @Body() body: RegisterStartRequestDto,
  ): Promise<RegisterStartResponseDto> {
    return this.appService.registerStart(body);
  }

  @Post('register-complete')
  @Header('Access-Control-Allow-Origin', '*') // FIXME
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  async registerCompelete(
    @Body() body: RegisterCompleteRequestDto,
  ): Promise<boolean> {
    return this.appService.registerComplete(body);
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
