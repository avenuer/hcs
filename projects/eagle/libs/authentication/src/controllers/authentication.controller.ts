import { AuthorizeRequestService } from '../services/authorize-req.service';
import { ValidateAuthorizedService } from '../services/validate-author.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccessLevel } from '@eagle/generated';
import {
  AuthorizeRequest,
  ValidateAuthorizationReq,
  AuthorizedEntity,
  KeyVerfication,
} from './typecast';
import { AuthenticationMessage } from '@eagle/server-shared';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';

export const authenticateValidateError = new BadRequestException(
  `the parameters for otp validation is missing, 
  check your query params either to contain the otp and id sent previously`,
);

export const keyVerificationError = new UnauthorizedException(`
The key and format is unauthorize request a new key or revalidate
`);

@ApiUseTags('auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private authorizer: AuthorizeRequestService,
    private validator: ValidateAuthorizedService,
  ) { }


  @ApiOkResponse({
    description: `Successfull created authorization details of the institution`,
  })
  @Post('institution/signup')
  async createInsitution(@Body() loginReq: AuthorizeRequest) {
    return await this.authorizer.authorize({
      ...loginReq,
      accessLevel: AccessLevel.Institution,
    }, true);
  }

  @ApiOkResponse({
    description: `Successfull authorization details of the institution`,
  })
  @Post('institution/login')
  async authorizeInsitution(@Body() loginReq: AuthorizeRequest) {
    const accessLevel = (loginReq.identification.indexOf('@') > 0) ? AccessLevel.Institution : AccessLevel.Staff;
    return await this.authorizer.authorize({
      ...loginReq,
      accessLevel,
    }, false);
  }

  @ApiOkResponse({
    description: `Successfull authorization details of the client`,
  })
  @Post('client')
  async authorize(@Body() loginReq: AuthorizeRequest) {
    return await this.authorizer.authorize({
      ...loginReq,
      accessLevel: AccessLevel.Users,
    }, true);
  }

  @ApiOkResponse({ description: `Successfull validates the otp code sent` })
  @Get('otpvalidate')
  async validate(@Query() otpLogin: ValidateAuthorizationReq) {
    const entity = new AuthorizedEntity();
    entity.data = await this.validator.validate(otpLogin);
    entity.keys = await this.validator.securedKeys(entity.data);
    return entity;
  }

  @ApiOkResponse({
    description: `Successfull verifies the key and format sent for authorization`,
  })
  @MessagePattern(AuthenticationMessage.validate)
  @Get('verify')
  async verify(@Query() { format, key }: KeyVerfication) {
    const verifed = await this.validator.verifyKeys(format, key);
    if (!verifed) {
      throw keyVerificationError;
    }
    return verifed;
  }
}
