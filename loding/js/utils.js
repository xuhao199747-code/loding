const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const randomRange = (min, max) => Math.random() * (max - min) + min;

function drawRoundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function drawDiamond(ctx, x, y, w, h) {
    const cx = x + w / 2, cy = y + h / 2;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + w, cy);
    ctx.lineTo(cx, y + h);
    ctx.lineTo(x, cy);
    ctx.closePath();
}

class ParticleSystem {
    constructor(count, width, height) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: randomRange(0, width),
                y: randomRange(0, height),
                vx: randomRange(-1, 1),
                vy: randomRange(-1, 1),
                phase: randomRange(0, Math.PI * 2),
                size: randomRange(3, 6)
            });
        }
    }
    update(time, width, height, pattern) {
        this.particles.forEach((p, i) => {
            if (pattern === 'wave') {
                const cx = width / 2, cy = height / 2;
                const dx = p.x - cx, dy = p.y - cy;
                const d = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) + 0.02;
                const targetR = 50 + Math.sin(time + p.phase) * 30;
                p.x = cx + Math.cos(angle) * Math.min(d, targetR + i * 10);
                p.y = cy + Math.sin(angle) * Math.min(d, targetR + i * 10);
            } else {
                p.vx += randomRange(-0.1, 0.1);
                p.vy += randomRange(-0.1, 0.1);
                p.vx *= 0.98;
                p.vy *= 0.98;
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            }
        });
    }
    draw(ctx, color, glowColor, glowIntensity, connectionDist, cOpacity = 1, gOpacity = 1) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        if (connectionDist > 0) {
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.12 * cOpacity})`;
            ctx.lineWidth = 1;
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const d = Math.sqrt((this.particles[i].x - this.particles[j].x)**2 + (this.particles[i].y - this.particles[j].y)**2);
                    if (d < connectionDist) {
                        ctx.globalAlpha = (1 - d / connectionDist) * 0.25 * cOpacity;
                        ctx.beginPath();
                        ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
        }
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = cOpacity;
            if (glowIntensity > 0) {
                const gr2 = parseInt((glowColor || color).slice(1, 3), 16);
                const gg2 = parseInt((glowColor || color).slice(3, 5), 16);
                const gb2 = parseInt((glowColor || color).slice(5, 7), 16);
                ctx.shadowColor = `rgba(${gr2}, ${gg2}, ${gb2}, ${gOpacity})`;
                ctx.shadowBlur = glowIntensity * 0.5;
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
}
