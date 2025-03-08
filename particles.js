class ParticlesAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.colors = ['#6d28d9', '#4f46e5', '#38bdf8'];
        
        this.init();
        this.animate();
    }

    init() {
        this.canvas.classList.add('particles-canvas');
        document.querySelector('.hero-background').appendChild(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                alpha: Math.random() * 0.5 + 0.5
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
            this.ctx.fill();

            // Draw connections
            this.particles.forEach(otherParticle => {
                const distance = Math.hypot(particle.x - otherParticle.x, particle.y - otherParticle.y);
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `${particle.color}${Math.floor((1 - distance / 100) * 50).toString(16).padStart(2, '0')}`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });
    }

    update() {
        this.particles.forEach(particle => {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.velocity.x *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.velocity.y *= -1;

            particle.alpha = Math.sin(Date.now() * 0.001) * 0.2 + 0.8;
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles animation
document.addEventListener('DOMContentLoaded', () => {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        new ParticlesAnimation();
    }
}); 