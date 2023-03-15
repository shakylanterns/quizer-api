import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { Serializer } from "../interceptors/serializer.interceptor";
import { LoggedInUser } from "../user/decorators/logged-in-user.decorator";
import { AuthGuard } from "../user/guards/auth.guard";
import { User } from "../user/user.entity";
import { CollectionService } from "./collection.service";
import { AddCollectionDto } from "./dtos/add-collection.dto";
import { ReturnCollectionDto } from "./dtos/return-collection.dto";
import { UpdateCollectionDto } from "./dtos/update-collection.dto";

@Controller("collection")
@Serializer(ReturnCollectionDto)
@UseGuards(AuthGuard)
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get("/:id")
  async get(@Param("id") id: string, @LoggedInUser() user: User) {
    if (!id) {
      throw new BadRequestException("No id");
    }
    const card = await this.collectionService.findOne(parseInt(id), user);
    if (!card) {
      throw new NotFoundException(`collection with id ${id} not found!`);
    }
    return card;
  }

  @Post("/")
  create(@Body() body: AddCollectionDto, @LoggedInUser() user: User) {
    return this.collectionService.create(body.name, user);
  }

  @Patch("/:id")
  update(
    @Param("id") id: string,
    @Body() body: UpdateCollectionDto,
    @LoggedInUser() user: User
  ) {
    if (!id) {
      throw new BadRequestException("No id");
    }
    return this.collectionService.update(parseInt(id), body, user);
  }

  @Delete("/:id")
  remove(@Param("id") id: string, @LoggedInUser() user: User) {
    if (!id) {
      throw new BadRequestException("No id");
    }
    return this.collectionService.remove(parseInt(id), user);
  }

  @Post("/add/:id/:cardId")
  addCardToCollection(
    @Param("id") id: string,
    @Param("cardId") cardId: string,
    @LoggedInUser() user: User
  ) {
    if (!id || !cardId) {
      throw new BadRequestException("No id");
    }
    return this.collectionService.addCard(parseInt(id), parseInt(cardId), user);
  }

  @Delete("/remove/:id/:cardId")
  removeCardFromCollection(
    @Param("id") id: string,
    @Param("cardId") cardId: string,
    @LoggedInUser() user: User
  ) {
    if (!id) {
      throw new BadRequestException("No id");
    }
    return this.collectionService.removeCard(
      parseInt(id),
      parseInt(cardId),
      user
    );
  }
}
