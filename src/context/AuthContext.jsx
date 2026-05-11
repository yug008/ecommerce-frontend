import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [cartCount, setCartCount] = useState(0)  // ← added

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setCartCount(0)  // ← reset cart count on logout
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAdmin = () => {
    return user?.role === 'ROLE_ADMIN'
  }

  const updateCartCount = (count) => {  // ← added
    setCartCount(count)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, cartCount, updateCartCount }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)