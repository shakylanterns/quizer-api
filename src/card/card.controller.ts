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
import { CardService } from "./card.service";
import { AddCardDto } from "./dtos/add-card.dto";
import { ReturnCardDto } from "./dtos/return-card.dto";
import { UpdateCardDto } from "./dtos/update-card.dto";

@Controller("card")
@Serializer(ReturnCardDto)
@UseGuards(AuthGuard)
export class CardController {
  constructor(private cardService: CardService) {}

  @Get("/:id")
  async get(@Param("id") id: string, @LoggedInUser() user: User) {
    if (!id) {
      throw new BadRequestException("No id");
    }
    const card = await this.cardService.findOne(parseInt(id), user);
    if (!card) {
      throw new NotFoundException(`card with id ${id} not found!`);
    }
    return card;
  }

  @Post("/")
  create(@Body() body: AddCardDto, @LoggedInUser() user: User) {
    return this.cardService.create(body.question, body.answer, user);
  }

  @Patch("/:id")
  update(
    @Param("id") id: string,
    @Body() body: UpdateCardDto,
    @LoggedInUser() user: User
  ) {
    if (!id) {
      throw new BadRequestException("No id");
    }
    return this.cardService.update(parseInt(id), body, user);
  }

  @Delete("/:id")
  remove(@Param("id") id: string, @LoggedInUser() user: User) {
    if (!id) {
      throw new BadRequestException("No id");
    }
    return this.cardService.remove(parseInt(id), user);
  }
}
