import { ColumnsService } from './../columns/columns.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserUpdatingDTO } from 'src/core/DTO/users.dtos';
import {
  ColumnCreatingDTO,
  ColumnUpdatingDTO,
} from 'src/core/DTO/columns.dtos';
import { PageDTO, PageOptionsDTO } from 'src/core/DTO/page.dtos';
import { Card, Column, Comment, User } from '../drizzle/schema';
import { CardCreatingDTO, CardUpdatingDTO } from 'src/core/DTO/cards.dtos';
import { CardsService } from '../cards/cards.service';
import { CommentsService } from '../comments/comments.service';
import {
  CommentCreatingDTO,
  CommentUpdatingDTO,
} from 'src/core/DTO/comments.dtos';
import { UsersIdGuard } from './usersId.guard';

@Controller('users')
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly columnsService: ColumnsService,
    private readonly cardsService: CardsService,
    private readonly commentsService: CommentsService,
  ) {}

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':userId')
  @ApiTags('users')
  @ApiOkResponse({ description: 'User successfully found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  async getUserById(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.findOneById(Number(userId));
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put(':userId')
  @ApiTags('users')
  @ApiOkResponse({ description: 'User data successfully updated' })
  @ApiNotFoundResponse({ description: 'User with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  async updateUserById(
    @Param('userId') userId: string,
    @Body() userDTO: UserUpdatingDTO,
  ): Promise<User> {
    return await this.usersService.updateOneById(Number(userId), userDTO);
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post(':userId/columns')
  @ApiTags('columns')
  @ApiCreatedResponse({ description: 'Column successfully created' })
  @ApiNotFoundResponse({ description: 'Related user for column not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
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
    @Param('userId') userId: string,
    @Body() columnDTO: ColumnCreatingDTO,
  ): Promise<Column> {
    return await this.columnsService.createOne(Number(userId), columnDTO);
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':userId/columns')
  @ApiTags('columns')
  @ApiOkResponse({ description: 'Columns successfully found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  async getColumns(
    @Param('userId') userId: string,
    @Query() pageOptionsDTO: PageOptionsDTO,
  ): Promise<PageDTO<Column>> {
    return await this.columnsService.findMany(Number(userId), pageOptionsDTO);
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':userId/columns/:columnId')
  @ApiTags('columns')
  @ApiOkResponse({ description: 'Column with provided id succesfully found' })
  @ApiNotFoundResponse({ description: 'Column with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  async getColumnById(
    @Param('userId') userId: string,
    @Param('columnId') columnId: string,
  ): Promise<Column> {
    return await this.columnsService.findOneById(Number(columnId));
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put(':userId/columns/:columnId')
  @ApiTags('columns')
  @ApiOkResponse({ description: 'Column updated by id successfully' })
  @ApiNotFoundResponse({ description: 'Column with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiBody({
    type: ColumnUpdatingDTO,
    description: 'Column data as JSON for updating by id',
  })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  async updateColumnById(
    @Param('userId') userId: string,
    @Param('columnId') columnId: string,
    @Body() columnUpdatingDTO: ColumnUpdatingDTO,
  ): Promise<Column> {
    return await this.columnsService.updateOneById(
      Number(columnId),
      columnUpdatingDTO,
    );
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId/columns/:columnId')
  @ApiTags('columns')
  @ApiNoContentResponse({
    description: 'Column with provided id succesfully deleted',
  })
  @ApiNotFoundResponse({ description: 'Column with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  async deleteColumnById(
    @Param('userId') userId: string,
    @Param('columnId') columnId: string,
  ): Promise<void> {
    await this.columnsService.deleteById(Number(columnId));
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post(':userId/columns/:columnId/cards')
  @ApiTags('cards')
  @ApiCreatedResponse({ description: 'Card succesfully created' })
  @ApiNotFoundResponse({ description: 'Related column for card not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiBody({
    type: CardCreatingDTO,
    description: 'Card data as JSON format for creating',
  })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  async createCard(
    @Param('userId') userId: string,
    @Param('columnId') columnId: string,
    @Body() cardCreatingDTO: CardCreatingDTO,
  ): Promise<Card> {
    return await this.cardsService.createOne(Number(columnId), cardCreatingDTO);
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':userId/columns/:columnId/cards')
  @ApiTags('cards')
  @ApiOkResponse({ description: 'Cards sucessfully found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  async getCards(
    @Param('userId') userId: string,
    @Param('columnId') columnId: string,
    @Query() pageOptionsDTO: PageOptionsDTO,
  ): Promise<PageDTO<Card>> {
    return await this.cardsService.findMany(Number(columnId), pageOptionsDTO);
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':userId/columns/:columnId/cards/:cardId')
  @ApiTags('cards')
  @ApiOkResponse({ description: 'Card successfully found' })
  @ApiNotFoundResponse({ description: 'Card with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'cardId',
    description: 'Card id as an integer',
    required: true,
  })
  async getCardById(
    @Param('userId') userId: string,
    @Param('columnId') columndId: string,
    @Param('cardId') cardId: string,
  ): Promise<Card> {
    return await this.cardsService.findOneById(
      Number(columndId),
      Number(cardId),
    );
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put(':userId/columns/:columnId/cards/:cardId')
  @ApiTags('cards')
  @ApiOkResponse({ description: 'Card with provided id successfully updated' })
  @ApiNotFoundResponse({ description: 'Card with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiBody({
    type: CardUpdatingDTO,
    description: 'Card data as JSON format for updating',
  })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'cardId',
    description: 'Card id as an integer',
    required: true,
  })
  async updateCardById(
    @Param('userId') userId: string,
    @Param('columnId') columndId: string,
    @Param('cardId') cardId: string,
    @Body() cardUpdatingDTO: CardUpdatingDTO,
  ): Promise<Card> {
    return await this.cardsService.updateOneById(
      Number(columndId),
      Number(cardId),
      cardUpdatingDTO,
    );
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId/columns/:columnId/cards/:cardId')
  @ApiTags('cards')
  @ApiNoContentResponse({
    description: 'Card with provided id successfully deleted',
  })
  @ApiNotFoundResponse({ description: 'Card with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'cardId',
    description: 'Card id as an integer',
    required: true,
  })
  async deleteCardById(
    @Param('userId') userId: string,
    @Param('columnId') columndId: string,
    @Param('cardId') cardId: string,
  ): Promise<void> {
    await this.cardsService.deleteById(Number(columndId), Number(cardId));
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post(':userId/columns/:columnId/cards/:cardId/comments')
  @ApiTags('comments')
  @ApiCreatedResponse({ description: 'Comment successfully created' })
  @ApiNotFoundResponse({ description: 'Related card for comment not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiBody({
    type: CommentCreatingDTO,
    description: 'Comment data as JSON format for creating',
  })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'cardId',
    description: 'Card id as an integer',
    required: true,
  })
  async createComment(
    @Param('userId') userId: string,
    @Param('columnId') columndId: string,
    @Param('cardId') cardId: string,
    @Body() commentCreatingDTO: CommentCreatingDTO,
  ): Promise<Comment> {
    return await this.commentsService.createOne(
      Number(cardId),
      commentCreatingDTO,
    );
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':userId/columns/:columnId/cards/:cardId/comments')
  @ApiTags('comments')
  @ApiOkResponse({ description: 'Comments sucessfully found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'cardId',
    description: 'Card id as an integer',
    required: true,
  })
  async getComments(
    @Param('userId') userId: string,
    @Param('columnId') columndId: string,
    @Param('cardId') cardId: string,
    @Query() pageOptionsDTO: PageOptionsDTO,
  ): Promise<PageDTO<Comment>> {
    return await this.commentsService.findMany(Number(cardId), pageOptionsDTO);
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':userId/columns/:columnId/cards/:cardId/comments/:commentId')
  @ApiTags('comments')
  @ApiOkResponse({ description: 'Comment successfully found' })
  @ApiNotFoundResponse({ description: 'Comment with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'cardId',
    description: 'Card id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'commentId',
    description: 'Comment id as an integer',
    required: true,
  })
  async getCommentById(
    @Param('userId') userId: string,
    @Param('columnId') columndId: string,
    @Param('cardId') cardId: string,
    @Param('commentId') commentId: string,
  ): Promise<Comment> {
    return await this.commentsService.findOneById(
      Number(cardId),
      Number(commentId),
    );
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Put(':userId/columns/:columnId/cards/:cardId/comments/:commentId')
  @ApiTags('comments')
  @ApiOkResponse({
    description: 'Comment with provided id sucessfullty updated',
  })
  @ApiNotFoundResponse({ description: 'Comment with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiBody({
    type: CommentUpdatingDTO,
    description: 'Comment data as JSON format for updating',
  })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'cardId',
    description: 'Card id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'commentId',
    description: 'Comment id as an integer',
    required: true,
  })
  async updateCommentById(
    @Param('userId') userId: string,
    @Param('columnId') columndId: string,
    @Param('cardId') cardId: string,
    @Param('commentId') commentId: string,
    @Body() commentUpdatingDTO: CommentUpdatingDTO,
  ): Promise<Comment> {
    return await this.commentsService.updateOneById(
      Number(cardId),
      Number(commentId),
      commentUpdatingDTO,
    );
  }

  @UseGuards(AuthGuard, UsersIdGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId/columns/:columnId/cards/:cardId/comments/:commentId')
  @ApiTags('comments')
  @ApiNoContentResponse({ description: 'Comment succesfullty deleted' })
  @ApiNotFoundResponse({ description: 'Comment with provided id not found' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiForbiddenResponse({ description: 'Access not granted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  @ApiParam({
    name: 'userId',
    description: 'User id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'columnId',
    description: 'Column id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'cardId',
    description: 'Card id as an integer',
    required: true,
  })
  @ApiParam({
    name: 'commentId',
    description: 'Comment id as an integer',
    required: true,
  })
  async deleteCommentById(
    @Param('userId') userId: string,
    @Param('columnId') columndId: string,
    @Param('cardId') cardId: string,
    @Param('commentId') commentId: string,
  ): Promise<void> {
    await this.commentsService.deleteById(Number(cardId), Number(commentId));
  }
}

//3. создать userIdGuard
//4. добвить userIdGuard ко всем методам где есть userId
