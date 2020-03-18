import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UlmaxCardController } from './card.controller';
import { UlmaxCard } from './card.entity';
import { UlmaxCardService } from './card.service';
import { UlmaxCardCQRService } from './card.cqr';

@Module({
  imports: [TypeOrmModule.forFeature([UlmaxCard])],
  controllers: [UlmaxCardController],
  providers: [UlmaxCardService, UlmaxCardCQRService],
  exports: [UlmaxCardService],
})
export class UlmaxCardProviderModule {}

// tslint:disable-next-line: max-classes-per-file
@Module({
  imports: [UlmaxCardProviderModule],
  controllers: [UlmaxCardController],
})
export class UlmaxCardInternalModule {}
