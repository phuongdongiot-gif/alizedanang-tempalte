import { defineField, defineType } from 'sanity';

export const floorplanType = defineType({
  name: 'floorplan',
  title: 'Mặt bằng (Floorplan)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tên mặt bằng (VD: Căn 2 Ngủ Góc)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'area',
      title: 'Diện tích (m2)',
      type: 'string',
    }),
    defineField({
      name: 'beds',
      title: 'Số phòng ngủ',
      type: 'number',
    }),
    defineField({
      name: 'baths',
      title: 'Số phòng tắm',
      type: 'number',
    }),
    defineField({
      name: 'image',
      title: 'Hình ảnh thiết kế mặt bằng',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
