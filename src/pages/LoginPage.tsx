import logoMedval from '../public/resources/logoMedval.svg'

interface LoginPageProps {
    onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onLogin() // ← this is all you need
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-page">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-100 w-80 flex flex-col gap-4">
                <img src={logoMedval} className='w-full h-full' />
                <p className="text-base text-slate-400">Ingresa tus credenciales</p>

                <input
                    type="text"
                    placeholder="Usuario"
                    className="h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
                />

                <button
                    type="submit"
                    className="h-10 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                    Iniciar sesión
                </button>
            </form>
        </div>
    )
}
