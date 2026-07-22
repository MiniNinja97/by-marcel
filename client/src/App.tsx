import {HashRouter as Router, Route, Routes, HashRouter} from 'react-router-dom'
import Header from './header/header'
import Footer from './footer/footer'
import Home from './pages/home/home'
import About from './pages/about/about'
import Products from './pages/products/products'

import './styles/global.css'
import './App.css'

export default function App() {

  return(
    <HashRouter>
      <Header />
      <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
<Route path="/products/:kategori" element={<Products />} />
<Route path="/products/:kategori/:underkategori" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<div>Kontakt</div>} />
      </Routes>
      </main>
      <Footer />
      
    </HashRouter>  )
}
