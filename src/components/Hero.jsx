import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Hi, I'm <span className="highlight">Sumit</span></h1>
        <p className="hero-subtitle">Full Stack Developer & DevOps Engineer</p>
        <p className="hero-description">
          Building scalable infrastructure, cloud architectures, and modern web applications. 
          Passionate about DevOps, Kubernetes, and automation.
        </p>
        <div className="hero-buttons">
          <a href="#projects" className="btn btn-primary">View My Work</a>
          <a href="#contact" className="btn btn-secondary">Get In Touch</a>
        </div>
      </div>
      <div className="hero-image">
        <div className="avatar"></div>
      </div>
    </section>
  );
}

export default Hero;
