// Enhanced JavaScript for Portfolio Website
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.querySelector('header');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const heroSubtitle = document.getElementById('rotating-profession');
    const ctaBtn = document.querySelector('.cta-btn');
    const hireBtns = document.querySelectorAll('.hire-btn');
    const aboutBtn = document.querySelector('.about-btn');
    const socialIcons = document.querySelectorAll('.social-icon');

    // Professions for typewriter effect
    const professions = [
    'Chat',
    'Amnesia',
    'HAL',
    'IBM5100'
];

    // Typewriter Effect
    let professionIndex = 0;
const glitchChars = "!<>-_\\/[]{}—=+*^?#________";

function glitchText(element, finalText, duration = 800) {
    let start = Date.now();

    const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = elapsed / duration;

        if (progress >= 1) {
            element.innerHTML = `I'm a <span class="glitch" data-text="${finalText}">${finalText}</span>`;
            clearInterval(interval);
            return;
        }

        const scrambled = finalText
            .split("")
            .map((char, i) => {
                if (Math.random() < progress) return char;
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join("");

        element.innerHTML = `I'm a <span class="glitch" data-text="${finalText}">${scrambled}</span>`;
    }, 40);
}

function startGlitchCycle() {
    if (!heroSubtitle) return;

    const text = professions[professionIndex];
    glitchText(heroSubtitle, text);

    professionIndex = (professionIndex + 1) % professions.length;
    setTimeout(startGlitchCycle, 2500); // เวลารอเปลี่ยนคำ
}

startGlitchCycle();


    // Mobile Menu Toggle
    function toggleMobileMenu() {
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : 'auto';
    }

    // Smooth Scroll Navigation
    function smoothScroll(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header?.offsetHeight || 80;
                const offsetTop = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu
                if (navMenu?.classList.contains('active')) {
                    toggleMobileMenu();
                }

                // Update active state
                updateActiveNavLink(targetId);
            }
        }
    }

    // Update Active Navigation Link
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }

    // Scroll-based Header Effects
    function handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    // Scroll-based Active Navigation
    function updateActiveNavFromScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + (header?.offsetHeight || 80);

        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
            }
        });

        if (activeSection) {
            const id = '#' + activeSection.getAttribute('id');
            updateActiveNavLink(id);
            
            // Update URL hash
            if (history.pushState) {
                history.pushState(null, null, id);
            }
        } else if (scrollPosition < 100) {
            updateActiveNavLink('#home');
        }
    }

    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavFromScroll, 50);
    });

    // Intersection Observer for Animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for multiple elements
                const siblings = entry.target.parentElement?.querySelectorAll('.animate-on-scroll');
                if (siblings && siblings.length > 1) {
                    siblings.forEach((sibling, index) => {
                        setTimeout(() => {
                            sibling.style.opacity = '1';
                            sibling.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Setup animations for elements
    function setupAnimations() {
        const animatedElements = document.querySelectorAll(
            '.hero-stats .stat, .about-highlights .highlight, .floating-card, .social-icon'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.transitionDelay = `${index * 0.1}s`;
            
            animationObserver.observe(el);
        });
    }

    // Button Click Handlers
    function handleButtonClick(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Add button-specific actions here
        if (button.classList.contains('cta-btn') || button.textContent.includes('Hire')) {
            // Scroll to contact section or show contact modal
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Fallback: show alert or modal
                showNotification('Contact section coming soon!', 'info');
            }
        } else if (button.textContent.includes('Download CV')) {
            // Handle CV download
            showNotification('CV download will be available soon!', 'info');
        }
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'info' ? 'info-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'info' ? 'var(--accent-primary)' : '#10b981',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Keyboard Navigation
    function handleKeyboard(event) {
        // Close mobile menu on Escape
        if (event.key === 'Escape' && navMenu?.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Navigate with arrow keys when menu is open
        if (navMenu?.classList.contains('active') && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault();
            const currentActive = document.querySelector('.nav-link:focus') || document.querySelector('.nav-link.active');
            const navLinksArray = Array.from(navLinks);
            const currentIndex = navLinksArray.indexOf(currentActive);
            
            let nextIndex;
            if (event.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % navLinksArray.length;
            } else {
                nextIndex = currentIndex <= 0 ? navLinksArray.length - 1 : currentIndex - 1;
            }
            
            navLinksArray[nextIndex]?.focus();
        }
    }

    // Performance Optimized Scroll Handler
    let ticking = false;
    function optimizedScrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Debounced Resize Handler
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu on resize to larger screen
            if (window.innerWidth >= 769 && navMenu?.classList.contains('active')) {
                toggleMobileMenu();
            }
        }, 250);
    }

    // Initialize Active Navigation from Hash
    function initializeActiveNav() {
        const hash = window.location.hash || '#home';
        updateActiveNavLink(hash);
        
        // Smooth scroll to section if hash exists
        if (hash !== '#home') {
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const headerHeight = header?.offsetHeight || 80;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    }

    // Event Listeners
    hamburger?.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });

    // Button event listeners
    [ctaBtn, ...hireBtns, aboutBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', handleButtonClick);
        }
    });

    // Social icons hover effects
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Global event listeners
    window.addEventListener('scroll', optimizedScrollHandler);
    window.addEventListener('resize', handleResize);
    window.addEventListener('hashchange', initializeActiveNav);
    document.addEventListener('keydown', handleKeyboard);

    // Handle clicks outside mobile menu
    document.addEventListener('click', (event) => {
        if (navMenu?.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !hamburger?.contains(event.target)) {
            toggleMobileMenu();
        }
    });

    // Initialize everything
    function init() {
        // Start typewriter effect
        if (heroSubtitle) {
            typeWriter();
        }
        
        // Setup animations
        setupAnimations();
        
        // Initialize navigation
        initializeActiveNav();
        
        // Initial scroll check
        handleScroll();
        
        // Add loaded class for CSS animations
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
        
        console.log('Portfolio website initialized successfully! 🚀');
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Simulate form submission (replace with actual API call)
            console.log('Form submitted:', data);

            // Show success message
            showNotification('Thank you for your message! I will get back to you soon.', 'success');

            // Reset form
            this.reset();
        });
    }

    // Initialize the application
    init();

    // Add CSS for ripple effect and notifications
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        button {
            position: relative;
            overflow: hidden;
        }
        
        .loaded {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Focus styles for accessibility */
        .nav-link:focus-visible,
        .social-icon:focus-visible,
        .hire-btn:focus-visible,
        .cta-btn:focus-visible {
            outline: 2px solid var(--accent-primary);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}


// --- MSQ Player JS Start ---
$(document).ready(function () {
  const playlist = [
    {
      name: "いかないで / - Thai Piano Version [Lunacat]",
      artist: "Ikanaide",
      src: "https://raw.githubusercontent.com/chatking12345/chat/main/song/%5BUndertale%20-%20Asriel%5D%20%E3%81%84%E3%81%8B%E3%81%AA%E3%81%84%E3%81%A7%20_%20Ikanaide%20%20-%20Thai%20Piano%20Version%20%5BLunacat%5D.mp3"
    },
    {
      name: "Call your name (Lost Girls Ending Theme)",
      artist: "Hiroyuki Sawano feat. Gemie",
      src: "https://raw.githubusercontent.com/chatking12345/chat/e39473bcf2cff743986b54fe8a92354140590d8d/song/Attack%20on%20Titan%20OST%20-%20Call%20your%20name%E3%80%8ELost%20Girls%20Ending%20Theme%E3%80%8F.mp3"
    },
    {
      name: "Re：ゼロから始める異世界生活 ED",
      artist: "「STYX HELIX」",
      src: "https://raw.githubusercontent.com/chatking12345/chat/e39473bcf2cff743986b54fe8a92354140590d8d/song/Re-Zero%20kara%20Hajimeru%20Isekai%20Seikatsu%20Ending%20FULL%20-%20Re%EF%BC%9A%E3%82%BC%E3%83%AD%E3%81%8B%E3%82%89%E5%A7%8B%E3%82%81%E3%82%8B%E7%95%B0%E4%B8%96%E7%95%8C%E7%94%9F%E6%B4%BB%20ED%20%E3%80%8CSTYX%20HELIX%E3%80%8D.mp3"
    },
    {
      name: "Last Game",
      artist: "Zwei",
      src: "https://raw.githubusercontent.com/chatking12345/chat/e39473bcf2cff743986b54fe8a92354140590d8d/song/Steins%3BGate%200%20Ending%20Full%E3%80%8ELast%20Game%20By%20Zwei%E3%80%8F.mp3"
    },
    {
      name: "Leaving Tonight",
      artist: "The Neighbourhood",
      src: "https://raw.githubusercontent.com/chatking12345/chat/main/song/The%20Neighbourhood%20-%20Leaving%20Tonight%20(Official%20Audio).mp3"
    },
    {
      name: "last summer",
      artist: "ooes",
      src: "https://raw.githubusercontent.com/chatking12345/chat/main/song/last%20summer%20(sped%20up).mp3"
    }
  ];

  // ตั้งค่าเริ่มต้น (ลดการประกาศซ้ำซ้อน)
  let currentTrack = Math.floor(Math.random() * playlist.length);
  let audioPlayer = new Audio(playlist[currentTrack].src); 
  let isShuffle = false;
  let isScrubbing = false;
  let scrubPreviewTime = 0;

  const updateSongDetails = () => {
    const song = playlist[currentTrack];
    $(".song-name").text(song.name);
    $(".artist-name").text(song.artist);

    if (song.name.length > 25) {
      $(".song-name").addClass("scroll");
    } else {
      $(".song-name").removeClass("scroll");
    }

    if (!audioPlayer.src.includes(song.src)) {
      audioPlayer.src = song.src;
      audioPlayer.load();
    }
  };

  const playTrack = () => {
    updateSongDetails();
    audioPlayer.play().catch(e => console.log("Autoplay waiting for user interaction"));
    $(".play").hide();
    $(".pause").show();
    $(".equalizer").removeClass("paused");
  };

  const pauseTrack = () => {
    audioPlayer.pause();
    $(".play").show();
    $(".pause").hide();
    $(".equalizer").addClass("paused");
  };

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  // --- Controls ---
  $(".play").click(() => playTrack());
  $(".pause").click(() => pauseTrack());

  $(".next").click(() => {
    currentTrack = isShuffle ? Math.floor(Math.random() * playlist.length) : (currentTrack + 1) % playlist.length;
    playTrack();
  });

  $(".previous").click(() => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    playTrack();
  });

  $(".shuffle").click(function () {
    $(this).toggleClass("clicked");
    isShuffle = $(this).hasClass("clicked");
  });

  $(".thunderbolt").click(() => $(".thunderbolt").toggleClass("clicked"));
  
  $("#player").hover(
    () => $(".info").addClass("up"),
    () => $(".info").removeClass("up")
  );
// --- ระบบลาก (Draggable) แก้ไขแบบป้องกันการหาย ---
  let isDragging = false;
  let startPos = { x: 0, y: 0 };

  $("#player").on("mousedown", function(e) {
    // ถ้ากดโดนปุ่มควบคุม จะไม่ลาก
    if ($(e.target).closest('.controls, .progress-bar, .volume-slider, .option, .add').length) return;
    
    isDragging = true;
    
    // ตั้งค่าตำแหน่งเริ่มต้นให้เป็น Fixed ทันทีที่เริ่มลาก เพื่อไม่ให้มันกระโดด
    const rect = this.getBoundingClientRect();
    $(this).css({
      position: 'fixed',
      margin: 0,
      left: rect.left + 'px',
      top: rect.top + 'px',
      right: 'auto',
      bottom: 'auto',
      transition: 'none' // ปิด transition ขณะลาก
    });

    startPos.x = e.clientX - rect.left;
    startPos.y = e.clientY - rect.top;
  });

  $(document).on("mousemove", function(e) {
    if (isDragging) {
      let left = e.clientX - startPos.x;
      let top = e.clientY - startPos.y;
      
      $("#player").css({
        left: left + 'px',
        top: top + 'px'
      });
    }
  });

  $(document).on("mouseup", function() {
    if (isDragging) {
      isDragging = false;
      // คืนค่า transition เพื่อให้ hover สวยเหมือนเดิม
      $("#player").css("transition", "all 0.5s ease-in-out");
    }
  });
  // --- ระบบ ปิด/เปิด เครื่องเล่น (Toggle Show-Hide) ---
  
  // --- ระบบ ปิด/เปิด เครื่องเล่น (แก้ไขให้คลิกติดแน่นอน) ---
  $(document).on("click", ".close-player", function(e) {
    e.preventDefault();
    e.stopPropagation(); // กันไม่ให้ระบบลากทำงานซ้อน
    $("#player").fadeOut(200); // ลดตัวเลขจาก 300 เป็น 200 ให้ปิดไวขึ้น
    $("#show-player-btn").fadeIn(200).css("display", "flex");
  });

  $(document).on("click", "#show-player-btn", function() {
    $(this).fadeOut(200);
    $("#player").fadeIn(200);
  });

  // เมื่อกดปุ่มเรียกคืน (ไอคอนเพลง)
  $(document).on("click", "#show-player-btn", function() {
    $(this).fadeOut(300); // ปุ่มเรียกคืนหายไป
    $("#player").fadeIn(300); // เครื่องเล่นเพลงกลับมา
  });
  // --- Progress Bar & Scrubbing ---
  audioPlayer.addEventListener("timeupdate", () => {
    if (!isScrubbing && audioPlayer.duration) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      $(".fill").css("width", `${percent}%`);
      $(".thumb").css("left", `${percent}%`);
      $(".time--current").text(formatTime(audioPlayer.currentTime));
      $(".time--total").text(`-${formatTime(audioPlayer.duration - audioPlayer.currentTime)}`);
    }
  });

  $(".progress-bar").on("mousedown", function (e) {
    isScrubbing = true;
    updateScrubPreview(e);
  });

  $(document).on("mousemove", function (e) {
    if (isScrubbing) updateScrubPreview(e);
  });

  $(document).on("mouseup", function () {
    if (isScrubbing && audioPlayer.duration) {
      audioPlayer.currentTime = scrubPreviewTime;
    }
    isScrubbing = false;
  });

  function updateScrubPreview(e) {
    const bar = $(".progress-bar");
    const offset = bar.offset();
    const width = bar.width();
    const x = e.pageX - offset.left;
    const percent = Math.max(0, Math.min(1, x / width));
    scrubPreviewTime = percent * audioPlayer.duration;
    $(".fill").css("width", `${percent * 100}%`);
    $(".thumb").css("left", `${percent * 100}%`);
    $(".time--current").text(formatTime(scrubPreviewTime));
  }

  // --- Volume ---
  $(".volume-slider").on("input change", function () {
    audioPlayer.volume = $(this).val();
    const icon = $(".volume i");
    if (audioPlayer.volume == 0) icon.attr('class', 'fas fa-volume-mute');
    else if (audioPlayer.volume < 0.5) icon.attr('class', 'fas fa-volume-down');
    else icon.attr('class', 'fas fa-volume-up');
  });

  $(".volume i").on("click", function (e) {
    e.stopPropagation();
    $(".volume").toggleClass("active");
  });

  // --- Playlist Panel ---
  playlist.forEach((song, index) => {
    $(".song-list").append(`<li data-index="${index}">${song.name}</li>`);
  });

  $(".option").click(() => $(".options-panel").stop().slideToggle(200));

  $(".song-list").on("click", "li", function () {
    currentTrack = parseInt($(this).data("index"));
    playTrack();
    $(".options-panel").slideUp();
  });

  // --- Auto Next ---
  audioPlayer.addEventListener("ended", () => $(".next").click());

  // --- Keyboard & Initial UI ---
  $(document).on("keydown", function (e) {
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
      audioPlayer.paused ? playTrack() : pauseTrack();
    }
  });

  // --- ระบบพยายามเล่นอัตโนมัติ (Autoplay Fix) ---
  const autoPlayAttempt = () => {
    updateSongDetails();
    audioPlayer.play().then(() => {
      // ถ้าเล่นได้สำเร็จ
      $(".play").hide();
      $(".pause").show();
      $(".equalizer").removeClass("paused");
    }).catch(error => {
      // ถ้าโดน Browser บล็อก จะรอให้ผู้ใช้คลิกหน้าจอ 1 ครั้งแล้วค่อยเล่น
      console.log("Autoplay blocked. Waiting for user interaction...");
      $(document).one("click", function() {
        playTrack();
      });
    });
  };

  // เรียกใช้งานแทน updateSongDetails(); ของเดิม
  autoPlayAttempt(); 
});
// --- MSQ Player JS End ---
// --- MSQ Player JS End ---
// คลิกที่ปุ่ม X เพื่อปิดหน้าต่างเลือกเพลง
$(document).on("click", ".close-options", function() {
  $(".options-panel").fadeOut(200);
});

// หรือถ้ากดเลือกเพลงแล้ว ก็ให้มันปิดไปด้วยเลย
$(".song-list").on("click", "li", function () {
  $(".options-panel").fadeOut(200);
});
 // แก้ไขอาการขยับเองตอนคลิก (วางต่อท้ายสุดของไฟล์หรือใน $(document).ready)
$("#player").on("mousedown", function() {
    const rect = this.getBoundingClientRect();
    $(this).css({
        "transition": "none",
        "transform": "none",
        "margin": "0",
        "left": rect.left + "px",
        "top": rect.top + "px"
    });
});

$(document).on("mouseup", function() {
    $("#player").css("transition", "all 0.5s ease-in-out");
});
(function() {
    const statNumber = document.querySelector('.stat-number');
    if (!statNumber) return;

    let count = parseInt(statNumber.innerText);

    function increment() {
        // สุ่มเลขเพิ่ม 1-3
        const increase = Math.floor(Math.random() * 3) + 1;
        count += increase;
        
        // ใส่ Class สำหรับเอฟเฟกต์กระตุก
        statNumber.classList.add('updating');
        statNumber.innerText = count.toLocaleString();

        // เอา Class ออกเพื่อให้รอรับการนับครั้งต่อไป
        setTimeout(() => {
            statNumber.classList.remove('updating');
        }, 150);

        // สุ่มเวลาให้นับใหม่ (ยิ่งเลขน้อยยิ่งนับเร็ว)
        const nextTime = Math.floor(Math.random() * 1000) + 1000;
        setTimeout(increment, nextTime);
    }

    setTimeout(increment, 2000);
})();

function hideOverlay() {
    const el = document.getElementById('tap-overlay-full');
    
    // 1. ทำให้การคลิก "ทะลุ" ไปด้านหลังได้ทันที
    el.style.pointerEvents = 'none'; 
    
    // 2. เริ่มการจางหาย
    el.style.opacity = '0';
    
    // 3. ลบทิ้งจากระบบเมื่อจางหายสนิท
    setTimeout(() => {
        el.style.display = 'none';
    }, 600);
}

function typeWriter(id, text, speed = 50) {
    const ele = document.getElementById(id);
    if (!ele || !text) return;
    let i = 0;
    ele.innerHTML = "";
    function type() {
        if (i < text.length) {
            ele.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

async function fetchAndShowCounter() {
    const visitsElement = document.getElementById('visits');
    if (!visitsElement) return;

    try {
        // 1. เรียกใช้ API เพื่อเพิ่มจำนวนและรับค่ากลับมา
        const response = await fetch('https://api.counterapi.dev/v1/antagonist-pariomanias-team-2275/visits/up');
        
        // 2. ตรวจสอบว่าการเชื่อมต่อสำเร็จหรือไม่
        if (response.ok) {
            const data = await response.json();
            
            // 3. ดึงค่าจากฟิลด์ count มาแสดงผลที่ id="visits"
            if (data && data.count !== undefined) {
                visitsElement.innerText = data.count.toLocaleString();
            }
        }
    } catch (error) {
        // หากดึงค่าไม่ได้ (เช่น โดนบล็อก) จะแสดงข้อความแจ้งเตือนเบื้องต้น
        console.error("ไม่สามารถเชื่อมต่อ API ได้:", error);
        visitsElement.innerText = "เปิดBlockAdsทำควยไร"; 
    }
}

// สั่งให้ทำงานทันทีเมื่อหน้าเว็บโหลดเสร็จ
window.addEventListener('load', fetchAndShowCounter);