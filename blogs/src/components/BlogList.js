import { useSelector } from 'react-redux'
import Blog from './Blog'

const BlogList = ({ user }) => {
  const selector = (state) => state.blogs
  const blogit = useSelector(selector)

  if (!blogit) {
    return <></>
  }

  const ordered = [...blogit].sort((a, b) => {
    return b.likes - a.likes
  })

  return (
    <div>
      {ordered.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  )
}

export default BlogList
