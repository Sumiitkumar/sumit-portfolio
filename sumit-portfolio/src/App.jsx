


import About from "./components/About"
import Blog from "./components/Blog"
import Contact from "./components/Contact"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



const App = () => (
  <Router basename="/">
    <Navbar />
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </>
        }
      />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  </Router>
);

export default App;