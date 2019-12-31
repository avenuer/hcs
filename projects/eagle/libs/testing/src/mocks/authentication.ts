import * as Factory from 'factory.ts';
import * as Chance from 'chance';
import { Authorization, AccessLevel } from '@eagle/authentication';
import * as uuid from 'uuid/v4';

const chance = new Chance();

export const authorizationFactory = Factory.Sync.makeFactory<Authorization>({
  accessLevel: Factory.each(() => AccessLevel.Institution),
  apiKey: Factory.each(() => uuid()),
  updatedAt: Factory.each(() => chance.date()),
  identification: Factory.each(() => chance.phone()),
  institutionId: Factory.each((i) => i.toString()),
  trackId: Factory.each((i) => i.toString())
});
