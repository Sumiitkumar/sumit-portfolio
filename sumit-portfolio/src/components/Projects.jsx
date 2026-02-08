import React from "react";
import { FaGithub, FaExternalLinkAlt, FaCheckCircle, FaAws } from "react-icons/fa";
import { SiDocker, SiJenkins, SiKubernetes, SiTerraform } from "react-icons/si";

const Projects = () => {
  const projectData = [
    {
      id: 1,
      title: "AI Agent Chatbot",
      description:
        "Built an AI-powered agent chatbot with NLP capabilities. Containerized with Docker and deployed on scalable cloud infrastructure for high availability.",
      tools: ["python", "docker"],
      github: "https://github.com/sumiitkumar/ai-agent-chatbot",
      live: "",
      status: "completed",
    },
    {
      id: 2,
      title: "Kubernetes Deployment on AWS EKS",
      description:
        "Orchestrated containerized microservices on AWS EKS. Configured auto-scaling, monitoring with Prometheus & Grafana, and infrastructure with Terraform.",
      tools: ["kubernetes", "terraform", "aws"],
      github: "https://github.com/sumiitkumar/aws-eks-deployment",
      live: "",
      status: "completed",
    },
    {
      id: 3,
      title: "Infrastructure Automation with Terraform",
      description:
        "Automated AWS infrastructure provisioning including EC2, networking, security groups, and RDS databases using Infrastructure as Code principles.",
      tools: ["terraform", "aws"],
      github: "https://github.com/sumiitkumar/terraform-infra-automation",
      live: "",
      status: "completed",
    },
  ];

  const toolIcons = {
    docker: <SiDocker className="text-[#2496ED]" />,
    jenkins: <SiJenkins className="text-[#D33833]" />,
    kubernetes: <SiKubernetes className="text-[#326CE5]" />,
    terraform: <SiTerraform className="text-[#7B42BC]" />,
    aws: <FaAws className="text-[#FF9900]" />,
    python: "🐍",
  };

  return (
    <section
      id="projects"
      className="min-h-screen bg-white text-green-900 flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-green-700">
            Projects
          </h2>
          <p className="text-green-700 max-w-2xl mx-auto text-lg">
            Production-ready DevOps implementations and cloud infrastructure projects
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectData.map((project) => (
            <div
              key={project.id}
              className="bg-green-50 border border-green-200 rounded-lg overflow-hidden hover:border-green-400 transition-all duration-300 hover:shadow-lg group flex flex-col"
            >
              {/* Header */}
              <div className="bg-green-100 px-6 py-4 border-b border-green-200">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-green-700 flex-1">
                    {project.title}
                  </h3>
                  <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-green-800 mb-6 text-sm leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Tools */}
                <div className="mb-6 pb-6 border-b border-green-100">
                  <p className="text-xs text-green-600 font-semibold mb-3 uppercase tracking-wider">Technologies</p>
                  <div className="flex gap-3 flex-wrap">
                    {project.tools.map((toolName, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1 bg-white border border-green-100 rounded-md hover:border-green-400 transition"
                        title={toolName}
                      >
                        <span className="text-lg">
                          {typeof toolIcons[toolName] === "string" ? toolIcons[toolName] : toolIcons[toolName]}
                        </span>
                        <span className="text-xs text-green-700 capitalize">{toolName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 text-green-700 hover:text-green-900 transition bg-white border border-green-100 hover:border-green-400 px-4 py-2 rounded-lg hover:bg-green-50 font-medium text-sm"
                    >
                      <FaGithub /> Code
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 text-green-700 hover:text-green-900 transition bg-white border border-green-100 hover:border-green-400 px-4 py-2 rounded-lg hover:bg-green-50 font-medium text-sm"
                    >
                      <FaExternalLinkAlt /> Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
