/**
 * App.jsx
 * Root application with React Router.
 * Route "/" → Home (all sections)
 * Route "/projects/:slug" → ProjectDetail case study page
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/ui/ScrollProgress'
import CustomCursor from './components/ui/CustomCursor'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'

const App = () => (
  <BrowserRouter>
    <CustomCursor />
    <ScrollProgress />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
    </Routes>
    <Footer />
  </BrowserRouter>
)

export default App
