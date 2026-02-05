import React from 'react';
import './Skills.css';

function Skills() {
  const skillCategories = [
    {
      title: 'DevOps & Infrastructure',
      skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Prometheus'],
    },
    {
      title: 'Backend Development',
      skills: ['Node.js', 'Python', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs'],
    },
    {
      title: 'Frontend Development',
      skills: ['React', 'Vue.js', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Responsive Design'],
    },
    {
      title: 'Tools & Platforms',
      skills: ['Git', 'GitLab CI', 'Jenkins', 'GitHub Actions', 'Linux', 'GCP'],
    },
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">Skills & Expertise</h2>
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-category">
              <h3>{category.title}</h3>
              <div className="skill-items">
                {category.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-item">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
