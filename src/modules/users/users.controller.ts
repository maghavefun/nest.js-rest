import { ColumnsService } from './../columns/columns.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserUpdatingDTO } from 'src/core/DTO/users.dtos';
import { ColumnCreatingDTO } from 'src/core/DTO/columns.dtos';

@Controller('users')
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly columnsService: ColumnsService,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiTags('users')
  @ApiOkResponse({
    description: 'User successfully found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @ApiParam({
    name: 'id',
    description: 'User id as an integer',
    required: true,
  })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findOneById(Number(id));
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @ApiTags('users')
  @ApiOkResponse({
    description: 'User data successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with provided id not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async updateUserById(
    @Param('id') id: string,
    @Body() userDTO: UserUpdatingDTO,
  ) {
    return await this.usersService.updateOneById(Number(id), userDTO);
  }

  @UseGuards(AuthGuard)
  @ApiTags('columns')
  @Post(':userId/columns')
  @ApiOkResponse({
    description: 'Column successfully created',
  })
  @ApiNotFoundResponse({
    description: 'Related record for column not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
  })
  @ApiBody({
    type: ColumnCreatingDTO,
    description: 'Column data as JSON format for creating',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of user, that creates column as an integer',
    required: true,
  })
  async createColumn(
    @Body() columnDTO: ColumnCreatingDTO,
    @Param('userId') userId: string,
  ) {
    await this.columnsService.createOne(columnDTO, Number(userId));
  }

  //дополни документацию для сваггера
  @ApiTags('columns')
  @Get(':userId/columns')
  async getColumns() {
    //реализуй + пагинация
  }

  //дополни документацию для сваггера
  @ApiTags('columns')
  @Get(':userId/columns/:columnId')
  async getColumnById() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('columns')
  @Put(':userId/columns/:columnId')
  async updateColumnById() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('columns')
  @Delete(':userId/columns/:columnId')
  async deleteColumnById() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('cards')
  @Post(':userId/columns/:columnId/cards')
  async createCard() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('cards')
  @Get(':userId/columns/:columnId/cards')
  async getCards() {
    //реализуй + пагинация
  }

  //дополни документацию для сваггера
  @ApiTags('cards')
  @Get(':userId/columns/:columnId/cards/:cardId')
  async getCardById() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('cards')
  @Put(':userId/columns/:columnId/cards/:cardId')
  async updateCardById() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('cards')
  @Delete(':userId/columns/:columnId/cards/:cardId')
  async deleteCardById() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('comments')
  @Post(':userId/columns/:columnId/cards/:cardId/comments')
  async createComment() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('comments')
  @Get(':userId/columns/:columnId/cards/:cardId/comments')
  async getComments() {
    //реализуй + pagination
  }

  //дополни документацию для сваггера
  @ApiTags('comments')
  @Get(':userId/columns/:columnId/cards/:cardId/comments/:commentId')
  async getCommentById() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('comments')
  @Put(':userId/columns/:columnId/cards/:cardId/comments/:commentId')
  async updateCommentById() {
    //реализуй
  }

  //дополни документацию для сваггера
  @ApiTags('comments')
  @Delete(':userId/columns/:columnId/cards/:cardId/comments/:commentId')
  async deleteCommentById() {
    //реализуй
  }
}
