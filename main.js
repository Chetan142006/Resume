/**
 * ===================================================================
 * S Y N A P S E — Neural Interface Logic
 * ===================================================================
 */

// ════════════════════════════════════════
// 1. NEURAL CANVAS (Particle Network)
// ════════════════════════════════════════
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

// Particle configuration
const config = {
  particleCount: 100, // Will be adjusted based on screen size
  baseRadius: 1.5,
  connectionDistance: 120,
  baseColor: 'rgba(0, 229, 255, 0.5)',
  pulseColor: 'rgba(124, 77, 255, 0.8)',
  lineColor: 'rgba(0, 229, 255, 0.1)',
  mouseLineColor: 'rgba(0, 229, 255, 0.4)'
};

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  // Adjust particle count for mobile
  config.particleCount = width < 768 ? 50 : 100;
  initParticles();
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.radius = Math.random() * config.baseRadius + 0.5;
  }

  update() {
    // Movement
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Mouse interaction (repel slightly)
    if (mouse.x != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (mouse.radius - distance) / mouse.radius;
        this.vx -= forceDirectionX * force * 0.05;
        this.vy -= forceDirectionY * force * 0.05;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // Glow when near mouse
    let isNearMouse = false;
    if (mouse.x != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      if (dx*dx + dy*dy < mouse.radius * mouse.radius) isNearMouse = true;
    }
    ctx.fillStyle = isNearMouse ? config.pulseColor : config.baseColor;
    if (isNearMouse) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = config.pulseColor;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < config.particleCount; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    
    // Draw connections
    for (let j = i; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < config.connectionDistance) {
        ctx.beginPath();
        let opacity = 1 - (distance / config.connectionDistance);
        
        // Determine line color (stronger near mouse)
        let isNearMouse = false;
        if (mouse.x != null) {
          let mdx1 = mouse.x - particles[i].x;
          let mdy1 = mouse.y - particles[i].y;
          let mDist1 = Math.sqrt(mdx1*mdx1 + mdy1*mdy1);
          if (mDist1 < mouse.radius) isNearMouse = true;
        }

        ctx.strokeStyle = isNearMouse ? `rgba(0, 229, 255, ${opacity * 0.6})` : `rgba(0, 229, 255, ${opacity * 0.15})`;
        ctx.lineWidth = isNearMouse ? 1.5 : 0.8;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}

// Canvas events
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

// Init Canvas
resize();
animateParticles();

// ════════════════════════════════════════
// 2. HERO TYPING EFFECT
// ════════════════════════════════════════
const heroName = document.getElementById('heroName');
const heroRole = document.getElementById('heroRole');
const nameText = "Chetan Sai Goli";
const roleText = "> AI & Data Science Student // B.Tech @ LBRCE";

function typeText(element, text, speed, callback) {
  let i = 0;
  element.innerHTML = '<span class="cursor"></span>';
  let cursor = element.querySelector('.cursor');
  
  function type() {
    if (i < text.length) {
      let node = document.createTextNode(text.charAt(i));
      element.insertBefore(node, cursor);
      i++;
      setTimeout(type, speed);
    } else {
      if (callback) callback();
    }
  }
  
  // Start after small delay
  setTimeout(type, 500);
}

window.addEventListener('load', () => {
  typeText(heroName, nameText, 80, () => {
    // Remove name cursor, start role typing
    heroName.querySelector('.cursor').style.display = 'none';
    typeText(heroRole, roleText, 40);
  });
});

// ════════════════════════════════════════
// 3. SCROLL REVEALS & ACTIVE NAV
// ════════════════════════════════════════
const revealElements = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
const sections = document.querySelectorAll('section');

function handleScroll() {
  const currentScroll = window.scrollY;
  const viewportHeight = window.innerHeight;

  // Reveal elements
  revealElements.forEach(el => {
    const elTop = el.getBoundingClientRect().top;
    if (elTop < viewportHeight * 0.85) {
      el.classList.add('visible');
      
      // Animate stat rings if visible
      if (el.classList.contains('about-stats')) {
        const rings = document.querySelectorAll('.stat-ring-fill');
        rings.forEach(ring => {
          const percent = ring.getAttribute('data-percent');
          const circumference = 2 * Math.PI * 52; // r=52
          const offset = circumference - (percent / 100) * circumference;
          ring.style.strokeDashoffset = offset;
        });
      }
    }
  });

  // Active Nav
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (currentScroll >= (sectionTop - 200)) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleScroll);
// Trigger once on load
setTimeout(handleScroll, 100);

// ════════════════════════════════════════
// 4. MOBILE MENU
// ════════════════════════════════════════
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// ════════════════════════════════════════
// 5. EASTER EGG TERMINAL
// ════════════════════════════════════════
const terminal = document.getElementById('easterTerminal');
const input = document.getElementById('easterInput');
const body = document.getElementById('easterBody');
const closeBtn = document.getElementById('easterClose');

// Keybinding Ctrl+Shift+K
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    terminal.classList.toggle('open');
    if (terminal.classList.contains('open')) {
      input.focus();
    }
  }
});

closeBtn.addEventListener('click', () => {
  terminal.classList.remove('open');
});

function printLine(text, isCommand = false, isHtml = false) {
  const line = document.createElement('div');
  line.className = 't-line';
  if (isCommand) {
    line.innerHTML = `<span class="t-prompt">$</span> ${text}`;
  } else if (isHtml) {
    line.innerHTML = text;
  } else {
    line.textContent = text;
  }
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

const commands = {
  help: `Available commands: 
  <span class="t-synapse">about</span>    - system identity
  <span class="t-synapse">skills</span>   - list capabilities
  <span class="t-synapse">sudo</span>     - gain root access
  <span class="t-synapse">clear</span>    - clear terminal
  <span class="t-synapse">exit</span>     - close terminal`,
  about: "Identity: Chetan Sai Goli.<br>Status: ONLINE.<br>Directives: Build AI systems, analyze data, deploy to cloud.",
  skills: "Python, Java, TensorFlow, Keras, AWS, Git. View UI for full schematic.",
  sudo: "<span class='t-error'>Access Denied. Incident logged.</span> Nice try.",
  exit: "Closing connection..."
};

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = input.value.trim().toLowerCase();
    if (!val) return;
    
    printLine(val, true);
    input.value = '';

    if (val === 'clear') {
      body.innerHTML = '';
      return;
    }

    if (commands[val]) {
      printLine(commands[val], false, true);
      if (val === 'exit') {
        setTimeout(() => terminal.classList.remove('open'), 800);
      }
    } else {
      printLine(`Command not found: ${val}. Type 'help' for available commands.`);
    }
  }
});
