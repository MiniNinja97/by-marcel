import {HashRouter, Router, Route, Routes} from 'react-router-dom'
import Header from './header/header'
import Footer from './footer/footer'
import Home from './pages/home/home'
import About from './pages/about/about'
import Products from './pages/products/products'
import Contact from './pages/contact/contact'

import './styles/global.css'
import './App.css'

export default function App() {

  return(
    <HashRouter>
      <Header />
      <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produkter" element={<Products />} />
<Route path="/produkter/:kategori" element={<Products />} />
<Route path="/produkter/:kategori/:underkategori" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact/>} />
      </Routes>
      </main>
      <Footer />
      
    </HashRouter>  )
}
