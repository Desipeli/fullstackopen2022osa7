import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({
  blog,
  user,
  removeBlogWithId,
  displayNotification,
  displayError
}) => {
  const [showFullInfo, setShowFullInfo] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const clickHandler = () => {
    setShowFullInfo(!showFullInfo)
  }

  const likeHandler = async () => {
    const modifiedBlog = { ...blog, likes: likes }
    try {
      const sendLike = await blogService.like({ modifiedBlog })
      setLikes(sendLike.likes)
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
      const response = await blogService.removeBlog(blog.id)
      if (response.status === 204) {
        displayNotification(`Removed ${blog.title} ${blog.author}`)
        removeBlogWithId(blog.id)
      }
    } catch (exception) {
      console.log(exception.response.data.error)
      displayError(exception.response.data.error)
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
          {likes}{' '}
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
