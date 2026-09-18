import { HashRouter, Route, Routes } from "react-router-dom";

import Header from "./header/header";
import Footer from "./footer/footer";

import Home from "./pages/home/home";
import About from "./pages/about/about";
import EnamelInfo from "./pages/about/boxes/enamelInfo";
import Products from "./pages/products/products";
import Contact from "./pages/contact/contact";
import Product from "./pages/product_card/product_card";
import Cart from "./pages/cart/cart";
import Payment from "./pages/payment/payment";
import PaymentSuccess from "./pages/paymentSuccess/paymentSuccess";

import PrivacyPolicy from "./pages/privacy_policy/privacy_policy";
import PurchaseTerms from "./pages/purchase_terms/purchase_terms";
import ShippingReturns from "./pages/shipping_returns/shipping_returns";

import AdminRoute from "./pages/admin/adminRoute";

import "./styles/global.css";
import "./App.css";

export default function App() {
  return (
    <HashRouter>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/produkter" element={<Products />} />

          <Route path="/produkt/:id" element={<Product />} />

          <Route path="/produkter/:kategori" element={<Products />} />

          <Route
            path="/produkter/:kategori/:produkttyp"
            element={<Products />}
          />

          <Route
            path="/produkter/:kategori/:produkttyp/:underkategori"
            element={<Products />}
          />

          <Route path="/about" element={<About />} />
          <Route path="/akta-emalj" element={<EnamelInfo />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/korg" element={<Cart />} />

          <Route path="/admin" element={<AdminRoute />} />

          <Route path="/payment" element={<Payment />} />

          <Route path="/betalning-klar" element={<PaymentSuccess />} />

          <Route path="/integritetspolicy" element={<PrivacyPolicy />} />

          <Route path="/kopevillkor" element={<PurchaseTerms />} />

          <Route
            path="/leverans-retur-reklamation"
            element={<ShippingReturns />}
          />
        </Routes>
      </main>

      <Footer />
    </HashRouter>
  );
}
