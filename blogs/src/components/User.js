import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../services/users'

const User = () => {
  const [viewUser, setViewUser] = useState(undefined)
  const { userId } = useParams()

  useEffect(() => {
    const getAllUsers = async () => {
      const users = await userService.getAll()
      setViewUser(users.find((u) => u.id === userId))
    }
    getAllUsers()
  }, [])

  if (!viewUser) return null

  return (
    <div>
      <h1>{viewUser.username}</h1>
      <h3>Blogs</h3>
      <ul>
        {viewUser.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
