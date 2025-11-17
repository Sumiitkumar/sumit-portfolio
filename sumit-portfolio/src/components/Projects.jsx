import React from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { SiDocker, SiJenkins, SiKubernetes, SiTerraform, SiAwsamplify } from "react-icons/si";

// Icon mapping for tools
const iconMap = {
  docker: <SiDocker />,
  jenkins: <SiJenkins />,
  kubernetes: <SiKubernetes />,
  terraform: <SiTerraform />,
  aws: <SiAwsamplify />,
};

const Projects = () => {
  // Easy to add more projects - just add objects to this array
  const projectData = [
    {
  id: 1,
  title: "AI Agent Chatbot",
  description:
    "Built an AI-powered agent chatbot capable of understanding user queries, generating intelligent responses, and performing automated tasks. Integrated with modern NLP models and deployed using scalable cloud infrastructure.",
  tools: ["python", "ai", "docker"],
  github: "https://github.com/sumiitkumar/ai-agent-chatbot",
  live: "",
},
    {
      id: 2,
      title: "Kubernetes Deployment on AWS EKS",
      description:
        "Deployed containerized applications on AWS EKS cluster with auto-scaling and monitoring using Prometheus and Grafana. Used Terraform for IaC.",
      tools: ["kubernetes", "terraform", "aws"],
      github: "https://github.com/sumiitkumar/aws-eks-deployment",
      live: "",
    },
    {
      id: 3,
      title: "Infrastructure Automation with Terraform",
      description:
        "Built and managed cloud infrastructure using Terraform on AWS. Automated provisioning of EC2 instances, networking, and security configurations.",
      tools: ["terraform", "aws"],
      github: "https://github.com/sumiitkumar/terraform-infra-automation",
      live: "",
    },
    // Add new projects here
    // {
    //   id: 4,
    //   title: "Project Title",
    //   description: "Project description goes here",
    //   tools: ["docker", "kubernetes"],
    //   github: "https://github.com/sumiitkumar/your-project",
    //   live: "https://your-project-link.com",
    // },
  ];

  return (
    <section
      id="projects"
      className="min-h-screen bg-gray-50 text-black flex flex-col justify-center items-center px-6 py-16"
    >
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Projects</span>
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Showcasing my DevOps and infrastructure projects</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projectData.map((project) => (
            <div
              key={project.id}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 flex flex-col justify-between border border-gray-200"
            >
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-4 text-xl text-gray-600 mb-6 justify-start flex-wrap">
                  {project.tools.map((toolName, idx) => (
                    <span 
                      key={idx} 
                      className="hover:text-[#64ffda] transition"
                      title={toolName}
                    >
                      {iconMap[toolName] || ""}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-start gap-4 mt-auto">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 transition bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <FaGithub /> <span className="text-sm">Code</span>
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 transition bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <FaExternalLinkAlt /> <span className="text-sm">Live</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
