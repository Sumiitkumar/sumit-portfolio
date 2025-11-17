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
      className="min-h-screen bg-[#112240] text-gray-300 flex flex-col justify-center items-center px-6 py-16"
    >
      <div className="max-w-6xl w-full text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          Featured <span className="text-[#64ffda]">Projects</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projectData.map((project) => (
            <div
              key={project.id}
              className="bg-[#0a192f] p-6 rounded-lg shadow-lg hover:shadow-[0_0_20px_-5px_#64ffda] transition duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-[#64ffda] mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-4 text-xl text-gray-400 mb-6 justify-center sm:justify-start flex-wrap">
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

              <div className="flex justify-center sm:justify-start gap-4 mt-auto">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-[#64ffda] transition"
                  >
                    <FaGithub /> <span className="text-sm">Code</span>
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-[#64ffda] transition"
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
