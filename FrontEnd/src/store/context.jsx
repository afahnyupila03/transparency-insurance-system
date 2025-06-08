import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const CONSTANTS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  SIGN_OUT: 'SIGN_OUT',
  ERROR: 'ERROR',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING'
}

const Context = createContext()

const defaultAppState = {
  user: null,
  error: null,
  loading: true
}

const AppReducer = (state, action) => {
  const type = action.type

  // const actions = {
  //   CONSTANTS.SIGN_IN: {}
  // }

  // return actions[type] || state

  switch (type) {
    case CONSTANTS.SIGN_IN:
    case CONSTANTS.SIGN_UP:
    case CONSTANTS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        error: null,
        loading: false
      }
    case CONSTANTS.SIGN_OUT:
      return {
        ...state,
        user: null,
        error: null,
        loading: false
      }
    case CONSTANTS.SET_LOADING:
      return { ...state, loading: action.payload.loading }
    case CONSTANTS.ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
        user: null
      }

    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, defaultAppState)

  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  const getApiUrl = async (endpoint, method, headers, payload) => {
    const res = await fetch(`http://localhost:3000/${endpoint}`, {
      method: method,
      headers: headers,
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || 'Something went wrong')

    return data
  }

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('token')

    if (!token) return false

    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000

      // Check token expiry
      if (decoded.exp < currentTime) {
        // Token expired clean up
        localStorage.removeItem('token')
        // localStorage.removeItem("role");

        // dispatch({ type: CONSTANTS.SIGN_OUT });

        return false
      }

      return true
    } catch (error) {
      console.error('Error decoding token: ', error)
      localStorage.removeItem('token')
      return false
    }
  }, [])

  const getUser = useCallback(async () => {
    dispatch({
      type: CONSTANTS.SET_LOADING,
      payload: { loading: true }
    })

    try {
      const token = localStorage.getItem('token')

      if (!token || !isAuthenticated()) {
        navigate('/authentication', { replace: true })
        throw new Error('No authenticated token found')
      }

      const headers = {
        Authorization: `Bearer ${token}`
      }

      const { data } = await getApiUrl('me', 'GET', headers)
      console.log('user data: ', data)

      dispatch({
        type: CONSTANTS.SET_LOADING,
        payload: { loading: false }
      })

      dispatch({
        type: CONSTANTS.SET_USER,
        payload: { user: data }
      })

      return data
    } catch (error) {
      dispatch({
        type: CONSTANTS.ERROR,
        payload: {
          error: error.message
        }
      })
      throw error
    }
  }, [isAuthenticated, navigate])

  const signupHandler = async values => {
    const headers = { 'Content-Type': 'application/json' }

    dispatch({
      type: CONSTANTS.SET_LOADING,
      payload: { loading: true }
    })

    try {
      const { token, data } = await getApiUrl(
        'register',
        'POST',
        headers,
        values
      )

      localStorage.setItem('token', token)

      dispatch({
        type: CONSTANTS.SIGN_UP,
        payload: { user: data }
      })

      navigate('/dashboard', { replace: true })

      dispatch({
        type: CONSTANTS.SET_LOADING,
        payload: { loading: false }
      })
    } catch (error) {
      dispatch({
        type: CONSTANTS.ERROR,
        payload: { error: error }
      })
      throw error
    }
  }

  const signinHandler = async values => {
    const headers = { 'Content-Type': 'application/json' }

    dispatch({
      type: CONSTANTS.SET_LOADING,
      payload: { loading: true }
    })

    try {
      const { token, data } = await getApiUrl('login', 'POST', headers, values)

      localStorage.setItem('token', token)

      dispatch({
        type: CONSTANTS.SIGN_IN,
        payload: { user: data }
      })

      navigate('/dashboard', { replace: true })

      dispatch({
        type: CONSTANTS.SET_LOADING,
        payload: { loading: false }
      })
    } catch (error) {
      dispatch({
        type: CONSTANTS.ERROR,
        payload: { error: error }
      })
      throw error
    }
  }

  const signoutHandler = async () => {
    dispatch({
      type: CONSTANTS.SET_LOADING,
      payload: { loading: true }
    })
    const token = localStorage.getItem('token')

    const headers = {
      Authorization: `Bearer ${token}`
    }

    try {
      if (!token) {
        dispatch({
          type: CONSTANTS.SET_LOADING,
          payload: { loading: false }
        })
        throw new Error('No authenticated token found')
      }

      await getApiUrl('logout', 'POST', headers)
      localStorage.removeItem('token')

      dispatch({
        type: CONSTANTS.SIGN_OUT
      })

      navigate('/authentication', { replace: true })

      dispatch({
        type: CONSTANTS.SET_LOADING,
        payload: { loading: false }
      })
    } catch (error) {
      dispatch({
        type: CONSTANTS.ERROR,
        payload: { error: error }
      })
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token && isAuthenticated()) {
      getUser()
    } else {
      // Save current path before directing to login.
      localStorage.setItem('redirectAfterAuth', pathname)
      console.log('redirectAfterAuth: ', pathname)
      // navigate('/authentication', { replace: true })

      dispatch({
        type: CONSTANTS.SET_LOADING,
        payload: { loading: false }
      })
    }
  }, [getUser, isAuthenticated, pathname, navigate])

  const value = {
    loading: state.loading,
    user: state.user,
    error: state.error,
    isAuthenticated,
    signinHandler,
    signoutHandler,
    signupHandler
  }

  if (state.loading)
    return (
      <div className='flex items-center justify-center h-screen bg-gray-50'>
        <div className='text-xl font-semibold text-gray-700 animate-pulse'>
          Loading...
        </div>
      </div>
    )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const AppState = () => useContext(Context)
