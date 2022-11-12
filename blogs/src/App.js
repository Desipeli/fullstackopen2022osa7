import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch } from 'react-redux'
import { setNotification, setError } from './reducers/notificationReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setError(exception.response.data.error, 3))
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    dispatch(setNotification('Logged out', 3))
  }

  const removeBlogWithId = (id) => {
    setBlogs(blogs.filter((b) => b.id !== id))
  }

  const sendBlog = async ({ title, author, url }) => {
    blogService.setToken(user.token)
    try {
      const result = await blogService.create({ title, author, url })
      result.user = user
      setBlogs(blogs.concat(result))
      dispatch(setNotification(`a new blog ${title} by ${author} added`, 3))
      return true
    } catch (error) {
      dispatch(setError(error.response.data.error))
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
            <BlogForm
              user={user}
              setBlogs={setBlogs}
              blogs={blogs}
              sendBlog={sendBlog}
            />
          </Togglable>
        </div>
      )}
      {blogs
        .sort((a, b) => {
          return b.likes - a.likes
        })
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            removeBlogWithId={removeBlogWithId}
          />
        ))}
    </div>
  )
}

export default App
