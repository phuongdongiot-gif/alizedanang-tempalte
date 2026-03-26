const fs = require('fs');
const path = require('path');

const bDir = 'd:\\Iworkspaces\\alize-template';

const vnHtml = `
<div class="space-y-8 max-w-lg mx-auto text-center mt-12 gsap-stagger-parent">
  <div class="gsap-stagger-child bg-charcoal/30 border border-gold/20 p-8 hover:border-gold/50 transition-colors duration-500 rounded-sm">
    <span class="text-gold text-[10px] uppercase tracking-[0.3em] font-light mb-4 block">Hotline Tư Vấn (24/7)</span>
    <a href="tel:0799036842" class="font-serif text-3xl md:text-4xl text-pearl-white hover:text-gold transition-colors duration-300 tracking-wider">0799.036.842</a>
  </div>
  <div class="gsap-stagger-child bg-charcoal/30 border border-gold/20 p-8 hover:border-gold/50 transition-colors duration-500 rounded-sm">
    <span class="text-gold text-[10px] uppercase tracking-[0.3em] font-light mb-4 block">Trợ Lý Riêng Tư</span>
    <a href="https://zalo.me/0799036842" target="_blank" class="inline-flex items-center justify-center space-x-3 w-full px-8 py-4 bg-gold text-jet-black font-light text-[11px] uppercase tracking-[0.2em] hover:bg-pearl-white transition-colors duration-500 border border-gold hover:border-pearl-white">
      <span>Kết Nối Zalo Nhận Báo Giá</span>
      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clip-rule="evenodd" /></svg>
    </a>
  </div>
</div>
`;

const enHtml = `
<div class="space-y-8 max-w-lg mx-auto text-center mt-12 gsap-stagger-parent">
  <div class="gsap-stagger-child bg-charcoal/30 border border-gold/20 p-8 hover:border-gold/50 transition-colors duration-500 rounded-sm">
    <span class="text-gold text-[10px] uppercase tracking-[0.3em] font-light mb-4 block">Consulting Hotline (24/7)</span>
    <a href="tel:0799036842" class="font-serif text-3xl md:text-4xl text-pearl-white hover:text-gold transition-colors duration-300 tracking-wider">0799.036.842</a>
  </div>
  <div class="gsap-stagger-child bg-charcoal/30 border border-gold/20 p-8 hover:border-gold/50 transition-colors duration-500 rounded-sm">
    <span class="text-gold text-[10px] uppercase tracking-[0.3em] font-light mb-4 block">Private Assistant</span>
    <a href="https://zalo.me/0799036842" target="_blank" class="inline-flex items-center justify-center space-x-3 w-full px-8 py-4 bg-gold text-jet-black font-light text-[11px] uppercase tracking-[0.2em] hover:bg-pearl-white transition-colors duration-500 border border-gold hover:border-pearl-white">
      <span>Connect Zalo For Quotes</span>
      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clip-rule="evenodd" /></svg>
    </a>
  </div>
</div>
`;

function processFile(filePath, isEn) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the entire <form ... </form> tag cluster
    const regex = /<form[\s\S]*?<\/form>/g;
    if(regex.test(content)) {
        content = content.replace(regex, isEn ? enHtml : vnHtml);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Replaced forms in " + filePath);
    }
}

// Vietnamese Pages
processFile(path.join(bDir, 'index.html'), false);
processFile(path.join(bDir, 'contact.html'), false);

// English Pages
processFile(path.join(bDir, 'en', 'index.html'), true);
processFile(path.join(bDir, 'en', 'contact.html'), true);
