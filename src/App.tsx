import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import SummaryPage from './pages/SummaryPage'

// Vantas pages
import VentasPage from './pages/VentasPage'
import VentasInventarioPage from './pages/VentasInventarioPage'
import VentasProductoPage from './pages/VentasProductoPage'
import VentasTendenciasPage from './pages/VentasTendenciasPage'
import VentasClientesPage from './pages/VentasClientesPage'



import InventarioPage from './pages/InventarioPage'
import LoginPage from './pages/LoginPage'
import InventarioTreemap from './pages/InventarioTreemap'
import CuentasPorCobrarPage from './pages/CuentasPorCobrarPage'
import ConfigurationPage from './pages/ConfigurationPage'

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    if (!isLoggedIn) {
        return <LoginPage onLogin={() => setIsLoggedIn(true)} />
    }

    return (
        <BrowserRouter>
            <div className="flex h-screen overflow-hidden bg-surface-page">
                <Sidebar onLogout={() => setIsLoggedIn(false)} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex flex-col flex-1 min-w-0">
                    <Topbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <Routes>
                            <Route path="/" element={<SummaryPage />} />

                            {/* Ventas Routes */}
                            <Route path="/ventas" element={<VentasPage />} />
                            <Route path="/ventas/productos" element={<VentasProductoPage />} />
                            <Route path="/ventas/clientes" element={<VentasClientesPage />} />
                            <Route path="/ventas/inventario" element={<VentasInventarioPage />} />
                            <Route path="/ventas/tendencias" element={<VentasTendenciasPage />} />

                            {/* Inventario Routes */}
                            <Route path="/inventario" element={<InventarioTreemap />} />
                            <Route path="/inventario/stock" element={<InventarioPage />} />



                            {/* Cuentas Por Cobrar Routes */}
                            <Route path="/cuentas-por-cobrar" element={<CuentasPorCobrarPage />} />

                            <Route path="/configuration" element={<ConfigurationPage />} />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}
