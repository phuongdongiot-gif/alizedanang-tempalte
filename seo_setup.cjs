const fs = require('fs');
const path = require('path');

const domain = 'https://alizedanang.vn';
const dir = 'd:\\Iworkspaces\\alize-template';

// 1. Fix the duplicate HTML in index.html
const indexHtmlPath = path.join(dir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
  // Find the duplicate block starting after hero section
  const duplicateStartStr = `  </section>\n  <!doctype html>`;
  const duplicateStartIndex = indexContent.indexOf(duplicateStartStr);
  if (duplicateStartIndex !== -1) {
    const mainPos = indexContent.indexOf('<!-- MAIN CONTENT -->', duplicateStartIndex);
    if (mainPos !== -1) {
      // Create new content with the duplicate part removed
      const before = indexContent.substring(0, duplicateStartIndex + 13); // Up to </section>\n
      const after = indexContent.substring(mainPos);
      indexContent = before + '  ' + after;
      fs.writeFileSync(indexHtmlPath, indexContent, 'utf8');
      console.log('Fixed duplicate HTML in index.html');
    }
  }
}

// 2. Add Meta SEO Tags
const pageData = {
  'index.html': {
    title: 'ALIZE - Luxury Real Estate',
    desc: 'Khám phá dự án căn hộ hạng sang ALIZE Đà Nẵng. Biểu tượng sống thượng lưu với tầm nhìn trực diện biển Mỹ Khê, thiết kế độc bản và tiện ích 5 sao.'
  },
  'amenities.html': {
    title: 'Tiện Ích - ALIZE Luxury Real Estate',
    desc: 'Trải nghiệm tiện ích 5 sao tại ALIZE Đà Nẵng: Hồ bơi vô cực, Sky Garden, Gym & Spa chuẩn quốc tế.'
  },
  'architecture.html': {
    title: 'Kiến Trúc - ALIZE Luxury Real Estate',
    desc: 'Khám phá kiến trúc độc bản của ALIZE Đà Nẵng. Ngôn ngữ thiết kế của tương lai với tầm nhìn Panorama trực diện biển.'
  },
  'contact.html': {
    title: 'Liên Hệ - ALIZE Luxury Real Estate',
    desc: 'Liên hệ ngay với chúng tôi để nhận đặc quyền tư vấn sở hữu căn hộ hạng sang đích thực ALIZE Đà Nẵng.'
  },
  'floorplans.html': {
    title: 'Mặt Bằng - ALIZE Luxury Real Estate',
    desc: 'Mặt bằng tổng thể và chi tiết căn hộ ALIZE Đà Nẵng. Thiết kế tối ưu từ 1PN, 2PN đến Penthouse siêu sang trọng.'
  },
  'gallery.html': {
    title: 'Tuyệt Tác Không Gian - ALIZE Luxury Real Estate',
    desc: 'Thư viện hình ảnh thiết kế ấn tượng của dự án ALIZE Đà Nẵng. Góc nhìn thượng lưu mang lại không gian sống đẳng cấp.'
  },
  'location.html': {
    title: 'Vị Trí - ALIZE Luxury Real Estate',
    desc: 'ALIZE Đà Nẵng sở hữu tọa độ kim cương trực diện biển Mỹ Khê, cách Cầu Rồng và trung tâm thành phố chỉ ít phút di chuyển.'
  },
  'services.html': {
    title: 'Dịch Vụ - ALIZE Luxury Real Estate',
    desc: 'Dịch vụ quản gia 24/7 và các tiện ích cá nhân hóa xứng tầm tỷ phú chỉ có tại dự án căn hộ ALIZE Đà Nẵng.'
  },
  'values.html': {
    title: 'Giá Trị - ALIZE Luxury Real Estate',
    desc: 'Khám phá giá trị đầu tư truyền đời tại ALIZE Đà Nẵng. Giải pháp gia tăng tài sản bền vững không qua chu kỳ thị trường.'
  }
};

const keywords = 'Alize Đà Nẵng, căn hộ hạng sang Đà Nẵng, dự án căn hộ Mỹ Khê, bất động sản cao cấp, căn hộ view biển, A&T Group';

Object.keys(pageData).forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('<meta name="description"')) {
      const { title, desc } = pageData[file];
      const pageUrl = file === 'index.html' ? domain + '/' : `${domain}/${file.replace('.html', '')}`;
      
      const metaTags = `
  <meta name="description" content="${desc}" />
  <meta name="keywords" content="${keywords}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${domain}/images/du-an-alize-dan-nang-doc.webp" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="${pageUrl}" />
  <meta property="twitter:title" content="${title}" />
  <meta property="twitter:description" content="${desc}" />
  <meta property="twitter:image" content="${domain}/images/du-an-alize-dan-nang-doc.webp" />`;

      content = content.replace(/(<title>.*?<\/title>)/i, `$1${metaTags}`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`${file} already has proper tags.`);
    }
  }
});
