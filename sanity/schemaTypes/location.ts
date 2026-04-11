import { defineField, defineType } from 'sanity';

export const locationType = defineType({
  name: 'location',
  title: 'Location (Khu vực)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tên khu vực (VD: Đà Nẵng)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Đường dẫn (Slug)',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero_image',
      title: 'Hình ảnh đại diện',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
