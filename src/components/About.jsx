import React from 'react';
import './About.css';

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>I'm a passionate full-stack developer with 5+ years of experience building web applications and DevOps solutions. I specialize in cloud infrastructure, containerization, and CI/CD pipelines.</p>
            <p>My journey in tech started with web development, and I've evolved to focus on scalable infrastructure and DevOps practices. I love solving complex problems and mentoring junior developers.</p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Exp</span>
              </div>
              <div className="stat">
                <span className="stat-number">30+</span>
                <span className="stat-label">Clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
