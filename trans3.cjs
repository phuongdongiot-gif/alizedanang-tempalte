const fs = require('fs');
const path = require('path');

const dir = 'd:\\Iworkspaces\\alize-template\\en';

const dict = {
    // Shared
    'Liên Hệ ALIZE': 'Contact ALIZE',
    'Đăng Ký Discover': 'Register to Discover',
    'Trang Chủ': 'Home',

    // Contact
    'KẾT NỐI SỰ PHỒN VINH': 'CONNECTING PROSPERITY',
    'Trở Thành <br /><span class="font-serif italic font-light text-gold/90">Chủ Nhân Tương Lai</span>': 'Become <br /><span class="font-serif italic font-light text-gold/90">A Future Owner</span>',
    'Cuộc đối thoại riêng tư dành cho Quý khách hàng tinh hoa. Hãy để chuyên viên tư vấn cao cấp của chúng tôi mang định nghĩa xa xỉ đến ngưỡng cửa nhà bạn.': 'A private dialogue for the elite clients. Let our senior consultants bring the definition of luxury to your doorstep.',
    'Thông Tin Liên Hệ': 'Contact Information',
    'Văn Phòng ALIZE Gallery': 'ALIZE Gallery Office',
    'Mặt tiền Võ Nguyên Giáp, Biển Mỹ Khê': 'Vo Nguyen Giap Frontage, My Khe Beach',
    'Quận Sơn Trà, Thành phố Đà Nẵng, Việt Nam.': 'Son Tra District, Da Nang City, Vietnam.',
    'Đường Dây Nóng Tư Vấn \\(24/7\\)': 'Consulting Hotline (24/7)',
    'Thư Điện Tử': 'Email Address',
    'Website Chính Thức': 'Official Website',
    'Mạng Xã Hội Giới Tinh Hoa': 'Elite Social Networks',
    'Ký Gửi & Báo Giá Ưu Đãi': 'Consignment & Preferential Quotes',
    'Book a Private Appointment': 'Book a Private Appointment',
    'Họ & Tên': 'Full Name',
    'Vui lòng nhập họ tên': 'Please enter your full name',
    'Số Điện Thoại': 'Phone Number',
    'Vui lòng nhập số điện thoại': 'Please enter your phone number',
    'Thư Điện Tử \\(Email\\)': 'Email Address',
    'Email nhận thiệp mời định danh': 'Email for personalized invitation',
    'Sản Phẩm Quan Tâm': 'Product of Interest',
    'Căn hộ Studio / 1 Phòng Ngủ': 'Studio / 1 Bedroom Apartment',
    'Căn hộ 2 Phòng Ngủ': '2 Bedroom Apartment',
    'Sky Penthouse V.I.P': 'V.I.P Sky Penthouse',
    'Shophouse Thương Mại': 'Commercial Shophouse',
    'Personal Message \\(Optional\\)': 'Personal Message (Optional)',
    'Chuyên viên của chúng tôi sẽ hồi đáp vào không gian thời gian bạn muốn...': 'Our consultants will respond at your preferred time and space...',
    'Mọi thông tin chi tiết đều được bảo mật cấp cao nhất.': 'All detailed information is kept at the highest level of confidentiality.',
    'Tuyệt tác kiến trúc ven biển dành cho sự tĩnh tại và phong cách\\s*sống vô song.': 'Coastal architectural masterpiece for unrivaled tranquility and lifestyle.',
    
    // Floorplans
    'BẢN ĐỒ KIẾN TẠO THƯỢNG LƯU': 'MAP OF ELITE CREATION',
    'QUY HOẠCH <br /><span class="font-serif italic font-light text-gold/90">Chi Tiết Từng Tầng</span>': 'PLANNING <br /><span class="font-serif italic font-light text-gold/90">Detailed Floor by Floor</span>',
    'Quy mô ấn tượng gồm 2 tháp căn hộ cao 25 tầng và 3 tầng hầm, trên tổng diện tích 4.000m². Khai mở thế giới sống riêng biệt nhưng vẫn đảm bảo sự nhịp nhàng thanh thoát từ tầng trệt chạm đến những đám mây.': 'Impressive scale consisting of 2 25-story apartment towers and 3 basements, on a total area of 4,000m². Opening a separate living world while still ensuring the pure rhythm from the ground floor touching the clouds.',
    '2 Tháp - 640 Căn Hộ': '2 Towers - 640 Apartments',
    'Mặt Cắt Gallery': 'Gallery Cross Section',
    'Cấu Trúc <br /><span class="italic font-serif text-pearl-white/70">Phân Phân Tầng</span>': 'Structure <br /><span class="italic font-serif text-pearl-white/70">Floor by Floor</span>',
    'Tầng 6 – 25': 'Floor 6 – 25',
    'Cao 3.5m / Tầng': '3.5m Height / Floor',
    'Căn Hộ Hạng Sang \\(Luxury Apartments\\)': 'Luxury Apartments',
    'Tuyệt tác không gian mở thông thoáng hưởng trọn ánh sáng tự nhiên. Thiết kế tối ưu hóa tầm nhìn Panorama hướng biển, mang lại sự trong lành thanh thiết.': 'Masterpiece of open space enjoying full natural light. Design optimizing Panorama sea views, bringing pure freshness.',
    'Tầng 5': 'Floor 5',
    'Cao 6.0m': '6.0m Height',
    'Tầng Amenities Đỉnh Cao \\(Amenities Deck\\)': 'Pinnacle Amenities Deck',
    'Nơi hội tụ của đặc quyền tĩnh lặng với Hồ bơi vô cực ngắm chóp biển, Trung tâm Spa thanh tĩnh, và Gym & Yoga hiện đại giữa vườn treo.': 'Where quiet privilege converges with an infinity pool overlooking the sea peak, serene Spa center, and modern Gym & Yoga amidst suspended gardens.',
    'Tầng 2 – 4': 'Floor 2 – 4',
    'Cao 5.0m / Tầng': '5.0m Height / Floor',
    'Thương mại và Services Khối Đế': 'Podium Commerce & Services',
    'Tổ hợp sầm uất với chuỗi F&B chuẩn Fine Dining, chuỗi mua sắm thương hiệu cao cấp và siêu thị phục vụ cư dân.': 'A bustling complex with Fine Dining F&B chains, high-end brand shopping, and supermarkets serving residents.',
    'Tầng 1': 'Floor 1',
    'Cao 7.0m': '7.0m Height',
    'Đại Sảnh & Shophouse Du Lịch': 'Grand Lobby & Tourist Shophouse',
    'Dãy Shophouse thông tầng mặt ngoài đón dòng khách du lịch. Mặt trong là Lounge đón khách sảnh căn hộ chuẩn khách sạn 5 sao khép kín.': 'Duplex shophouse row on the exterior welcomes tourists. Inside is a closed 5-star standard hotel lobby Lounge.',
    'Tầng B1 – B3': 'Floor B1 – B3',
    'Dưới Lòng Đất': 'Underground',
    'Hầm Đỗ Xe Thông Minh': 'Smart Parking Basement',
    '3 Mức hầm diện tích lớn đáp ứng tỷ lệ bãi đậu xe riêng tư, trạm sạc xe điện tối tân.': '3-level large area basement meets private parking ratio, state-of-the-art EV charging stations.',
    'Bộ Sưu Tập Giới Hạn': 'Limited Collection',
    '640 Căn Hộ <br/><span class="italic font-serif text-pearl-white/70">640 Tác Phẩm Nghệ Thuật</span>': '640 Apartments <br/><span class="italic font-serif text-pearl-white/70">640 Art Masterpieces</span>',
    'Studio & 1 Phòng Ngủ': 'Studio & 1 Bedroom',
    'Tối giản tinh tế': 'Exquisite Minimalism',
    'Lựa chọn lý tưởng cho các chuyên gia và nhà đầu tư cho thuê ngăn hạn. Tối đa hóa công năng sử dụng trong thiết kế liền mạch.': 'Ideal choice for professionals and short-term rental investors. Maximizing usability in seamless design.',
    'Căn Hộ 2 Phòng Ngủ': '2 Bedroom Apartment',
    'Tổ ấm lý tưởng': 'Ideal Home',
    'Thiết kế rộng rãi có ban công đôi ôm trọn ánh sáng. Chắp cánh cho cuộc sống gia đình thượng lưu hoặc những kỳ nghỉ ngơi bất tận.': 'Spacious design with dual balconies embracing light. Fostering elite family life or endless vacations.',
    'Tầng Không Sky Penthouse': 'Sky Penthouse',
    'Trọn Vẹn Bầu Trời': 'The Entire Sky',
    'Tọa lạc tại đỉnh tháp vút cao. Sở hữu hồ bơi riêng biệt, logia vương giả và không gian thưởng rượu, dành riêng cho các tỷ phú.': 'Located at the soaring tower peak. Possessing private pools, royal loggias, and wine lounges, exclusive for billionaires.',
    'Phân Phối Chính Thức': 'Official Distribution',
    'Yêu Cầu Bộ Hồ Sơ Thiết Kế<br/><span class="italic font-serif text-champagne/60">& Báo Giá Chi Tiết</span>': 'Request Design Dossier<br/><span class="italic font-serif text-champagne/60">& Detailed Quote</span>',
    'Tải\\s*Xuống PDF': 'Download PDF',
    
    // Values
    'GIÁ TRỊ VÔ HÌNH': 'INVISIBLE VALUES',
    'Giá Trị <br /><span class="font-serif italic font-light text-gold/90">Truyền Đời</span>': 'Lifelong <br /><span class="font-serif italic font-light text-gold/90">Values</span>',
    'Sở hữu ALIZE là sở hữu một biểu tượng định danh không thể sao chép. Nơi giao thoa giữa di sản bền vững và phong cách sống thời thượng nhất.': 'Owning ALIZE is owning an irreplaceable calling card. The intersection of sustainable heritage and the most trendy lifestyle.',
    'Vị Trí Độc Tôn': 'Exclusive Location',
    'Trực diện biển Mỹ Khê - một trong những bãi biển quyến rũ nhất hành tinh. Quỹ đất vàng cuối cùng trên trục đại lộ tỷ đô Võ Nguyên Giáp.': 'Directly facing My Khe Beach - one of the most charming beaches on the planet. The last golden land bank on the billion-dollar Vo Nguyen Giap avenue.',
    'Thiết Kế Độc Bản': 'Unique Design',
    'Ngôn ngữ thiết kế Minimalist kết hợp với cảm hứng từ thiên nhiên biển trời, mang đến một ALIZE vừa phóng khoáng, vừa tinh tế đến từng chi tiết.': 'Minimalist design language combined with inspiration from the sea and sky, bringing an ALIZE that is both liberal and refined in every detail.',
    'Hệ Sinh Thái Khép Kín': 'Closed Ecosystem',
    'Chuỗi tiện ích nội khu chuẩn 5 sao đáp ứng mọi nhu cầu khắt khe nhất của cộng đồng tinh hoa, thiết lập tiêu chuẩn sống mới tại Đà Nẵng.': 'A 5-star standard internal amenities chain meeting all strict needs of the elite community, setting new living standards in Da Nang.',
    
    // Services
    'ĐẶC QUYỀN V.I.P': 'V.I.P PRIVILEGES',
    'Dịch Vụ <br /><span class="font-serif italic font-light text-gold/90">Chuẩn Quốc Tế</span>': 'Services <br /><span class="font-serif italic font-light text-gold/90">International Standards</span>',
    'Đội ngũ quản lý chuyên nghiệp từ Marriott mang đến cho cư dân ALIZE phong thái tận hưởng cuộc sống không chút âu lo, trọn vẹn từng khoảnh khắc.': 'A professional management team from Marriott brings ALIZE residents the demeanor of enjoying a worry-free life, fulfilling every moment.',
    'Đặc Quyền Concierge': 'Concierge Privileges',
    'Hỗ trợ đặt vé sự kiện, nhà hàng cao cấp michelin, phương tiện di chuyển hạng sang suốt 24/7.': 'Support booking event tickets, high-end Michelin restaurants, and luxury transport 24/7.',
    'Chăm Sóc Gia Đình': 'Family Care',
    'Dịch vụ dọn phòng chuyên nghiệp, chăm sóc trẻ em, bảo dưỡng căn hộ theo chu kỳ chuẩn khách sạn resort.': 'Professional housekeeping, babysitting, and apartment maintenance sequentially aligned with resort hotel standards.'
};

['floorplans.html', 'contact.html', 'values.html', 'services.html'].forEach(file => {
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
