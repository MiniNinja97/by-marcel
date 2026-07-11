import {HashRouter as Router, Route, Routes, HashRouter} from 'react-router-dom'
import Header from './header/header'
import Footer from './footer/footer'
import './styles/global.css'
import './App.css'

export default function App() {

  return(
    <HashRouter>
      <Header />
      <main>
      <Routes>
        <Route path="/" element={<div>Hem</div>} />
        <Route path="/products" element={<div>Produkter</div>} />
        <Route path="/about" element={<div>Om oss</div>} />
        <Route path="/contact" element={<div>Kontakt</div>} />
      </Routes>
      </main>
      <Footer />
      
    </HashRouter>  )
}
