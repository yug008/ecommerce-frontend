import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { token, name, role } = response.data
      login({ name, email, role }, token)
      toast.success('Login successful!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <Toaster />
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter email"
              required
            />
          </div>
          <div style={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f1f5f9'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    width: '400px'
  },
  title: {
    marginBottom: '24px',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  field: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px'
  },
  link: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px'
  }
}  