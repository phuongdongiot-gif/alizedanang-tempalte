const fs = require('fs');
const path = require('path');

const dir = 'd:\\Iworkspaces\\alize-template\\en';

const dict = {
    // Gallery
    'TRIỂN\\s*LÃM THỊ GIÁC': 'VISUAL EXHIBITION',
    'THƯ VIỆN ĐỘC BẢN <br /><span class="font-serif italic font-light text-pearl-white/90">Mang Tầm Kiệt Tác</span>': 'UNIQUE GALLERY <br /><span class="font-serif italic font-light text-pearl-white/90">A Masterpiece</span>',
    'Chiêm ngưỡng những đường nét kiến trúc tinh xảo và không gian nội thất xa hoa nhất, nơi mà mỗi bức ảnh đều là\\s*một thước phim cô đọng về lối sống vương giả tại vùng biển di sản.': 'Admire the exquisite architectural lines and the most luxurious interior spaces, where every photo is a condensed film about royal lifestyle at the heritage coast.',
    'Phân Phân Khu\\s*01': 'Zone 01',
    'Dấu\\s*Ấn Architecture': 'Architectural Imprint',
    'Kết cấu 2 tòa tháp biểu tượng nổi bật sừng sững trên trục đại lộ ven biển kim cương.': 'The iconic two-tower structure stands out prominently on the diamond coastal avenue axis.',
    'Tầm Nhìn\\s*Tổng Thể': 'Overall Vision',
    'Phân Phân Khu\\s*02': 'Zone 02',
    'Đặc Quyền Amenities': 'Amenities Privileges',
    'Từ hồ bơi vô cực ngắm bình\\s*minh trên biển đến không gian riêng tư của phòng giải trí Cigar & Wine.': 'From the infinity pool watching the sunrise over the sea to the private space of the Cigar & Wine entertainment lounge.',
    'Phân Phân Khu\\s*03': 'Zone 03',
    'Sành\\s*Điệu Gallery Sống': 'Stylish Living Gallery',
    'Mọi ngóc ngách đều là kiệt tác phản chiếu cái tôi độc nhất biệt tuyệt của giới tinh hoa.': 'Every corner is a masterpiece reflecting the unique, absolute ego of the elite.',
    'Trực Quang\\s*Sinh Động': 'Vivid Visuals',
    'Yêu\\s*Cầu Tham Quan Virtual Tour<br /><span class="italic font-serif text-champagne/60">& Ảnh Hướng Thực Tế</span>': 'Request a Virtual Tour<br /><span class="italic font-serif text-champagne/60">& Actual Field Photos</span>',
    'Đăng\\s*Ký Tham Quan Toàn Cảnh 360': 'Register for Full 360° Tour',

    // Index
    'Biểu Tượng Sống Thượng Lưu': 'Symbol of Elite Living',
    'TUYỆT TÁC <br /><span class="font-serif italic font-light text-pearl-white/90">Gallery</span>': 'MASTERPIECE <br /><span class="font-serif italic font-light text-pearl-white/90">Gallery</span>',
    'Tọa độ hoàng kim, tầm nhìn vô cực, thiết kế độc bản. Nơi trải nghiệm sống vượt xa mọi chuẩn mực dành riêng cho\\s*cộng đồng tinh hoa.': 'Golden coordinates, infinity views, unique design. A place of living experiences far beyond all standards exclusively for the elite community.',
    '01 — Tổng\\s*Quan Dự Án': '01 — Project Overview',
    'Biểu Tượng Sống<br /><span class="italic font-serif text-pearl-white/70">Tọa Độ Kim Cương</span>': 'Symbol of Living<br /><span class="italic font-serif text-pearl-white/70">Diamond Coordinates</span>',
    'Không đơn thuần là một dự án gần biển, ALIZE sở hữu vị trí trực diện biển Mỹ Khê, khoảng cách ra bãi cát\\s*chỉ vài phút đi bộ. Sự giao thoa giữa không gian đô thị sầm uất và thiên nhiên tĩnh lặng ven biển tạo\\s*lập một biểu tượng sống đích thực, tài sản truyền đời.': 'Not merely a project near the sea, ALIZE possesses a direct view of My Khe Beach, just a few minutes walk to the smooth sand. The intersection between bustling urban space and tranquil coastal nature creates a true symbol of living, a lifelong heritage.',
    'Tên dự án': 'Project Name',
    'Căn hộ Alize Đà Nẵng': 'Alize Da Nang Apartments',
    'Chủ đầu tư': 'Developer',
    'A&T Group': 'A&T Group',
    'Vị trí': 'Location',
    'Võ Nguyên Giáp, An Hải, Đà Nẵng': 'Vo Nguyen Giap St, An Hai, Da Nang',
    'Quy mô': 'Scale',
    '2.867 m2, 1 tòa tháp cao 40 tầng': '2,867 sqm, 1 40-story tower',
    'Đơn vị thiết kế & XD': 'Design & Build Unit',
    'AEDAS / CUBIC Architects': 'AEDAS / CUBIC Architects',
    '02 — Values\\s*Truyền Đời': '02 — Lifelong Values',
    'Tuyệt\\s*Tác Đầu Tư <br /><span class="italic font-serif text-pearl-white/70">Vượt Thời Gian</span>': 'Investment Masterpiece <br /><span class="italic font-serif text-pearl-white/70">Beyond Time</span>',
    'Trực Diện Biển': 'Direct Sea Facing',
    'Sở hữu mặt tiền đại lộ Võ Nguyên Giáp,\\s*tầm nhìn vô cực trực diện bãi biển Mỹ Khê - một trong những trục biển tỷ đô giá trị bậc nhất miền Trung.': 'Located on Vo Nguyen Giap Avenue frontage, infinity views directly facing My Khe Beach - one of the most valuable billion-dollar coastal axes in the Central region.',
    'Tăng Giá Bền Vững': 'Sustainable Appreciation',
    'Nằm trong lõi du lịch đô thị. Gia tăng\\s*giá trị dài hạn theo quỹ đất biển trung tâm ngày càng khan hiếm, hạn chế phụ thuộc chu kỳ thị trường.': 'Located in the core of urban tourism. Long-term value appreciation driven by increasingly scarce central coastal land banks, limiting dependence on market cycles.',
    'Khai Thác Cho Thuê': 'Rental Exploitation',
    'Cộng hưởng mạnh mẽ từ sinh thái du\\s*lịch, dễ dàng phù hợp với mô hình cho thuê nghỉ dưỡng cao cấp, căn hộ dịch vụ lưu trú ngắn hạn.': 'Strong resonance from the tourism ecosystem, easily suitable for high-end resort rental models and short-term serviced apartments.',
    '03 — Location\\s*Độc Tôn': '03 — Exclusive Location',
    'Tọa\\s*Độ Kim Cương': 'Diamond Coordinates',
    '2 - 5 Phút Di Chuyển': '2 - 5 Minutes Travel',
    'Chỉ 2 phút đến Cầu Rồng, trung tâm\\s*du lịch Bạch Đằng. Kết nối nhanh chóng đến Sân bay quốc tế Đà Nẵng vỏn vẹn trong 5 phút.': 'Just 2 minutes to Dragon Bridge and Bach Dang tourist center. Quick connection to Da Nang International Airport in just 5 minutes.',
    '10 - 25 Phút Kết Nối': '10 - 25 Minutes Connection',
    'Khám phá khu danh thắng Ngũ Hành\\s*Sơn chỉ trong 10 phút và di chuyển linh hoạt đến Phố cổ Hội An quyến rũ trong vòng 25 phút.': 'Explore the majestic Marble Mountains in just 10 minutes and flexibly move to the charming Hoi An Ancient Town within 25 minutes.',
    '04 — Kiệt\\s*Tác Thiết Kế': '04 — Design Masterpiece',
    'Ngôn Ngữ Của Tương Lai': 'Language Of The Future',
    'Căn hộ Alizé Đà Nẵng chính là giải pháp "xoay mặt" thông minh, giúp tối ưu hóa tầm nhìn Panorama bốn\\s*hướng. Dù sở hữu loại hình căn hộ nào, chủ nhân cũng dễ dàng thu trọn vào tầm mắt: từ bình minh rực rỡ\\s*trên biển Mỹ Khê, vẻ đẹp thơ mộng sông Hàn đến sự hùng vĩ của bán đảo Sơn Trà. Các tầng được thiết kế\\s*giật cấp, kết hợp nhuần nhuyễn giữa kiến trúc thân thuộc và sang trọng \\(Traditional Contemporary\\).': 'Alize Da Nang apartment is a smart \'twisted\' solution optimizing four-directional Panorama views. Regardless of apartment type, owners can easily capture the views: from the brilliant sunrise over My Khe Beach, the poetic beauty of the Han River to the majesty of Son Tra Peninsula. The stepped design seamlessly blends familiar and luxury architecture (Traditional Contemporary).',
    '05 — Đặc\\s*Quyền Thượng Lưu': '05 — Elite Privileges',
    'Trải Nghiệm Đẳng Cấp 5 Sao': '5-Star Premium Experience',
    'Mật độ xây dựng thấp chỉ\\s*38.55%, cư dân hòa mình vào công viên nội khu 1.655m2. Hệ thống khép kín trọn vẹn từ vườn hoa 4 mùa,\\s*trung tâm thể thao, đến khu shophouse thương mại đa dạng.': 'With a low building density of only 38.55%, residents immerse themselves in a 1,655sqm internal park. A fully enclosed system from 4-season flower gardens, sports centers to diverse commercial shophouse areas.',
    'Tầng\\s*Thượng': 'Rooftop',
    'Hồ Bơi Vô Cực Trên Cao': 'Sky Infinity Pool',
    'Sở hữu hồ bơi vô cực trên không \\(Sky\\s*Pool\\), thư giãn đón bình minh và phục hồi năng lượng giữa tầng mây bao la.': 'Owning a sky infinity pool (Sky Pool), relaxing to welcome the sunrise and restoring energy amidst the vast clouds.',
    'Vườn treo xanh mướt hòa nhịp cùng\\s*trung tâm thể dục thể thao hiện đại, Yoga & Spa chuẩn quốc tế để tái tạo sinh khí.': 'The lush green suspended garden harmonizes with the modern sports center, international standard Yoga & Spa to regenerate vitality.',
    'Tầng Thấp': 'Lower Floors',
    'Dãy Shophouse mua sắm sầm uất đa\\s*dạng phong vị cùng khu vui chơi trẻ em an toàn đầy sáng tạo cho con trẻ thỏa sức vun vén ước mơ.': 'A bustling shophouse row with diverse flavors along with a safe, creative children\'s play area for kids to freely foster their dreams.',
    '06 — Services\\s*Kim Cương': '06 — Diamond Services',
    '07 — Bản\\s*Đồ Gallery': '07 — Gallery Map',
    'Bản Vẽ Độc Bản': 'Unique Blueprints',
    'Quy mô ấn tượng gồm 2 tháp căn\\s*hộ cao 25 tầng và 3 tầng hầm, trên tổng diện tích 4.000m². Cung cấp 640 căn hộ cao cấp sang trọng, không\\s*gian mở thông thoáng hưởng trọn ánh sáng tự nhiên.': 'Impressive scale consisting of 2 25-story apartment towers and 3 basements, on a total area of 4,000m². Providing 640 luxury apartments with open, airy spaces enjoying full natural light.',
    'Thiết kế thông minh tối ưu không gian sống cho giới chuyên gia hoặc cá nhân độc lập, mang đậm phong\\s*cách minimalist thượng lưu Châu Âu.': 'Smart design optimizing living space for professionals or independent individuals, imbuing the European elite minimalist style.',
    'Diện tích tim\\s*tường': 'Built-up Area',
    'Trạng thái': 'Status',
    'Đang mở bán': 'Now Selling',
    'Trải nghiệm không gian sống rộng mở với thiết kế ban công panorama ôm trọn thiên nhiên vào lòng căn\\s*hộ, lý tưởng cho gia đình.': 'Experience expansive living space with a panorama balcony design that embraces nature into the heart of the apartment, ideal for families.',
    'Tầm nhìn': 'View',
    'Kiệt tác trên những tầng mây với tiện nghi đỉnh cao: hồ bơi cá nhân ngoạn mục, sân vườn treo lơ lửng\\s*và sảnh đón tiếp sang trọng.': 'A masterpiece in the clouds with top-tier amenities: spectacular private pool, suspended garden, and luxurious reception hall.',
    'Đặc Quyền': 'Privileges',
    '08 — Nghệ\\s*Thuật Gallery': '08 — Art Gallery',
    'Góc\\s*Nhìn Thượng Lưu': 'Elite Perspective',
    '09 — Đỉnh\\s*Cao Hợp Tác': '09 — Peak Cooperation',
    'Architecture Tượng\\s*Đài': 'Monumental Architecture',
    'Vận Hành & Services': 'Operations & Services',
    'Tổng Thầu Thi Công': 'General Contractor',
    'Nghệ Thuật Cảnh\\s*Quan': 'Landscape Art',
    'Liên Hệ Tri\\s*Âm': 'Contact Soulmates',
    'Mở Cửa Kỷ Nguyên Mới': 'Opening A New Era',
    'Hẹn gặp lại Quý khách ở những không gian nghệ thuật đích thực. Đăng nhập hệ thống nội bộ để nhận thư mời kín\\s*từ ALIZE.': 'See you again in true artistic spaces. Log into the internal system to receive a private invitation from ALIZE.',
    'Danh Xưng': 'Your Name',
    'Địa chỉ Email': 'Email Address',
    'Gửi Yêu Cầu Gặp Mặt': 'Send Meeting Request'
};

['index.html', 'gallery.html'].forEach(file => {
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
