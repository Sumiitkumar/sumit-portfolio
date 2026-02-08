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
      title: "Container & Orchestration",
      color: "from-cyan-600 to-blue-600",
      borderColor: "border-cyan-500/50",
      skills: [
        { name: "Kubernetes", icon: <SiKubernetes className="text-[#326CE5]" /> },
        { name: "Docker", icon: <FaDocker className="text-[#2496ED]" /> },
        { name: "Helm", icon: <SiKubernetes className="text-[#326CE5]" /> },
      ],
    },
    {
      title: "Cloud Platforms",
      color: "from-orange-600 to-red-600",
      borderColor: "border-orange-500/50",
      skills: [
        { name: "AWS", icon: <FaAws className="text-[#FF9900]" /> },
      ],
    },
    {
      title: "Infrastructure as Code",
      color: "from-purple-600 to-pink-600",
      borderColor: "border-purple-500/50",
      skills: [
        { name: "Terraform", icon: <SiTerraform className="text-[#7B42BC]" /> },
        { name: "Ansible", icon: <SiAnsible className="text-[#EE0000]" /> },
        { name: "CloudFormation", icon: <FaAws className="text-[#FF9900]" /> },
      ],
    },
    {
      title: "CI/CD & Automation",
      color: "from-red-600 to-orange-600",
      borderColor: "border-red-500/50",
      skills: [
        { name: "Jenkins", icon: <SiJenkins className="text-[#D33833]" /> },
        { name: "GitHub Actions", icon: <SiGithubactions className="text-[#2088FF]" /> },
        { name: "ArgoCD", icon: <SiGithubactions className="text-[#2088FF]" /> },
      ],
    },
    {
      title: "Monitoring & Observability",
      color: "from-green-600 to-cyan-600",
      borderColor: "border-green-500/50",
      skills: [
        { name: "Prometheus", icon: <SiPrometheus className="text-[#E6522C]" /> },
        { name: "Grafana", icon: <SiGrafana className="text-[#F46800]" /> },
        { name: "ELK Stack", icon: <SiPrometheus className="text-[#E6522C]" /> },
      ],
    },
    {
      title: "Programming & Tools",
      color: "from-blue-600 to-purple-600",
      borderColor: "border-blue-500/50",
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
      className="min-h-screen bg-white text-green-900 flex flex-col items-center px-6 py-16 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-green-700">
            Skills
          </h2>
          <p className="text-green-700 max-w-2xl mx-auto text-lg">
            Expertise in modern DevOps tools, cloud platforms, and containerization technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-1 w-12 mb-4 rounded-full bg-green-400 group-hover:w-24 transition-all duration-300"></div>
              <h3 className="text-xl font-semibold text-green-700 mb-6 group-hover:text-green-600 transition">
                {category.title}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {category.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-green-100 hover:border-green-400 transition-all duration-300 group/skill"
                  >
                    <div className="text-3xl mb-2 group-hover/skill:scale-110 transition-transform duration-300">
                      {skill.icon}
                    </div>
                    <p className="text-xs text-green-700 font-medium text-center group-hover/skill:text-green-600 transition">
                      {skill.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center hover:border-green-400 transition">
            <div className="text-3xl font-bold text-green-600">2+</div>
            <p className="text-green-700 text-sm mt-2">Years Experience</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center hover:border-green-400 transition">
            <div className="text-3xl font-bold text-green-600">15+</div>
            <p className="text-green-700 text-sm mt-2">Tools Mastered</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center hover:border-green-400 transition">
            <div className="text-3xl font-bold text-green-600">10+</div>
            <p className="text-green-700 text-sm mt-2">Projects Deployed</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center hover:border-green-400 transition">
            <div className="text-3xl font-bold text-green-600">Expert</div>
            <p className="text-green-700 text-sm mt-2">Proficiency Level</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
