import React, { useState } from "react";
import { resumeConfig } from "../config/resumeConfig";

const Hero = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center bg-white text-black px-6 py-20"
    >
      <div className="max-w-4xl w-full">
        <div className="mb-12">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-4 leading-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Sumit</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-600 mb-6">
            DevOps Engineer & Cloud Architect
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">
            Building scalable, automated systems that power modern applications. 
            Specializing in Kubernetes, CI/CD, and cloud infrastructure with a passion for DevOps excellence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-12 flex gap-4 flex-wrap">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-300"
          >
            $ kubectl get sumit
          </button>
          
          <a
            href={resumeConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Download Resume
          </a>
        </div>

        {/* kubectl Details Box */}
        {showDetails && (
          <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200 rounded-2xl shadow-lg">
            <div className="font-mono text-sm text-gray-800 space-y-3">
              <div className="text-blue-600 font-semibold">NAME                    STATUS    EXPERIENCE</div>
              <div>sumit-kumar             Ready     2+ Years in DevOps</div>
              <div className="text-gray-600">sumit-kubernetes        Ready     Expert Level</div>
              <div className="text-gray-600">sumit-aws               Ready     Multi-Cloud Certified</div>
              <div className="text-gray-600">sumit-cicd              Ready     Pipeline Architect</div>
              <div className="mt-6 text-gray-700">
                <p><span className="text-blue-600 font-semibold">Skills:</span> Kubernetes, Docker, Terraform, AWS, CI/CD, Jenkins, GitLab, Prometheus</p>
                <p className="mt-2"><span className="text-blue-600 font-semibold">Location:</span> India | <span className="text-blue-600 font-semibold">Status:</span> Open to Opportunities</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
