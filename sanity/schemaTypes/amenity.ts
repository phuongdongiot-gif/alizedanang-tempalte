import { defineField, defineType } from 'sanity';

export const amenityType = defineType({
  name: 'amenity',
  title: 'Tiện ích (Amenity)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tên tiện ích',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Mô tả chi tiết',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Hình ảnh tiện ích',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
