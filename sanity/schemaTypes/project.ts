import {defineType, defineField} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Siêu Dự Án (Landing Page)',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Tên dự án', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    
    // Hero Data
    defineField({
      name: 'hero_data',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {name: 'tagline', type: 'string', title: 'Tagline'},
        {name: 'titleLine1', type: 'string', title: 'Title Line 1'},
        {name: 'titleLine2', type: 'string', title: 'Title Line 2'},
        {name: 'description', type: 'text', title: 'Description'}
      ]
    }),

    // Overview Data
    defineField({
      name: 'overview_data',
      title: 'Tổng Quan Dự Án',
      type: 'object',
      fields: [
        {name: 'sectionTag', type: 'string', title: 'Section Tag'},
        {name: 'titleLine1', type: 'string', title: 'Tiêu đề 1'},
        {name: 'titleLine2', type: 'string', title: 'Tiêu đề 2'},
        {name: 'description', type: 'text', title: 'Mô tả'},
        {
          name: 'details',
          title: 'Chi tiết thông số',
          type: 'array',
          of: [{
             type: 'object',
             fields: [
               {name: 'label', type: 'string', title: 'Nhãn (VD: Chủ đầu tư)'},
               {name: 'value', type: 'string', title: 'Giá trị'}
             ]
          }]
        }
      ]
    }),

    // Values Data
    defineField({
      name: 'values_data',
      title: 'Giá trị cốt lõi',
      type: 'object',
      fields: [
        {
          name: 'items',
          title: 'Các giá trị',
          type: 'array',
          of: [{
             type: 'object',
             fields: [
               {name: 'number', type: 'string', title: 'Số thứ tự (VD: I.)'},
               {name: 'title', type: 'string', title: 'Tiêu đề'},
               {name: 'desc', type: 'text', title: 'Mô tả'}
             ]
          }]
        }
      ]
    }),

    // Location Data - Liên kết tới bảng Location (Tỉnh thành/Khu vực)
    defineField({
      name: 'location',
      title: 'Khu vực (Location ID)',
      type: 'reference',
      to: [{ type: 'location' }],
      description: 'Gắn siêu dự án này vào khu vực bản đồ nào?',
    }),

    // Location Detail Text
    defineField({
      name: 'location_data',
      title: 'Vị trí độc tôn (Bài viết đoạn mở rộng)',
      type: 'object',
      fields: [
        {
          name: 'items',
          title: 'Khoảng cách',
          type: 'array',
          of: [{
             type: 'object',
             fields: [
               {name: 'num', type: 'string', title: 'Số phút'},
               {name: 'title', type: 'string', title: 'Tiêu đề'},
               {name: 'desc', type: 'text', title: 'Mô tả'}
             ]
          }]
        }
      ]
    }),

    // Amenities (Thay vì nhập tĩnh, dùng Reference kéo từ bảng Amenity)
    defineField({
      name: 'amenities_ref',
      title: 'Tiện ích (Amenities)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'amenity' }]
        }
      ]
    }),

    // Floorplans
    defineField({
      name: 'floorplans_ref',
      title: 'Mặt bằng căn hộ (Floorplans)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'floorplan' }]
        }
      ]
    })
  ]
})
