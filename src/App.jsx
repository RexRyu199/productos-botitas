import { Routes, Route, Link } from 'react-router-dom'
import Navbar         from './components/Navbar'
import Footer          from './components/Footer'
import Breadcrumbs     from './components/Breadcrumbs'
import ProtectedRoute  from './components/ProtectedRoute'
import Home             from './pages/Home'
import Products          from './pages/Products'
import About              from './pages/About'
import Contact              from './pages/Contact'
import Privacy                from './pages/Privacy'
import Login                    from './pages/Login'
import Panel                       from './pages/Panel'
import NotFound                      from './pages/NotFound'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <main>
        <Routes>
          {/* ── Rutas públicas ── */}
          <Route path="/"              element={<Home />}     />
          <Route path="/productos"     element={<Products />} />
          <Route path="/quienes-somos" element={<About />}    />
          <Route path="/contacto"      element={<Contact />}  />
          <Route path="/privacidad"    element={<Privacy />}  />

          {/* ── Login del admin (siempre público, es el punto de entrada) ── */}
          <Route path="/panel/login" element={<Login />} />

          {/* ── Panel protegido: requiere sesión activa en Supabase ── */}
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <Panel />
              </ProtectedRoute>
            }
          />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App