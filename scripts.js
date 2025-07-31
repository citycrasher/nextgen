// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Show loading animation
    const loadingAnimation = document.getElementById('loading-animation');
    
    // Initialize Three.js scene for neural network animation
    initThreeScene();
    
    // Add smooth scrolling for navigation links
    addSmoothScrolling();
    
    // Add hover effects and animations
    addInteractiveEffects();
    
    // Initialize contact form handling
    initContactForm();
    
    // Hide loading animation after everything is loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (loadingAnimation) {
                loadingAnimation.classList.add('hidden');
            }
        }, 500);
    });
    
    // Fallback to hide loading animation if window load event doesn't fire
    setTimeout(function() {
        if (loadingAnimation) {
            loadingAnimation.classList.add('hidden');
        }
    }, 2500);
});

// Three.js Neural Network Animation with Premium Effects
function initThreeScene() {
    const container = document.getElementById('particles-container');
    
    // If container doesn't exist, exit function
    if (!container) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Set renderer properties
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create particles for enhanced neural network effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500; // Increased for more density
    
    // Create positions array for particles
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    
    // Set random positions and colors for particles with enhanced visual effects
    for (let i = 0; i < particlesCount * 3; i += 3) {
        const idx = i / 3;
        // Positions - create more structured distribution for premium look
        if (idx % 3 === 0) {
            // Core cluster particles
            positions[i] = (Math.random() - 0.5) * 8; // x
            positions[i + 1] = (Math.random() - 0.5) * 8; // y
            positions[i + 2] = (Math.random() - 0.5) * 8; // z
        } else if (idx % 3 === 1) {
            // Mid-range particles
            positions[i] = (Math.random() - 0.5) * 12; // x
            positions[i + 1] = (Math.random() - 0.5) * 12; // y
            positions[i + 2] = (Math.random() - 0.5) * 12; // z
        } else {
            // Outer particles
            positions[i] = (Math.random() - 0.5) * 15; // x
            positions[i + 1] = (Math.random() - 0.5) * 15; // y
            positions[i + 2] = (Math.random() - 0.5) * 15; // z
        }
        
        // Varied sizes for depth perception
        sizes[idx] = Math.random() * 0.05 + 0.02;
        
        // Enhanced color palette - more vibrant blues and purples
        const colorChoice = Math.random();
        if (colorChoice < 0.25) {
            colors[i] = 0.376; // #60A5FA - Blue
            colors[i + 1] = 0.647;
            colors[i + 2] = 0.98;
        } else if (colorChoice < 0.5) {
            colors[i] = 0.545; // #8B5CF6 - Purple
            colors[i + 1] = 0.361;
            colors[i + 2] = 0.965;
        } else if (colorChoice < 0.75) {
            colors[i] = 0.2; // Deeper blue
            colors[i + 1] = 0.3;
            colors[i + 2] = 0.9;
        } else {
            colors[i] = 0.7; // Bright purple
            colors[i + 1] = 0.2;
            colors[i + 2] = 0.8;
        }
    }
    
    // Add attributes to geometry
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create custom shader material for particles with glow effect
    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pixelRatio: { value: window.devicePixelRatio }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                // Oscillating size for subtle animation
                float animatedSize = size * (1.0 + 0.2 * sin(time + position.x * 5.0));
                gl_PointSize = animatedSize * pixelRatio * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                // Create circular point with soft edge
                float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                if (r > 0.5) discard;
                // Add glow effect
                float alpha = 1.0 - smoothstep(0.3, 0.5, r);
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true,
        depthWrite: false
    });
    
    // Create points mesh and add to scene
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Create connections between particles (lines) with gradient effect
    const linesMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    const linesGeometry = new THREE.BufferGeometry();
    const linesPositions = [];
    const linesColors = [];
    
    // Connect nearby particles with lines - improved algorithm
    const maxConnections = 3000; // Limit connections for performance
    let connectionCount = 0;
    
    for (let i = 0; i < particlesCount && connectionCount < maxConnections; i++) {
        const p1 = {
            x: positions[i * 3],
            y: positions[i * 3 + 1],
            z: positions[i * 3 + 2]
        };
        
        const c1 = {
            r: colors[i * 3],
            g: colors[i * 3 + 1],
            b: colors[i * 3 + 2]
        };
        
        // Connect to a few nearby particles
        for (let j = i + 1; j < Math.min(i + 6, particlesCount); j++) {
            if (connectionCount >= maxConnections) break;
            
            const p2 = {
                x: positions[j * 3],
                y: positions[j * 3 + 1],
                z: positions[j * 3 + 2]
            };
            
            const c2 = {
                r: colors[j * 3],
                g: colors[j * 3 + 1],
                b: colors[j * 3 + 2]
            };
            
            // Calculate distance
            const distance = Math.sqrt(
                Math.pow(p1.x - p2.x, 2) +
                Math.pow(p1.y - p2.y, 2) +
                Math.pow(p1.z - p2.z, 2)
            );
            
            // Only connect if they're close enough
            if (distance < 2) {
                linesPositions.push(p1.x, p1.y, p1.z);
                linesPositions.push(p2.x, p2.y, p2.z);
                
                // Gradient color for lines
                linesColors.push(c1.r, c1.g, c1.b);
                linesColors.push(c2.r, c2.g, c2.b);
                
                connectionCount++;
            }
        }
    }
    
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linesPositions, 3));
    linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(linesColors, 3));
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lines);
    
    // Position camera
    camera.position.z = 5;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        particlesMaterial.uniforms.pixelRatio.value = window.devicePixelRatio;
    });
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let frame = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update time uniform for particle shader animation
        particlesMaterial.uniforms.time.value = frame * 0.01;
        
        // Smooth mouse following for premium feel
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
        
        particles.rotation.x += (mouseY * 0.01 - particles.rotation.x) * 0.05;
        particles.rotation.y += (mouseX * 0.01 - particles.rotation.y) * 0.05;
        
        // Add subtle oscillation for more organic movement
        particles.position.y = Math.sin(frame * 0.01) * 0.2;
        
        lines.rotation.x = particles.rotation.x;
        lines.rotation.y = particles.rotation.y;
        lines.position.y = particles.position.y;
        
        // Add pulse effect for particles
        const pulseScale = 1 + Math.sin(frame * 0.02) * 0.03;
        particles.scale.set(pulseScale, pulseScale, pulseScale);
        
        frame++;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Return the scene objects for potential external control
    return {
        scene,
        camera,
        renderer,
        particles,
        lines
    };
}

// Add smooth scrolling to navigation links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add interactive effects
function addInteractiveEffects() {
    // Add fade-in animation to sections when they come into view
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('#services .bg-gray-900');
    serviceCards.forEach(card => {
        card.classList.add('hover-glow');
    });
    
    // Add animated underline to navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.add('animated-underline');
    });
    
    // Add premium AI cursor effect (following the mouse with delay)
    const cursor = document.createElement('div');
    cursor.classList.add('ai-cursor');
    cursor.innerHTML = `<img src="./cursor.svg" alt="" width="40" height="40">`;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Add scroll-triggered animations for service cards
    const serviceCardsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate-service-card');
                }, index * 100);
                serviceCardsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    serviceCards.forEach(card => {
        serviceCardsObserver.observe(card);
    });
    
    // Add parallax effect to hero section
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                const particles = document.getElementById('particles-container');
                if (particles) {
                    particles.style.transform = `translateY(${scrollPosition * 0.4}px)`;
                }
            }
        });
    }
}

// Initialize contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const company = document.getElementById('company').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();
        
        // Validate form
        let isValid = true;
        let errorFields = [];
        
        if (name === '') {
            isValid = false;
            errorFields.push('name');
        }
        
        if (email === '' || !isValidEmail(email)) {
            isValid = false;
            errorFields.push('email');
        }
        
        if (message === '') {
            isValid = false;
            errorFields.push('message');
        }
        
        // Highlight error fields
        document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select').forEach(field => {
            field.classList.remove('border-red-500');
        });
        
        errorFields.forEach(fieldId => {
            document.getElementById(fieldId).classList.add('border-red-500');
        });
        
        // If valid, process form
        if (isValid) {
            // In a real implementation, you would send this data to a server
            // For demo purposes, we'll just show a success message
            
            // Create success message
            const formContainer = contactForm.parentElement;
            const successMessage = document.createElement('div');
            successMessage.className = 'bg-green-900/30 border border-green-500 text-green-300 p-4 rounded-md';
            successMessage.innerHTML = `
                <div class="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <h4 class="font-bold">Message Sent Successfully!</h4>
                </div>
                <p>Thank you for contacting us, ${name}. Our team will get back to you shortly.</p>
            `;
            
            // Hide form and show success message
            contactForm.classList.add('hidden');
            formContainer.appendChild(successMessage);
            
            // Reset form for future use
            contactForm.reset();
            
            // After 5 seconds, hide success message and show form again
            setTimeout(() => {
                successMessage.remove();
                contactForm.classList.remove('hidden');
            }, 5000);
        }
    });
    
    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}