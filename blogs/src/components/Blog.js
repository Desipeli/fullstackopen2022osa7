import { useState } from 'react'
import { setNotification, setError } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { deleteBlogWithId, like } from '../reducers/blogReducer'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()
  const [showFullInfo, setShowFullInfo] = useState(false)

  const clickHandler = () => {
    setShowFullInfo(!showFullInfo)
  }

  const likeHandler = async () => {
    const modifiedBlog = { ...blog, likes: blog.likes }
    try {
      dispatch(like(modifiedBlog))
    } catch (exception) {
      console.log(exception.response.data.error)
    }
  }

  const removeHandler = async () => {
    blogService.setToken(user.token)
    if (!window.confirm(`Remove blog ${blog.title} ${blog.author} ?`)) {
      return
    }
    try {
      dispatch(deleteBlogWithId(blog.id))
      dispatch(setNotification(`Removed ${blog.title} ${blog.author}`, 3))
    } catch (exception) {
      console.log(exception.response.data.error)
      dispatch(setError(exception.response.data.error), 3)
    }
  }

  return (
    <div className={'blog'}>
      <div className={'blog-first-row'} onClick={() => clickHandler()}>
        {blog.title} {blog.author}
      </div>
      {showFullInfo && (
        <div className={'blog-other-rows'}>
          <br></br>
          {blog.url}
          <br></br>
          {blog.likes}{' '}
          <button className="like-button" onClick={() => likeHandler()}>
            like
          </button>
          <br></br>
          {blog.user.username}
          <br></br>
          {user && blog.user.username === user.username && (
            <button className="remove-button" onClick={removeHandler}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
