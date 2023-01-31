import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import LoginForm from './LoginForm'
import { setNotification } from '../reducers/notificationReducer'
import { removeUser } from '../reducers/userReducer'

const NavBar = () => {
  const userSelector = (state) => state.user
  const user = useSelector(userSelector)
  const dispatch = useDispatch()

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    dispatch(removeUser())
    dispatch(setNotification('Logged out', 3))
  }
  return (
    <nav id="navbar">
      <div id="links">
        <Link to="/">Blogs</Link>
        <Link to="/users">Users</Link>
      </div>

      {user === null && (
        <div>
          <LoginForm />
        </div>
      )}
      {user !== null && (
        <div>
          {user.username} logged in <button onClick={logout}>log out</button>
        </div>
      )}
    </nav>
  )
}

export default NavBar
