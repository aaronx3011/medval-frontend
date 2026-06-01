import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logoMedval from '../public/resources/logoMedval.svg'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await register({ username, email, password, fullName })
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-100 w-full max-w-sm flex flex-col gap-4">
        <img src={logoMedval} className='w-full h-full' alt="Medval Logo" />
        <p className="text-base text-slate-400">Crea tu cuenta</p>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Nombre completo"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
          required
        />
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
          minLength={6}
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className="h-10 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>

        <p className="text-xs text-slate-400 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand-orange hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  )
}
