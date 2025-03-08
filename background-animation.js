class ParticlesAnimation {
    constructor(selector) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = {
            x: 0,
            y: 0
        };
        
        // Find the container element
        this.container = document.querySelector(selector);
        if (!this.container) {
            console.error(`Container element "${selector}" not found`);
            return;
        }
        
        // Append canvas to container
        this.container.appendChild(this.canvas);
        
        // Set canvas size
        this.resizeCanvas();
        
        // Create particles
        this.createParticles();
        
        // Start animation
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => this.trackMouse(e));
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        
        // Recreate particles when canvas is resized
        this.createParticles();
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                directionChangeTime: 0
            });
        }
    }
    
    trackMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Update particle position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Change direction randomly
            if (Math.random() < 0.01) {
                particle.speedX = Math.random() * 2 - 1;
                particle.speedY = Math.random() * 2 - 1;
            }
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Draw connections
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 500})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });
    }
    
    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles on all hero backgrounds when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const heroBackgrounds = document.querySelectorAll('.hero-background');
    
    heroBackgrounds.forEach(background => {
        new ParticlesAnimation('.hero-background');
    });
}); 