import React from "react";
import {
  FaAws,
  FaDocker,
  FaLinux,
  FaPython,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiKubernetes,
  SiTerraform,
  SiAnsible,
  SiJenkins,
  SiGithubactions,
  SiPrometheus,
  SiGrafana,
} from "react-icons/si";

const Skills = () => {
  const skillCategories = [
    {
      title: "Cloud & Containerization",
      skills: [
        { name: "AWS", icon: <FaAws className="text-[#FF9900]" /> },
        { name: "Docker", icon: <FaDocker className="text-[#2496ED]" /> },
        { name: "Kubernetes", icon: <SiKubernetes className="text-[#326CE5]" /> },
      ],
    },
    {
      title: " Infrastructure as Code & Automation",
      skills: [
        { name: "Terraform", icon: <SiTerraform className="text-[#7B42BC]" /> },
        { name: "Ansible", icon: <SiAnsible className="text-[#EE0000]" /> },
      ],
    },
    {
      title: "CI/CD & Monitoring",
      skills: [
        { name: "Jenkins", icon: <SiJenkins className="text-[#D33833]" /> },
        { name: "GitHub Actions", icon: <SiGithubactions className="text-[#2088FF]" /> },
        { name: "Prometheus", icon: <SiPrometheus className="text-[#E6522C]" /> },
        { name: "Grafana", icon: <SiGrafana className="text-[#F46800]" /> },
      ],
    },
    {
      title: "Programming & Version Control",
      skills: [
        { name: "Python", icon: <FaPython className="text-[#3776AB]" /> },
        { name: "Linux", icon: <FaLinux className="text-[#FCC624]" /> },
        { name: "Git", icon: <FaGitAlt className="text-[#F1502F]" /> },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="min-h-screen bg-white text-black flex flex-col items-center px-6 py-16"
    >
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Skills</span>
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Expertise in modern DevOps tools and technologies</p>

        <div className="grid md:grid-cols-2 gap-12">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300 border border-blue-100"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-8">
                {category.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center">
                {category.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center hover:scale-105 transition duration-200"
                  >
                    <div className="text-4xl mb-2">{skill.icon}</div>
                    <p className="text-sm font-medium text-gray-400">{skill.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
