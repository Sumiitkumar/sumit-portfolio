// Configuration file for resume
// Update this file whenever you want to change your resume link or details

export const resumeConfig = {
  // Resume file path or URL
  // Option 1: Local file path (file must be in public folder)
  // resumeUrl: "/sumitkumar.pdf",
  
  // Option 2: External URL (Google Drive, Dropbox, etc.)
  resumeUrl: "https://drive.google.com/file/d/15zPTcB9Xn0C_qMaYirm1LtiPBNsQ-aNh/preview", // Your Google Drive resume
  
  // Option 3: Direct file path
  // resumeUrl: "/sumitkumar[1].pdf",
  
  // Resume file name (for download)
  fileName: "Sumit_Kumar_Resume.pdf",

  // Last updated date
  lastUpdated: "Nov 17, 2025",
};

/*
HOW TO USE:
============

1. LOCAL FILE (Recommended for regular updates):
   - Place your resume in the public folder: /public/
   - Update resumeUrl: "/your-resume-name.pdf"
   - Example: resumeUrl: "/Sumit_Kumar_Resume.pdf"

2. GOOGLE DRIVE (Easy to update):
   - Upload resume to Google Drive
   - Right-click > Get link > Make it shareable
   - Extract FILE_ID from the link
   - Update resumeUrl: "https://drive.google.com/file/d/FILE_ID/preview"
   - Example: https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0/preview

3. DROPBOX:
   - Upload to Dropbox
   - Share the file
   - Add ?dl=1 to the end of the link
   - Update resumeUrl with the Dropbox link

4. UPDATE FREQUENCY:
   - Just change the resumeUrl value here
   - No need to update Hero.jsx or Resume.jsx
   - Changes will reflect immediately in your portfolio
*/
