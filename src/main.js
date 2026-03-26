import './style.css'

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);

// --- Tách chữ thủ công mà không cần gói trả phí SplitText ---
function splitTextToSpans(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    // Trích xuất toàn bộ innerHTML HTML để giữ nguyên thẻ <br> hoặc <span> bên trong
    // Nhưng vì đơn giản hóa, ta bóc text thô ra thành mảng (Dành cho text cơ bản không dính nested HTML sâu)
    // Để an toàn với <span> italic đã viết trong HTML:
    
    // Polyfill đơn giản: Chỉ tách những chỗ chữ đơn giản, dùng Regex lỏng
    const originalHTML = el.innerHTML;
    
    // Nếu có <br> hoặc html phức tạp, cách an toàn nhất là bọc wrapper ngoài chữ.
    // Lập trình nhanh cho .split-text-target:
    let newHTML = '';
    const childNodes = Array.from(el.childNodes);
    childNodes.forEach(node => {
      if (node.nodeType === 3) { // Text node
        const words = node.textContent.split(' ');
        words.forEach(word => {
          if(word.trim() !== '') {
            newHTML += `<span class="split-line-wrapper"><span class="split-word">${word}&nbsp;</span></span>`;
          } else {
            newHTML += ' ';
          }
        });
      } else if (node.nodeType === 1) { // Element node (VD: <br>, <span> italic)
         if (node.tagName.toLowerCase() === 'br') {
            newHTML += '<br/>';
         } else {
            // Đối với inline span có text
            const spanWords = node.innerText.split(' ');
            let spanContent = '';
            spanWords.forEach(w => {
               if(w.trim() !== '') {
                  spanContent += `<span class="split-line-wrapper"><span class="split-word ${node.className}">${w}&nbsp;</span></span>`;
               }
            });
            newHTML += spanContent;
         }
      }
    });

    el.innerHTML = newHTML;
  });
}

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     Page Transition (Luxury Curtain) - REMOVED
  ========================================= */


  // Sticky Header Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.remove('bg-transparent', 'py-6', 'border-transparent');
      header.classList.add('bg-jet-black/80', 'backdrop-blur-xl', 'py-4', 'border-white/5');
    } else {
      header.classList.add('bg-transparent', 'py-6', 'border-transparent');
      header.classList.remove('bg-jet-black/80', 'backdrop-blur-xl', 'py-4', 'border-white/5');
    }
  });

  // Mobile Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  /* =========================================
     Masterpiece GSAP Animations (Super Luxury)
  ========================================= */

  // 1. Chuẩn bị Text Split
  splitTextToSpans('.split-text-target');

  // 2. Kịch bản Hero Section (Gầm thừ & Quyền uy)
  const heroTl = gsap.timeline({ delay: 0.2 });
  
  // Nét vẽ siêu mảnh
  const svgPaths = document.querySelectorAll('.gsap-svg-path');
  svgPaths.forEach(path => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    heroTl.to(path, {
      strokeDashoffset: 0,
      duration: 4,
      ease: "power2.inOut"
    }, 0);
  });

  // Chữ cắt lên mượt mà
  const heroWords = document.querySelectorAll('#hero .split-word');
  heroTl.to(heroWords, {
    y: "0%",
    opacity: 1,
    duration: 2,
    stagger: 0.08,
    ease: "expo.out"
  }, 0.5);

  // Khối phụ mờ dần xuất hiện
  const heroFades = document.querySelectorAll('.gsap-hero-fade');
  heroTl.fromTo(heroFades, 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 2.5, stagger: 0.2, ease: "power2.out" },
    1.5
  );

  // 3. Scroll Text Split Sweep
  const scrollSplitElements = document.querySelectorAll('.scroll-split-target');
  scrollSplitElements.forEach(section => {
    const words = section.querySelectorAll('.split-word');
    gsap.to(words, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: "0%",
      opacity: 1,
      duration: 1.8,
      stagger: 0.04,
      ease: "expo.out"
    });
  });

  // 4. Bóc mặt nạ hình ảnh (Clip path swipe up)
  const imageMasks = document.querySelectorAll('.gsap-image-mask');
  imageMasks.forEach(mask => {
    gsap.to(mask, {
      scrollTrigger: {
        trigger: mask,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      autoAlpha: 1, // Kích cho visibility hiện lên
      duration: 2.5,
      ease: "power4.inOut"
    });
    
    // Zoom out ảnh bên trong bức tường đang thuôn mask
    const imgInside = mask.querySelector('img');
    if (imgInside) {
      gsap.fromTo(imgInside, 
        { scale: 1.3 },
        {
          scrollTrigger: {
            trigger: mask,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          scale: 1,
          duration: 3,
          ease: "power3.out"
        }
      );
    }
  });

  // 5. Thể hiện khoảng cách Parallax của hình nền Hero
  const parallaxBgs = document.querySelectorAll('.gsap-parallax-bg');
  parallaxBgs.forEach(bg => {
    gsap.to(bg, {
      scrollTrigger: {
        trigger: bg.parentNode,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      },
      yPercent: 15,
      ease: "none"
    });
  });

  // 6. Stagger danh sách một cách thanh thoát
  const staggerParents = document.querySelectorAll('.gsap-stagger-parent');
  staggerParents.forEach((parent) => {
    const children = parent.querySelectorAll('.gsap-stagger-child, .gsap-stagger-card');
    gsap.fromTo(children,
      { autoAlpha: 0, y: 40 },
      {
        scrollTrigger: {
          trigger: parent,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        duration: 2,
        autoAlpha: 1,
        y: 0,
        stagger: 0.2, // Chậm và đẳng cấp, không giật gấp
        ease: "power3.out"
      }
    );
  });

  // 7. Background Điện Ảnh (Tự động thích nghi)
  const locSection = document.getElementById('location');
  if(locSection) {
    ScrollTrigger.create({
       trigger: locSection,
       start: "top 40%",
       end: "bottom 40%",
       onEnter: () => gsap.to('body', { backgroundColor: '#070A10', duration: 2, ease: "none", overwrite: "auto" }),
       onLeave: () => gsap.to('body', { backgroundColor: '#050505', duration: 2, ease: "none", overwrite: "auto" }),
       onEnterBack: () => gsap.to('body', { backgroundColor: '#070A10', duration: 2, ease: "none", overwrite: "auto" }),
       onLeaveBack: () => gsap.to('body', { backgroundColor: '#050505', duration: 2, ease: "none", overwrite: "auto" })
    });
  }

  // Khỏi động lại phép toán ScrollTrigger
  window.addEventListener("load", () => ScrollTrigger.refresh());
});
