import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get('/login')
  @Render('auth/login')
  loginPage() {
    return {};
  }

  @Get('/register')
  @Render('auth/register')
  registerPage() {
    return {};
  }
}