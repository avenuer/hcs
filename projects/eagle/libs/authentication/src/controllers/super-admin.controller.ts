import { SuperAdminAuthorizeService } from '../services/super-admin.service';
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { AuthorizeRequest } from './typecast';
import { Authorized, AuthorizedPipe } from '@eagle/server-shared';
import { Authorization } from '../models/author.entity';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';

/**
 * Responsible for authenticating and creating super admins
 */
@ApiUseTags('auth')
@Controller('superadmin')
export class SuperAdminAuthorizationController {
  constructor(private adminAuth: SuperAdminAuthorizeService) {}

  /**
   * signup and create a new user with superadmin right
   */
  @ApiOkResponse({ description: `Successfull creates other super admin` })
  @Post('create')
  @HttpCode(201)
  @UsePipes(AuthorizedPipe)
  createAdmin(
    @Authorized() auth: Authorization,
    @Body() body: AuthorizeRequest,
  ) {
    return this.adminAuth.signupAdmin(auth.apiKey, body);
  }
}
