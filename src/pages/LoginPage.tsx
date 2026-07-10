import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import logoMedval from '../public/resources/logoMedval.svg'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetBanner, setResetBanner] = useState<string | null>(null)

  useEffect(() => {
    if (!username.trim()) {
      setResetBanner(null)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const status = await authService.checkReset(username)
        if (status.forceReset) {
          const expires = new Date(status.expiresAt!).toLocaleString()
          setResetBanner(`Tu administrador ha solicitado un cambio de contraseña. Ingresa tu nueva contraseña. Esta solicitud expira el ${expires}.`)
        } else {
          setResetBanner(null)
        }
      } catch {
        setResetBanner(null)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-100 w-full max-w-sm flex flex-col gap-4">
        <img src={logoMedval} className='w-full h-full' alt="Medval Logo" />
        <p className="text-base text-slate-400">Ingresa tus credenciales</p>

        {resetBanner && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
            {resetBanner}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="h-10 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-amber-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        <p className="text-xs text-slate-400 text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/signup" className="text-brand-orange hover:underline">
            Registrarse
          </Link>
        </p>
      </form>
    </div>
  )
}
