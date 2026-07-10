import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldBan } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import type { User } from '../types/auth';

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await authService.register({ username, email, password, fullName, role });
      setSuccess(`Usuario "${username}" creado exitosamente`);
      setFullName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('viewer');
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6"
    >
      <h1 className="text-xl sm:text-2xl font-bold text-brand-navy">Gestión de Usuarios</h1>

      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="kpi-card"
        >
          <div className="flex items-center gap-3 py-6">
            <ShieldBan size={24} className="text-slate-300" />
            <div>
              <h2 className="text-sm font-semibold text-brand-navy">Sección restringida</h2>
              <p className="text-xs text-slate-400 mt-0.5">Solo los administradores pueden gestionar usuarios.</p>
            </div>
          </div>
        </motion.div>
      )}

      {isAdmin && (
        <>
          {/* Register Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="kpi-card"
          >
            <h2 className="text-sm sm:text-base font-bold text-brand-orange uppercase mb-4">Registrar Nuevo Usuario</h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">{success}</div>
            )}

            <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Rol</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:border-transparent focus:ring-brand-orange/20 bg-white"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full h-10 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-amber-500 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="chart-card"
          >
            <h2 className="text-sm sm:text-base font-bold text-brand-orange uppercase mb-4">Usuarios Registrados</h2>

            {loading ? (
              <p className="text-sm text-slate-500">Cargando...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No hay usuarios registrados</p>
            ) : (
              <div className="-mx-5 sm:mx-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Nombre</th>
                      <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Usuario</th>
                      <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Email</th>
                      <th className="text-left py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Rol</th>
                      <th className="text-right py-3 px-4 sm:px-2 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50 hover:bg-surface-muted transition-colors">
                        <td className="py-3 px-4 sm:px-2 text-brand-navy font-medium whitespace-nowrap">{u.full_name}</td>
                        <td className="py-3 px-4 sm:px-2 text-slate-600 whitespace-nowrap">{u.username}</td>
                        <td className="py-3 px-4 sm:px-2 text-slate-600 whitespace-nowrap">{u.email}</td>
                        <td className="py-3 px-4 sm:px-2 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 sm:px-2 text-right text-slate-500 whitespace-nowrap">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.main>
  );
}
