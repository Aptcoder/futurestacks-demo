import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { HttpResponseHelper } from 'src/common/helper/http-response.helper';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AddSubaccountDto, FundAccountDto } from './dto/add-subaccount.dto';
// import { AuthGuard } from 'src/common/guards/auth.guard';
// import { Permission } from 'src/common/guards/permission.helper';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return HttpResponseHelper.send('User created', user);
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return HttpResponseHelper.send('Users', users);
    // return this.userService.findAll(storeId);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async findSelf(@Req() req: ExpressRequest) {
    const user = await this.userService.findSelf(req.user.id);
    return HttpResponseHelper.send('User', user);
  }

  @UseGuards(AuthGuard)
  @Post('/me/withdrawal_account')
  async createSubaccount(
    @Req() req: ExpressRequest,
    @Body() addSubaccountDto: AddSubaccountDto,
  ) {
    const user = await this.userService.createWithdrawalAccount(
      req.user.id,
      addSubaccountDto,
    );
    return HttpResponseHelper.send('User subaccount', user);
  }

  @UseGuards(AuthGuard)
  @Post('/me/fund_account')
  async fundUserAccount(
    @Req() req: ExpressRequest,
    @Body() body: FundAccountDto,
  ) {
    const response = await this.userService.fundUserAccount(
      req.user.id,
      body.amount,
    );

    return HttpResponseHelper.send('Funding details', response);
  }

  @UseGuards(AuthGuard)
  @Post('/me/withdrawal')
  async withdawFromAccount(
    @Req() req: ExpressRequest,
    @Body() body: FundAccountDto,
  ) {
    await this.userService.withdawFromAccount(req.user.id, body.amount);

    return HttpResponseHelper.send('Withdrawal started', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(id, updateUserDto);
  // }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const data = await this.userService.login(loginUserDto);
    return HttpResponseHelper.send('User logged in', data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
