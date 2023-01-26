import { useSelector } from 'react-redux'
import Blog from './Blog'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

const BlogList = () => {
  const selector = (state) => state.blogs
  const blogit = useSelector(selector)
  const userSelector = (state) => state.user
  const user = useSelector(userSelector)
  if (!blogit) {
    return <></>
  }

  const ordered = [...blogit].sort((a, b) => {
    return b.likes - a.likes
  })

  return (
    <div>
      <Togglable buttonLabel="show blog form">
        <BlogForm />
      </Togglable>
      {ordered.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  )
}

export default BlogList
