const fs = require('fs');
const path = require('path');

const dir = 'd:\\Iworkspaces\\alize-template';
const enDir = path.join(dir, 'en');

const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    // ---- UPGRADE VN VERSION ----
    const vnPath = path.join(dir, file);
    if (fs.existsSync(vnPath)) {
        let vnContent = fs.readFileSync(vnPath, 'utf8');
        
        const oldVNSwitcherRegex = new RegExp(`<a href="\\/en\\/${file}" class="ml-6 font-light uppercase tracking-\\[0\\.2em\\] text-\\[11px\\] text-pearl-white\\/60 hover:text-gold transition-all duration-500">EN<\\/a>`);
        const newVNSwitcher = `
            <div class="relative group ml-6 flex items-center">
              <button class="flex items-center space-x-1.5 text-[11px] font-light uppercase tracking-[0.2em] text-pearl-white/80 hover:text-gold transition-colors duration-500 focus:outline-none cursor-pointer">
                <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                <span>VI</span>
              </button>
              <div class="absolute top-full right-0 mt-4 w-36 bg-jet-black/98 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-2 group-hover:translate-y-0 shadow-2xl z-[999]">
                <a href="/${file}" class="block px-6 py-4 text-[10px] text-pearl-white hover:text-jet-black hover:bg-gold transition-colors duration-300 tracking-[0.2em] uppercase border-b border-white/5">Tiếng Việt</a>
                <a href="/en/${file}" class="block px-6 py-4 text-[10px] text-pearl-white/70 hover:text-jet-black hover:bg-gold transition-colors duration-300 tracking-[0.2em] uppercase">English</a>
              </div>
            </div>`;
        
        if (vnContent.match(oldVNSwitcherRegex)) {
            vnContent = vnContent.replace(oldVNSwitcherRegex, newVNSwitcher);
            fs.writeFileSync(vnPath, vnContent, 'utf8');
            console.log(`Upgraded switcher in ${file}`);
        } else {
            console.log(`Could not match old switcher in ${file}`);
        }
    }

    // ---- UPGRADE EN VERSION ----
    const enPath = path.join(enDir, file);
    if (fs.existsSync(enPath)) {
        let enContent = fs.readFileSync(enPath, 'utf8');
        
        // Note: The EN page has <a href="/file.html">VI</a>
        const oldENSwitcherRegex = new RegExp(`<a href="\\/${file}" class="ml-6 font-light uppercase tracking-\\[0\\.2em\\] text-\\[11px\\] text-pearl-white\\/60 hover:text-gold transition-all duration-500">VI<\\/a>`);
        const newENSwitcher = `
            <div class="relative group ml-6 flex items-center">
              <button class="flex items-center space-x-1.5 text-[11px] font-light uppercase tracking-[0.2em] text-pearl-white/80 hover:text-gold transition-colors duration-500 focus:outline-none cursor-pointer">
                <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                <span>EN</span>
              </button>
              <div class="absolute top-full right-0 mt-4 w-36 bg-jet-black/98 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-2 group-hover:translate-y-0 shadow-2xl z-[999]">
                <a href="/${file}" class="block px-6 py-4 text-[10px] text-pearl-white/70 hover:text-jet-black hover:bg-gold transition-colors duration-300 tracking-[0.2em] uppercase border-b border-white/5">Tiếng Việt</a>
                <a href="/en/${file}" class="block px-6 py-4 text-[10px] text-pearl-white hover:text-jet-black hover:bg-gold transition-colors duration-300 tracking-[0.2em] uppercase">English</a>
              </div>
            </div>`;
        
        if (enContent.match(oldENSwitcherRegex)) {
            enContent = enContent.replace(oldENSwitcherRegex, newENSwitcher);
            fs.writeFileSync(enPath, enContent, 'utf8');
            console.log(`Upgraded switcher in en/${file}`);
        } else {
            console.log(`Could not match old switcher in en/${file}`);
        }
    }
});
