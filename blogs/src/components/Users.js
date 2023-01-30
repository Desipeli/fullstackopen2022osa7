import { useEffect, useState } from 'react'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const Users = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await userService.getAll()
      setUsers(allUsers)
    }
    getUsers()
  }, [])

  const usersInOrder = [...users].sort(
    (a, b) => b.blogs.length - a.blogs.length
  )

  if (!usersInOrder) {
    return <div>no users</div>
  }
  return (
    <div>
      <h1>Users</h1>
      <br></br>
      <div className="wrapper">
        <p></p>
        <h3>blog posts</h3>
      </div>
      {usersInOrder.map((user) => (
        <div className="wrapper" key={user.id}>
          <p>
            <Link to={`/users/${user.id}`}>{user.username}</Link>
          </p>
          <p>{user.blogs.length}</p>
        </div>
      ))}
    </div>
  )
}

export default Users
