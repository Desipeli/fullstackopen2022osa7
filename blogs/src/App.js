import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')

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
      console.log('Logged in: ', user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      displayError(exception.response.data.error)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const displayError = (message) => {
    setNotification(message)
    setNotificationType('error')
    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 4000)
  }

  const displayNotification = (message) => {
    setNotification(message)
    setNotificationType('notification')
    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 4000)
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
      displayNotification(`a new blog ${title} by ${author} added`)
      return true
    } catch (error) {
      displayError(error.response.data.error)
      return false
    }
  }

  return (
    <div>
      <Notification
        message={notification}
        notificationClass={notificationType}
      />
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
              displayError={displayError}
              displayNotification={displayNotification}
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
            displayError={displayError}
            displayNotification={displayNotification}
          />
        ))}
    </div>
  )
}

export default App
