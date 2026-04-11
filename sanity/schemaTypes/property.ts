import { defineField, defineType } from 'sanity';

export const propertyType = defineType({
  name: 'property',
  title: 'Portal Property',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Item ID',
      type: 'string',
      description: 'Optional manual ID. If empty, a slug can be used.',
    }),
    defineField({
      name: 'transactionType',
      title: 'Transaction Type',
      type: 'string',
      options: {
        list: [
          { title: 'Sale', value: 'sale' },
          { title: 'Rent', value: 'rent' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'propertyCategory',
      title: 'Property Category',
      type: 'string',
      description: 'e.g., apartment, villa, land',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isNew',
      title: 'Is New',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'name',
      title: 'Property Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectId',
      title: 'Project ID',
      type: 'string',
    }),
    defineField({
      name: 'projectName',
      title: 'Project Name',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price (String)',
      type: 'string',
      description: 'String representation e.g. "3.5 Tỷ"',
    }),
    defineField({
      name: 'priceNum',
      title: 'Price (Number)',
      type: 'number',
      description: 'Numeric representation for filtering',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Type Details',
      type: 'string',
    }),
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'object',
      fields: [
        { name: 'area', title: 'Area (String)', type: 'string' },
        { name: 'areaNum', title: 'Area (Number)', type: 'number' },
        { name: 'beds', title: 'Bedrooms', type: 'number' },
        { name: 'baths', title: 'Bathrooms', type: 'number' },
      ],
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'img',
      title: 'Thumbnail Image URL',
      type: 'string',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery URLs',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      fields: [
        { name: 'lat', title: 'Latitude', type: 'number' },
        { name: 'lng', title: 'Longitude', type: 'number' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
    },
  },
});
