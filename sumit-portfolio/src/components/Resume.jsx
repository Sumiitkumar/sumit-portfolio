import React, { useState } from "react";
import { FaDownload, FaEye } from "react-icons/fa";
import { resumeConfig } from "../config/resumeConfig";

const Resume = () => {
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <section
      id="resume"
      className="min-h-screen bg-gray-50 text-black flex flex-col justify-center items-center px-6 py-16"
    >
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Resume</span>
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Download or view my professional resume</p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Download Option */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition duration-300 text-center">
            <FaDownload className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Download PDF</h3>
            <p className="text-gray-600 mb-6">
              Download my resume as a PDF file
            </p>
            <a
              href={resumeConfig.resumeUrl}
              download={resumeConfig.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Download Resume
            </a>
          </div>

          {/* View Online Option */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition duration-300 text-center">
            <FaEye className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-600 mb-3">View Online</h3>
            <p className="text-gray-600 mb-6">
              View my resume directly in your browser
            </p>
            <button
              onClick={() => setShowEmbed(!showEmbed)}
              className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {showEmbed ? "Hide Resume" : "View Resume"}
            </button>
          </div>
        </div>

        {/* Embedded Resume Viewer */}
        {showEmbed && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-12">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Resume Preview</h3>
            <div className="bg-white rounded-lg overflow-hidden" style={{ height: "600px" }}>
              <iframe
                src={resumeConfig.resumeUrl}
                width="100%"
                height="600"
                type="application/pdf"
                className="w-full h-full"
              >
                <p>
                  Your browser does not support PDF preview. Please{" "}
                  <a
                    href={resumeConfig.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#64ffda] hover:underline"
                  >
                    open the resume
                  </a>{" "}
                  instead.
                </p>
              </iframe>
            </div>
          </div>
        )}

        {/* Resume Summary */}
        <div className="mt-12 bg-white p-8 rounded-2xl border border-gray-200">
          <h3 className="text-2xl font-semibold text-blue-600 mb-6">Quick Summary</h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="text-blue-600 font-semibold mb-2">👨‍💼 Professional Title</h4>
              <p>DevOps Engineer | Cloud Architect | Infrastructure Specialist</p>
            </div>
            <div>
              <h4 className="text-blue-600 font-semibold mb-2">📚 Experience</h4>
              <p>4+ years of hands-on experience in DevOps, Cloud Infrastructure, and Automation</p>
            </div>
            <div>
              <h4 className="text-blue-600 font-semibold mb-2">🛠️ Key Skills</h4>
              <p>Kubernetes, Docker, Jenkins, Terraform, AWS, CI/CD, Infrastructure as Code, Container Orchestration</p>
            </div>
            <div>
              <h4 className="text-blue-600 font-semibold mb-2">🎓 Expertise</h4>
              <p>Cloud Platform Management, Microservices Deployment, Monitoring & Logging, Security & Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
