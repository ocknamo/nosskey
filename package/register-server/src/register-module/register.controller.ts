import {
  Body,
  Controller,
  Header,
  HttpCode,
  Options,
  Post,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import {
  RegisterCompleteRequestDto,
  RegisterStartRequestDto,
  RegisterStartResponseDto,
} from './register.dto';

@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register-start')
  @Header('Access-Control-Allow-Origin', '*') // FIXME
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  async registerStart(
    @Body() body: RegisterStartRequestDto,
  ): Promise<RegisterStartResponseDto> {
    return this.registerService.registerStart(body);
  }

  @Post('register-complete')
  @Header('Access-Control-Allow-Origin', '*') // FIXME
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  async registerCompelete(
    @Body() body: RegisterCompleteRequestDto,
  ): Promise<boolean> {
    return this.registerService.registerComplete(body);
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
