import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification, setError } from './reducers/notificationReducer'
import { addManyBlogs, addNewBlog } from './reducers/blogReducer'
import BlogList from './components/BlogList'
import { setUser, removeUser } from './reducers/userReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState(null)
  const dispatch = useDispatch()
  const userSelector = (state) => state.user
  const user = useSelector(userSelector)

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(addManyBlogs(blogs)))
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      dispatch(setNotification(`Logged in as ${user.username}`, 3))
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setError(exception.response.data.error, 3))
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    dispatch(removeUser())
    dispatch(setNotification('Logged out', 3))
  }

  const sendBlog = async ({ title, author, url }) => {
    blogService.setToken(user.token)
    try {
      const result = await blogService.create({ title, author, url })
      result.user = user
      dispatch(addNewBlog(result))
      dispatch(setNotification(`a new blog ${title} by ${author} added`, 3))
      return true
    } catch (error) {
      dispatch(setError(error.response.data.error, 3))
      return false
    }
  }

  return (
    <div>
      <Notification />
      {user === null && (
        <div>
          <h2>Log in</h2>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </div>
      )}
      {user !== null && (
        <div>
          <h2>blogs</h2>
          <p>
            {' '}
            {user.username} logged in <button onClick={logout}>log out</button>
          </p>
          <Togglable buttonLabel="show blog form">
            <BlogForm sendBlog={sendBlog} />
          </Togglable>
        </div>
      )}

      <BlogList />
    </div>
  )
}

export default App
