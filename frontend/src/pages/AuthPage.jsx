import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { signup, loginApi } from '../api'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('fill in all fields'); return }
    if (password.length < 6) { toast.error('password must be at least 6 characters'); return }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await signup(email, password)
        toast.success('account created — logging you in')
      }
      const res = await loginApi(email, password)
      login(res.data.access_token)
      toast.success('welcome to prio')
    } catch (err) {
      const detail = err.response?.data?.detail
      toast.error(detail || (mode === 'signup' ? 'signup failed' : 'invalid email or password'))
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `w-full rounded-md border border-border bg-bg text-text
    px-3 py-2.5 text-sm font-mono placeholder:text-text-muted
    focus:outline-none focus:ring-2 focus:ring-accent`

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            </div>
            <span className="font-mono text-xs text-text-muted">~/prio</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-text">Prio</h1>
          <p className="text-sm text-text-muted font-mono mt-1">// stay organized, stay ahead</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-lg p-6">
          {/* Mode toggle */}
          <div className="flex gap-1 bg-bg rounded-md p-1 mb-6 border border-border">
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-1.5 rounded text-sm font-mono transition-colors
                  ${mode === m
                    ? 'bg-accent text-bg font-semibold'
                    : 'text-text-muted hover:text-text'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-text-muted uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`${inputCls} mt-1`}
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-muted uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="min 6 characters"
                className={`${inputCls} mt-1`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-bg font-display font-semibold py-2.5 rounded-lg
                hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
            >
              {loading ? '...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted font-mono mt-4">
          {mode === 'login'
            ? "don't have an account? "
            : 'already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-accent hover:underline"
          >
            {mode === 'login' ? 'sign up' : 'sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}