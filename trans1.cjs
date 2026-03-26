const fs = require('fs');
const path = require('path');

const dir = 'd:\\Iworkspaces\\alize-template\\en';

const dict = {
    // Amenities
    'ĐẶC QUYỀN THƯỢNG LƯU': 'ELITE PRIVILEGES',
    'TRẢI NGHIỆM ĐẲNG CẤP <br /><span class="font-serif italic font-light text-pearl-white/90">Chuẩn 5 Sao</span>': 'PREMIUM EXPERIENCE <br /><span class="font-serif italic font-light text-pearl-white/90">5-Star Standard</span>',
    'Với mật độ xây dựng thấp chỉ 38.55%, cư dân hòa mình trọn vẹn vào công viên nội khu 1.655m2 và hệ sinh thái tiện ích khép kín. Từ vườn hoa 4 mùa, trung tâm thể thao đến dãy Shophouse sầm uất đa dạng.': 'With a low building density of only 38.55%, residents fully immerse themselves in the 1,655sqm internal park and a closed ecosystem of amenities. From the 4-season flower garden, sports center to the bustling, diverse Shophouse blocks.',
    'Amenities Tầng Không': 'Sky Amenities',
    'Hồ Bơi Vô Cực<br/><span class="italic font-serif text-pearl-white/70">Trên Cao</span>': 'Infinity Pool<br/><span class="italic font-serif text-pearl-white/70">In The Sky</span>',
    'Sở hữu hồ bơi vô cực trên không (Sky Pool), nơi ranh giới giữa mặt nước và chân trời bị xóa nhòa. Một không gian hoàn mỹ giúp bạn thư giãn đón bình minh và phục hồi năng lượng giữa vòm mây bao la.': 'Owning a sky infinity pool (Sky Pool), where the boundary between the water surface and the horizon is blurred. A perfect space to relax at dawn and restore energy amidst the vast clouds.',
    'Hệ thống lọc nước muối sinh lý chuẩn quốc tế bảo vệ làn da, nhiệt độ nước thông minh điều chỉnh theo khí hậu, đảm bảo trải nghiệm bơi lội 4 mùa bất tận.': 'International standard saline water filtration system protects your skin, smart water temperature adjusts to the climate, ensuring an endless 4-season swimming experience.',
    'Mảng Xanh 1.655m2': '1,655sqm Greenery',
    'Trang thiết bị Gym & Yoga chuẩn quốc tế đáp ứng nhu cầu khắt khe của tầng lớp doanh nhân.': 'International standard Gym & Yoga equipment meets the strict demands of the business class.',
    'Amenities Nội Khu': 'Internal Amenities',
    'Sky Garden <br/><span class="italic font-serif text-pearl-white/70">& Thể Thao</span>': 'Sky Garden <br/><span class="italic font-serif text-pearl-white/70">& Sports</span>',
    'Vườn treo trên không xanh mướt hòa nhịp cùng trung tâm thể dục thể thao hiện đại, tạo nên một ốc đảo yên bình ngay thềm nhà.': 'The lush green suspended garden harmonizes with the modern sports center, creating a peaceful oasis right at your doorstep.',
    'Vườn Zen tịnh tâm phong cách Nhật Bản': 'Japanese-style Zen Garden',
    'Phòng Gym với máy móc tân tiến nhập khẩu Châu Âu': 'Gym featuring advanced equipment imported from Europe',
    'Thư phòng Đọc sách & Cigar Lounge khép kín': 'Private Reading Room & Cigar Lounge',
    'Amenities Khối Đế': 'Podium Amenities',
    'Mua Sắm Sầm Uất <br/><span class="italic font-serif text-pearl-white/70">& Vun Vén Ước Mơ</span>': 'Vibrant Shopping <br/><span class="italic font-serif text-pearl-white/70">& Fostering Dreams</span>',
    'Thương Mại & Giải Trí': 'Commerce & Entertainment',
    'Thiếu Nhi': 'Children',
    'Khu Vui Chơi An Toàn': 'Safe Play Area',
    'Services Kim Cương': 'Diamond Services',
    'Chăm Sóc Cá Nhân <br /><span class="italic font-serif text-pearl-white/70">Xứng Tầm Tỷ Phú</span>': 'Personal Care <br /><span class="italic font-serif text-pearl-white/70">Worthy of Billionaires</span>',
    'Quản Gia Tư Nhân 24/7': '24/7 Private Butler',
    'Mỗi một phân khu căn hộ đều có sự túc\\s*trực 24/7 của đội ngũ quản gia chuẩn Marriott, đáp ứng mọi yêu cầu từ đặt tiệc đến đưa đón siêu xe tại\\s*nhà.': 'Every apartment zone has 24/7 attendance of Marriott-standard butlers, fulfilling every request from party booking to supercar home pickup.',
    'An Ninh Khép Kín': 'Closed Security',
    'Hệ thống nhận diện vòng mống mắt và\\s*thẻ từ định danh tuyệt đối tại sảnh riêng. Đội ngũ an ninh tinh anh bảo vệ không gian sống không tì vết.': 'Iris recognition system and absolute ID magnetic cards at private lobbies. Elite security teams protect a flawless living space.',
    'Nghệ Thuật Ẩm Thực': 'Culinary Arts',
    'Đầu bếp nổi tiếng từ chuỗi nhà hàng\\s*Michelin luôn sẵn sàng tại gia, chế biến trực tiếp nguyên liệu thượng hạng trong gian bếp siêu sang của\\s*bạn.': 'Famous chefs from Michelin chains are always ready at home, preparing premium ingredients directly in your ultra-luxury kitchen.',
    'Trải Nghiệm Trọn Vẹn': 'Complete Experience',
    'Yêu Cầu Brochure Amenities<br/><span class="italic font-serif text-champagne/60">& Danh Mục Services</span>': 'Request Amenities Brochure<br/><span class="italic font-serif text-champagne/60">& Services Catalog</span>',
    'Đăng\\s*Ký Nhận Tin': 'Register For News',
    'Chạm vào đỉnh cao không gian sống. Tuyệt tác kiến trúc ALIZE - Vùng đất dành cho sự tĩnh tại và phong cách\\s*sống vô song.': 'Touch the pinnacle of living. ALIZE architectural masterpiece - A land of tranquility and unparalleled lifestyle.',

    // Architecture
    'KIẾN\\s*TRÚC ĐỘC BẢN': 'UNIQUE ARCHITECTURE',
    'NGÔN NGỮ<br /><span class="font-serif italic font-light text-pearl-white/90">Của Tương Lai</span>': 'LANGUAGE<br /><span class="font-serif italic font-light text-pearl-white/90">Of The Future</span>',
    'Sự kết hợp nhuần nhuyễn giữa kiến trúc thân thuộc và đương đại tinh tế, ALIZE thiết lập chuẩn mực thấu cảm với\\s*cảnh quan thiên nhiên thông qua giải pháp \\\'Xoay Mặt\\\' đột phá.': 'Seamlessly combining familiar architecture with exquisite contemporaneity, ALIZE sets a standard of empathy with the natural landscape through its groundbreaking Twisted solution.',
    'Triết\\s*Lý Thiết Kế 01': 'Design Philosophy 01',
    'Giải Pháp <br /><span class="italic font-serif text-pearl-white/70">Xoay Mặt</span>': 'Twisted <br /><span class="italic font-serif text-pearl-white/70">Architecture</span>',
    'Thấu hiểu khát khao thu trọn vẻ đẹp thiên nhiên vào trong nhà ở cao tầng, các kiến trúc sư toàn cầu đã ứng\\s*dụng giải pháp "xoay mặt" \\(twisted architecture\\) thông minh cho ALIZE Đà Nẵng.': 'Understanding the desire to capture the immense beauty of nature in high-rise living, global architects have applied a smart twisted architecture solution for ALIZE Da Nang.',
    'Mỗi đường nét được tinh chỉnh góc độ khéo léo giúp phá vỡ các khối hộp thô cứng, tối ưu hóa tầm nhìn\\s*Panorama bốn hướng. Từ ban công, bạn có thể dễ dàng thưởng lãm bình minh rực rỡ trên biển Mỹ Khê, vẻ đẹp thơ\\s*mộng yên bình của sông Hàn hay sự hùng vĩ bát ngát của bán đảo Sơn Trà.': 'Every line is meticulously angled to break the rigid block structures, optimizing four-directional Panorama views. From the balcony, you can easily enjoy the brilliant sunrise on My Khe Beach, the peaceful poetic beauty of the Han River, or the vast majesty of the Son Tra Peninsula.',
    'Mật độ cảnh quan': 'Landscape Density',
    'Diện tích xây dựng lý tưởng, nhường lại\\s*1.655m2 cho không gian xanh, mặt nước và thư giãn tâm hồn.': 'Ideal construction footprint, yielding 1,655sqm for green spaces, water surfaces, and soul relaxation.',
    'Triết\\s*Lý Thiết Kế 02': 'Design Philosophy 02',
    'Không phải là những đường nét tương lai viễn tưởng lạnh lẽo, ALIZE chạm đến trái tim giới hạn cao cấp bằng\\s*phong cách "Traditional Contemporary".': 'Far from cold futuristic lines, ALIZE touches the hearts of the elite through its Traditional Contemporary style.',
    'Sự thân thuộc của vật liệu tự nhiên \\(Gỗ, Đá, Cây Xanh\\) hòa quyện hoàn hảo trong bộ khung thiết kế giật cấp\\s*hiện đại mang hơi hướm ruộng bậc thang - Một sự giao thoa hoàn mỹ giữa bản sắc Á Đông và phong cách phương\\s*Tây sắc sảo.': 'The familiarity of natural materials (Wood, Stone, Greenery) blends perfectly within the modern stepped design framework inspired by terraced fields - A flawless fusion of Eastern identity and sharp Western style.',
    'ĐẶC QUYỀN TRẢI\\s*NGHIỆM TẦM NHÌN': 'PRIVILEGE OF VISION EXPERIENCE',
    'Tham Quan Gallery Mô Phỏng<br /><span class="italic font-serif text-champagne/60">Kiệt Tác ALIZE</span>': 'Visit The Simulation Gallery<br /><span class="italic font-serif text-champagne/60">Of ALIZE Masterpiece</span>',
    'Đăng\\s*Ký Nhận Lịch Chiếu': 'Register For Screening',

    // Location
    '01\\s*— Tọa Độ Kim Cương': '01 — Diamond Location',
    'VỊ TRÍ ĐỘC TÔN<br /><span class="font-serif italic font-light text-pearl-white/90">Tâm Điểm Phồn Hoa</span>': 'EXCLUSIVE LOCATION<br /><span class="font-serif italic font-light text-pearl-white/90">Vibrant Epicenter</span>',
    'Tọa lạc ngay mặt tiền đại lộ Võ Nguyên Giáp, trực diện biển Mỹ Khê. Nơi giao thoa hoàn mỹ giữa biển xanh bao la,\\s*trung tâm sầm uất và những cung đường di sản.': 'Located right on the frontage of Vo Nguyen Giap Avenue, directly facing My Khe Beach. The perfect intersection between the vast blue sea, bustling downtown, and heritage routes.',
    '02 — Bản Đồ Vị\\s*Trí': '02 — Location Map',
    'Kết Nối\\s*Xuyên Suốt': 'Seamless Connectivity',
    '03 — Mạng Lưới\\s*Kết Nối': '03 — Connectivity Network',
    'Thời Gian Là <br /><span class="italic font-serif text-pearl-white/70">Đặc Quyền Vô Giá</span>': 'Time Is <br /><span class="italic font-serif text-pearl-white/70">A Priceless Privilege</span>',
    'Biển Mỹ Khê': 'My Khe Beach',
    'Trực diện bãi biển quyến rũ nhất hành\\s*tinh. Chỉ vài bước chân từ thềm nhà đến tiếng sóng biển mê hoặc.': 'Directly facing the most charming beach on the planet. Just a few steps from your doorstep to the mesmerizing sound of the waves.',
    'Cầu Rồng Đặc Trưng': 'Iconic Dragon Bridge',
    'Khu vực Bạch Đằng sầm uất với chuỗi\\s*nhà hàng cao cấp, bến du thuyền và biểu tượng rực rỡ của thành phố Đà Nẵng.': 'The bustling Bach Dang area with high-end restaurant chains, marina, and the brilliant symbol of Da Nang city.',
    'Sân Bay Quốc Tế': 'International Airport',
    'Thuận tiện di chuyển qua lại giữa các\\s*quốc gia và tỉnh thành, tiết kiệm tối đa thời gian vàng ngọc.': 'Convenient travel between countries and provinces, maximizing precious time savings.',
    'Cung Đường Di Sản': 'Heritage Route',
    '10 phút đến danh thắng Ngũ Hành Sơn\\s*kỳ vĩ, và 25 phút hòa mình vào Phố Cổ Hội An mộc mạc thanh bình.': '10 minutes to the majestic Marble Mountains, and 25 minutes to immerse in the rustic, peaceful Hoi An Ancient Town.',
    '04 — Linh Hồn\\s*Dự Án': '04 — Project Soul',
    'Values Sinh Lời Dài Hạn': 'Long-Term Profitable Values',
    'Xét trên mọi góc độ, lợi thế quỹ đất khan hiếm chính là yếu tố làm nên giá trị khác biệt của ALIZE. Đây\\s*không chỉ là một nơi an cư, nghỉ dưỡng, mà là tài sản truyền đời.': 'From every perspective, the advantage of a scarce land bank is the factor that differentiates ALIZE\'s value. This is not just a place to settle or vacation, but a lifelong asset.',
    'Quỹ Đất Khan Hiếm': 'Scarce Land Bank',
    'Quỹ đất dọc trục đại lộ Võ Nguyên Giáp\\s*hiện tại hầu như đã lấp đầy. Sở hữu nhà tại đây là nắm trong tay lợi thế gia tăng vô hạn.': 'The land bank along Vo Nguyen Giap Avenue is currently almost fully occupied. Owning a home here means holding an infinite advantage for appreciation.',
    'Khai Thác Lưu Trú': 'Accommodation Operation',
    'Luồng khách quốc tế và giới doanh nhân\\s*ổn định quanh năm giúp ALIZE cực tiện lợi cho vận hành khách sạn / căn hộ dịch vụ cao cấp.': 'The stable year-round flow of international visitors and business people makes ALIZE extremely convenient for operating high-end hotels/serviced apartments.',
    'Trung Tâm Amenities': 'Amenities Center',
    'Thị trường xung quanh vô cùng sôi động\\s*nhờ cộng hưởng với hệ thống giải trí bãi biển, các lễ hội quốc tế tổ chức liền kề dự án.': 'The surrounding market is extremely vibrant due to the resonance with the beach entertainment system and international festivals held adjacent to the project.',
    'Nhận Bản Đồ\\s*Phân Tích': 'Get Analytical Map',
    'Gửi\\s*Yêu Cầu Trải Nghiệm<br /><span class="italic font-serif text-champagne/60">Tại Thực Địa</span>': 'Send Experience Request<br /><span class="italic font-serif text-champagne/60">At Site</span>',
    
    // Additional generic footer/header fixes
    'Trang Chủ': 'Home',
    'Bảo Mật': 'Privacy Policy',
    'Điều Khoản': 'Terms of Service',
    'ALIZE ĐÀ NẴNG': 'ALIZE DA NANG',
};

['amenities.html', 'architecture.html', 'location.html'].forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    for (const [vn, en] of Object.entries(dict)) {
        const regex = new RegExp(vn, 'g');
        content = content.replace(regex, en);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Translated ${file}`);
});
