import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen bg-[#112240] text-gray-300 flex flex-col justify-center items-center px-6 py-16"
    >
      <div className="max-w-5xl mx-auto text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Image or Illustration */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-60 h-60 rounded-full overflow-hidden border-4 border-[#64ffda] shadow-[0_0_40px_-10px_#64ffda]">
            <img
              src="https://avatars.githubusercontent.com/u/yourgithubusername"
              alt="Sumit Kumar"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            About <span className="text-[#64ffda]">Me</span>
          </h2>

          <p className="text-gray-400 mb-6 leading-relaxed">
            Hello! I’m <span className="text-[#64ffda] font-semibold">Sumit Kumar</span>,
            a passionate <strong>DevOps Engineer</strong> who loves automating workflows,
            deploying cloud infrastructure, and creating efficient CI/CD pipelines.  
            My journey started with a curiosity for how software runs behind the scenes,
            which led me to explore cloud technologies and DevOps practices.
          </p>

          <p className="text-gray-400 mb-6 leading-relaxed">
            I hold a <strong>BCA</strong> and <strong>MCA</strong> from Jain University,
            where I developed a strong foundation in software development and cloud systems.
            My current focus is on container orchestration with
            <span className="text-[#64ffda]"> Kubernetes</span>, automating deployments with
            <span className="text-[#64ffda]"> Terraform</span>, and optimizing infrastructure
            in <span className="text-[#64ffda]">AWS</span>.
          </p>

          <p className="text-gray-400 leading-relaxed">
            Outside of tech, I enjoy problem-solving, reading about system design,
            and experimenting with new DevOps tools.  
            I believe in continuous learning and improving systems — one script at a time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
