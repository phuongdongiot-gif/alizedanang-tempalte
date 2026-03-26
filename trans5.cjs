const fs = require('fs');
const path = require('path');

const enDir = 'd:\\Iworkspaces\\alize-template\\en';

const finalDict = {
    'Tiếng Việt': 'Vietnamese',
    'Values Truyền Đời': 'Lifelong Values',
    'Chăm Sóc Độc Bản 01': 'Unique Care 01',
    'Chăm Sóc Độc Bản 02': 'Unique Care 02',
    'Chăm Sóc Độc Bản 03': 'Unique Care 03',
    'Tuyệt Tác Gallery': 'Gallery Masterpiece',
    'Tuyệt tác kiến trúc ALIZE - Vùng đất dành cho sự tĩnh tại và phong cách\\s*sống vô song.': 'ALIZE architectural masterpiece - A land for tranquility and unparalleled lifestyle.',
    'Scale ấn tượng gồm 2 tháp căn\\s*hộ cao 25 tầng và 3 tầng hầm, trên tổng diện tích 4.000m². Cung cấp 640 căn hộ cao cấp sang trọng, không\\s*gian mở thông thoáng hưởng trọn ánh sáng tự nhiên.': 'Impressive scale consisting of 2 25-story apartment towers and 3 basements, on a total area of 4,000m². Providing 640 luxury apartments with open, airy spaces enjoying full natural light.',
    'Tầng 2–4:': 'Floor 2-4:',
    'Tầng 6–25:': 'Floor 6-25:',
    'Thương mại dịch vụ khối đế \\(cao 5m\\)': 'Podium commercial services (5m high)',
    'Tiện ích hồ bơi, gym, spa \\(cao 6m\\)': 'Pool, gym, spa amenities (6m high)',
    'Căn hộ cao cấp \\(cao 3.5m/tầng\\)': 'Luxury apartments (3.5m/floor high)',
    'Đại Sảnh': 'Grand Foyer',
    'Tầm nhìn Paronamic': 'Panoramic View'
};

const htmlFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(enDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    for (const [vn, en] of Object.entries(finalDict)) {
        const regex = new RegExp(vn, 'g');
        content = content.replace(regex, en);
    }
    fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Final translations complete.');
