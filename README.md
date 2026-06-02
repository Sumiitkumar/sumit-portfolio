# Sumit Kumar - Portfolio

A modern, interactive DevOps portfolio built with **React**, **Vite**, and **Tailwind CSS**. Showcasing skills, projects, and experience in cloud infrastructure, CI/CD, and automation.

🌐 **Live Portfolio:** [https://sumit.cloud/](https://sumit.cloud/)

---

## 🎯 Features

✨ **Interactive Elements:**
- Fun "kubectl get sumit" command button in hero section
- Displays professional details when clicked
- Terminal-style interface for a unique user experience

📄 **Resume Integration:**
- Google Drive resume integration
- Easy one-click download
- Browser preview functionality
- Simple configuration for updates

🎨 **Responsive Design:**
- Mobile-friendly layout
- Dark theme with cyan accents
- Smooth animations and transitions
- Beautiful hover effects

📋 **Sections:**
- **Hero** - Introduction with resume and kubectl command
- **About** - Professional summary
- **Skills** - Technical expertise showcase
- **Projects** - Featured DevOps projects with links
- **Resume** - Download and preview options
- **Contact** - Get in touch section
- **Footer** - Additional links and info

---

## 🛠️ Tech Stack

- **Frontend:** React 19.2.0
- **Build Tool:** Vite 7.2.2
- **Styling:** Tailwind CSS 4.1.17
- **Icons:** React Icons 5.5.0
- **Linting:** ESLint 9.39.1
- **Deployment:** GitHub Pages

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Clone the Repository
```bash
git clone https://github.com/Sumiitkumar/sumit-portfolio.git
cd sumit-portfolio/sumit-portfolio
```

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Server runs at: `http://localhost:5173/sumit-portfolio/`

### Build for Production
```bash
npm run build
```
Output files in `dist/` folder

### Preview Production Build
```bash
npm run preview
```

---

## 📝 Configuration

### Update Resume Link

Edit `src/config/resumeConfig.js`:

**Option 1: Google Drive (Recommended)**
```javascript
export const resumeConfig = {
  resumeUrl: "https://drive.google.com/file/d/YOUR_FILE_ID/preview",
  fileName: "Sumit_Kumar_Resume.pdf",
  lastUpdated: "Nov 17, 2025",
};
```

**Option 2: Local File**
```javascript
resumeUrl: "/Sumit_Kumar_Resume.pdf",
```

**Option 3: Dropbox**
```javascript
resumeUrl: "https://www.dropbox.com/s/your-file-id/resume.pdf?dl=1",
```

### Update Personal Details

Edit components for personal customization:
- `src/components/Hero.jsx` - Header and introduction
- `src/components/About.jsx` - About section
- `src/components/Projects.jsx` - Project listings
- `src/components/Skills.jsx` - Technical skills
- `src/components/Contact.jsx` - Contact information

---

## 🚀 Deployment to GitHub Pages

### Build and Deploy
```bash
# Build the project
npm run build

# Copy build to gh-pages directory
cp -r dist/* ../gh-pages/

# Push to gh-pages branch
cd ../gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### Enable GitHub Pages
1. Go to repository Settings
2. Navigate to "Pages" section
3. Set source to `gh-pages` branch
4. Save

Your portfolio will be live at: `https://YOUR_USERNAME.github.io/sumit-portfolio/`

---

## 📂 Project Structure

```
sumit-portfolio/
├── public/                 # Static files
│   ├── Sumitkumar[1].pdf  # Resume file
│   └── resume.pdf          # Resume backup
├── src/
│   ├── components/         # React components
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Projects.jsx
│   │   ├── Resume.jsx
│   │   └── Skills.jsx
│   ├── config/
│   │   └── resumeConfig.js # Resume configuration
│   ├── assets/             # Images and media
│   ├── App.jsx            # Main app component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── dist/                  # Production build
├── package.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── README.md
```

---

## 🎨 Customization

### Colors
Primary colors are defined in Tailwind config:
- Primary: `#64ffda` (Cyan)
- Background: `#0a192f` (Dark Blue)
- Secondary: `#112240` (Navy)

Edit `tailwind.config.js` to customize colors.

### Adding Projects
Edit `src/components/Projects.jsx` and add to `projectData` array:

```javascript
{
  id: 4,
  title: "Your Project Title",
  description: "Project description",
  tools: ["docker", "kubernetes"],
  github: "https://github.com/username/project",
  live: "https://project-link.com",
}
```

### Adding Skills
Edit `src/components/Skills.jsx` to add new skills and categories.

---

## 📱 Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📧 Contact

- **Email:** sumit@example.com
- **GitHub:** [Sumiitkumar](https://github.com/sumiitkumar)
- **LinkedIn:** [Sumit Kumar](https://linkedin.com/in/sumiitkumar)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)

---

## 🚀 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Blog section
- [ ] Testimonials section
- [ ] Animation improvements
- [ ] Multi-language support
- [ ] Search functionality

---

**Last Updated:** November 17, 2025

Feel free to fork this project and customize it for your own portfolio! 💡
