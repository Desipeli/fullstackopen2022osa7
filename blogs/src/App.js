import { useEffect } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import { useDispatch } from 'react-redux'
import { addManyBlogs } from './reducers/blogReducer'
import BlogList from './components/BlogList'
import { setUser } from './reducers/userReducer'
import { Routes, Route } from 'react-router-dom'
import Users from './components/Users.js'
import User from './components/User'
import NavBar from './components/NavBar'

const App = () => {
  const dispatch = useDispatch()

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

  return (
    <div>
      <NavBar />
      <Notification />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<User />} />
      </Routes>
    </div>
  )
}

export default App
