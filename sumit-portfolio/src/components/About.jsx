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
              src="https://res.cloudinary.com/dlcj09ujl/image/upload/v1762855596/WhatsApp_Image_2025-11-11_at_15.23.35_2cdd1928_n2qddq.jpg"
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

          <p>
  Hello! I’m <span className="text-[#64ffda] font-semibold">Sumit Kumar</span>, a
  <strong> DevOps Engineer</strong> who enjoys automating workflows, building CI/CD
  pipelines, and deploying scalable cloud infrastructure.
</p>

<p className="text-gray-400 mb-6 leading-relaxed">
  I hold a <strong>BCA</strong> and <strong>MCA</strong> from Jain University and
  currently focus on Kubernetes, Terraform, and AWS to create reliable and efficient systems.
</p>

<p className="text-gray-400 leading-relaxed">
  Outside of work, I enjoy solving problems and exploring new DevOps tools—always learning,
  always improving.
</p>

        </div>
      </div>
    </section>
  );
};

export default About;
