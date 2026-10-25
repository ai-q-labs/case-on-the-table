import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { AccusationSystem } from './accusation-system.js';
import { CardFaceSystem } from './card-face-system.js';
import { InspectionSystem } from './inspection-system.js';
import { serveInputProfilesLocally } from './local-input-profiles.js';
import { TablePlacementSystem } from './table-placement.js';

World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then((world) => {
  serveInputProfilesLocally();
  world.registerSystem(TablePlacementSystem);
  world.registerSystem(CardFaceSystem);
  world.registerSystem(InspectionSystem);
  world.registerSystem(AccusationSystem);
});
