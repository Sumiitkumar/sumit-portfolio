import React from 'react';
import './Projects.css';

function Projects() {
  const projects = [
    {
      id: 1,
      title: 'Infrastructure Monitoring System',
      description: 'Real-time monitoring and alerting with Prometheus & Grafana. Enterprise-grade platform with automated alerts.',
      tags: ['Prometheus', 'Grafana', 'Docker', 'Kubernetes'],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 2,
      title: 'Kubernetes Infrastructure',
      description: 'Multi-cluster Kubernetes setup with GitOps CI/CD. Designed for containerized microservices with automated deployments.',
      tags: ['Kubernetes', 'Docker', 'Terraform', 'GitOps'],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 3,
      title: 'Multi-Cloud CI/CD Pipeline',
      description: 'Automated deployment across AWS, GCP, and Azure. Comprehensive pipeline with testing, building, and deployment automation.',
      tags: ['Jenkins', 'Terraform', 'Docker', 'AWS'],
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image" style={{ background: project.gradient }}></div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                <button className="project-link">View Project →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
