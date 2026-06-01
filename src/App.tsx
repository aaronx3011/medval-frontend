import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import SummaryPage from './pages/SummaryPage'

import VentasPage from './pages/VentasPage'
import VentasInventarioPage from './pages/VentasInventarioPage'
import VentasProductoPage from './pages/VentasProductoPage'
import VentasTendenciasPage from './pages/VentasTendenciasPage'
import VentasClientesPage from './pages/VentasClientesPage'

import InventarioPage from './pages/InventarioPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUp'
import InventarioTreemap from './pages/InventarioTreemap'
import CuentasPorCobrarPage from './pages/CuentasPorCobrarPage'
import ConfigurationPage from './pages/ConfigurationPage'
import UserManagementPage from './pages/UserManagementPage'
import PatchNotesPage from './pages/PatchNotesPage'
import IssueReportsPage from './pages/IssueReportsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page">
        <div className="animate-spin w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page">
        <div className="animate-spin w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page">
      <Sidebar onLogout={logout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <div className="flex-1 overflow-hidden flex flex-col">
          <Routes>
            <Route path="/" element={<SummaryPage />} />

            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/ventas/productos" element={<VentasProductoPage />} />
            <Route path="/ventas/clientes" element={<VentasClientesPage />} />
            <Route path="/ventas/inventario" element={<VentasInventarioPage />} />
            <Route path="/ventas/tendencias" element={<VentasTendenciasPage />} />

            <Route path="/inventario" element={<InventarioTreemap />} />
            <Route path="/inventario/stock" element={<InventarioPage />} />

            <Route path="/cuentas-por-cobrar" element={<CuentasPorCobrarPage />} />

            <Route path="/configuration" element={<ConfigurationPage />} />
            <Route path="/configuration/users" element={<UserManagementPage />} />
            <Route path="/configuration/patch-notes" element={<PatchNotesPage />} />
            <Route path="/configuration/issues" element={<IssueReportsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
      <Route path="/*" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
