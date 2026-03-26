const fs = require('fs');
const path = require('path');

const domain = 'https://alizedanang.vn';
const dir = 'd:\\Iworkspaces\\alize-template';
const enDir = path.join(dir, 'en');

if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir);
}

const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const dict = {
    'Tổng Quan': 'Overview',
    'Tổng\n              Quan': 'Overview',
    'Tổng\n            Quan': 'Overview',
    'Giá Trị': 'Values',
    'Giá\n              Trị': 'Values',
    'Giá\n            Trị': 'Values',
    'Vị Trí': 'Location',
    'Vị\n              Trí': 'Location',
    'Vị\n            Trí': 'Location',
    'Kiến Trúc': 'Architecture',
    'Kiến\n              Trúc': 'Architecture',
    'Kiến\n            Trúc': 'Architecture',
    'Tiện Ích': 'Amenities',
    'Tiện\n              Ích': 'Amenities',
    'Tiện\n            Ích': 'Amenities',
    'Dịch Vụ': 'Services',
    'Dịch\n              Vụ': 'Services',
    'Dịch\n            Vụ': 'Services',
    'Mặt Bằng': 'Floor Plans',
    'Mặt\n              Bằng': 'Floor Plans',
    'Mặt\n            Bằng': 'Floor Plans',
    'Không Gian': 'Gallery',
    'Không\n              Gian': 'Gallery',
    'Không\n            Gian': 'Gallery',
    'Nhận Đặc Quyền': 'Exclusive Access',
    'Khám Phá': 'Discover',
    'Tin Nhắn Cá Nhân (Tuỳ chọn)': 'Personal Message (Optional)',
    'Gọi Ngay': 'Call Now',
    // SEO Replacements
    'Khám phá dự án căn hộ hạng sang ALIZE Đà Nẵng. Biểu tượng sống thượng lưu với tầm nhìn trực diện biển Mỹ Khê, thiết kế độc bản và tiện ích 5 sao.': 'Discover the luxury apartment project ALIZE Da Nang. A symbol of elite living with direct views of My Khe Beach, unique design, and 5-star amenities.',
    'Trải nghiệm tiện ích 5 sao tại ALIZE Đà Nẵng: Hồ bơi vô cực, Sky Garden, Gym & Spa chuẩn quốc tế.': 'Experience 5-star amenities at ALIZE Da Nang: Infinity Pool, Sky Garden, International Gym & Spa.',
    'Khám phá kiến trúc độc bản của ALIZE Đà Nẵng. Ngôn ngữ thiết kế của tương lai với tầm nhìn Panorama trực diện biển.': 'Discover the unique architecture of ALIZE Da Nang. The design language of the future with direct Panorama sea views.',
    'Liên hệ ngay với chúng tôi để nhận đặc quyền tư vấn sở hữu căn hộ hạng sang đích thực ALIZE Đà Nẵng.': 'Contact us now to receive exclusive consulting privileges for authentic luxury apartments at ALIZE Da Nang.',
    'Mặt bằng tổng thể và chi tiết căn hộ ALIZE Đà Nẵng. Thiết kế tối ưu từ 1PN, 2PN đến Penthouse siêu sang trọng.': 'Master plan and detailed floor plans of ALIZE Da Nang apartments. Optimized design from 1-bedroom, 2-bedroom to ultra-luxury Penthouses.',
    'Thư viện hình ảnh thiết kế ấn tượng của dự án ALIZE Đà Nẵng. Góc nhìn thượng lưu mang lại không gian sống đẳng cấp.': 'Impressive design image gallery of ALIZE Da Nang project. Elite perspectives bringing high-class living space.',
    'ALIZE Đà Nẵng sở hữu tọa độ kim cương trực diện biển Mỹ Khê, cách Cầu Rồng và trung tâm thành phố chỉ ít phút di chuyển.': 'ALIZE Da Nang possesses a diamond location directly facing My Khe beach, just minutes away from Dragon Bridge and city center.',
    'Dịch vụ quản gia 24/7 và các tiện ích cá nhân hóa xứng tầm tỷ phú chỉ có tại dự án căn hộ ALIZE Đà Nẵng.': '24/7 butler service and personalized amenities worthy of billionaires only at ALIZE Da Nang apartment project.',
    'Khám phá giá trị đầu tư truyền đời tại ALIZE Đà Nẵng. Giải pháp gia tăng tài sản bền vững không qua chu kỳ thị trường.': 'Discover lifelong investment value at ALIZE Da Nang. Sustainable asset growth solution regardless of market cycles.',
    'Alize Đà Nẵng, căn hộ hạng sang Đà Nẵng, dự án căn hộ Mỹ Khê, bất động sản cao cấp, căn hộ view biển, A&T Group': 'Alize Da Nang, Da Nang luxury apartments, My Khe apartment projects, premium real estate, sea view apartments, A&T Group',
};

// Sitemap Generator Data
let sitemapUrls = [];

htmlFiles.forEach(file => {
    const vnPath = path.join(dir, file);
    const enPath = path.join(enDir, file);
    
    let originalVn = fs.readFileSync(vnPath, 'utf8');
    
    const pageRoute = file === 'index.html' ? '' : file.replace('.html', '');
    const vnUrl = `${domain}/${pageRoute}`;
    const enUrl = `${domain}/en/${pageRoute}`;
    
    // Add Hreflang logic before </head> if not exists
    const hreflangBlock = `
  <!-- Hreflang SEO -->
  <link rel="alternate" hreflang="vi" href="${vnUrl}" />
  <link rel="alternate" hreflang="en" href="${enUrl}" />
  <link rel="alternate" hreflang="x-default" href="${vnUrl}" />
    `.trim() + '\n';
    
    let vnContent = originalVn;
    if (!vnContent.includes('hreflang="vi"')) {
        vnContent = vnContent.replace('</head>', `  ${hreflangBlock}</head>`);
    }

    // Add Language Switcher for VN
    const vnSwitcher = `Nhận Đặc Quyền\n            </a>\n            <a href="/en/${file}" class="ml-6 font-light uppercase tracking-[0.2em] text-[11px] text-pearl-white/60 hover:text-gold transition-all duration-500">EN</a>`;
    if (!vnContent.includes(`href="/en/${file}"`)) {
       vnContent = vnContent.replace(/Nhận Đặc Quyền\s*<\/a>/g, vnSwitcher);
    }
    
    fs.writeFileSync(vnPath, vnContent, 'utf8');
    console.log(`Updated VN version: ${file}`);
    
    // Process EN version
    let enContent = vnContent;
    // Switch lang attribute
    enContent = enContent.replace(/<html lang="vi"/g, '<html lang="en"');
    
    // Update EN Switcher to point back to VN
    const enSwitcher = `Nhận Đặc Quyền\n            </a>\n            <a href="/${file}" class="ml-6 font-light uppercase tracking-[0.2em] text-[11px] text-pearl-white/60 hover:text-gold transition-all duration-500">VI</a>`;
    enContent = enContent.replace(/Nhận Đặc Quyền\s*<\/a>\s*<a href="\/en\/.*?"[^>]*>EN<\/a>/g, enSwitcher);

    // Translate common UI text from dictionary
    Object.keys(dict).forEach(vnWord => {
        // Need global replacement
        // Note: Simple JS replace with String only replaces first occurrence. Use split/join for global string replacement safely.
        enContent = enContent.split(vnWord).join(dict[vnWord]);
    });
    
    // Change og:url
    enContent = enContent.replace(new RegExp(`<meta property="og:url" content="${vnUrl}" />`, 'g'), `<meta property="og:url" content="${enUrl}" />`);
    enContent = enContent.replace(new RegExp(`<meta property="twitter:url" content="${vnUrl}" />`, 'g'), `<meta property="twitter:url" content="${enUrl}" />`);

    fs.writeFileSync(enPath, enContent, 'utf8');
    console.log(`Created EN version: en/${file}`);
    
    // Push Sitemap Data
    sitemapUrls.push({
        loc: vnUrl,
        priority: file === 'index.html' ? '1.0' : '0.8'
    });
    sitemapUrls.push({
        loc: enUrl,
        priority: file === 'index.html' ? '1.0' : '0.8'
    });
});

// Update Sitemap
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(dir, 'public', 'sitemap.xml'), sitemapXml, 'utf8');
console.log('Updated sitemap.xml');
