import About from "./components/About"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Projects from "./components/Projects"
import Resume from "./components/Resume"
import Skills from "./components/Skills"


const App = ()=>{
  return(
    <>
    <Navbar/>
    <Hero/>
    <About/>
    <Skills/>
    <Projects/>
    <Resume/>
    <Contact/>
    <Footer />
    
    
    </>
  )
}

export default App