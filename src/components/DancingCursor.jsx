import { useEffect } from 'react';

function DancingCursor() {
  useEffect(() => {
    const particles = [];
    const maxParticles = 10;
    let mouseX = 0;
    let mouseY = 0;

    const container = document.createElement('div');
    container.id = 'dancing-cursor-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(container);

    const createParticle = () => {
      if (particles.length >= maxParticles) {
        const old = particles.shift();
        if (old.element && old.element.parentNode) {
          old.element.parentNode.removeChild(old.element);
        }
      }

      const particle = document.createElement('div');
      const size = Math.random() * 8 + 4;
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;

      particle.style.cssText = `
        position: fixed;
        left: ${mouseX}px;
        top: ${mouseY}px;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.7;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 ${size}px rgba(102, 126, 234, 0.6);
      `;

      container.appendChild(particle);

      particles.push({
        element: particle,
        x: mouseX + offsetX,
        y: mouseY + offsetY,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        decay: Math.random() * 0.02 + 0.015,
      });
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      createParticle();
    };

    const animate = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.life <= 0) {
          p.element.remove();
          particles.splice(i, 1);
          continue;
        }

        p.vx += (Math.random() - 0.5) * 0.4;
        p.vy += (Math.random() - 0.5) * 0.4;
        p.vy += 0.15;

        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        p.element.style.left = p.x + 'px';
        p.element.style.top = p.y + 'px';
        p.element.style.opacity = p.life * 0.7;
      }

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  return null;
}

export default DancingCursor;
