import { type SchemaTypeDefinition } from 'sanity';
import { propertyType } from './property';
import { blogType } from './blog';
import { projectType } from './project';
import { locationType } from './location';
import { amenityType } from './amenity';
import { floorplanType } from './floorplan';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [propertyType, blogType, projectType, locationType, amenityType, floorplanType],
};
