import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const userSelector = (state) => state.user
  const user = useSelector(userSelector)
  const dispatch = useDispatch()

  const addBlog = async (event) => {
    event.preventDefault()
    dispatch(createBlog({ title, author, url }, user))
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      title
      <input
        value={title}
        id="title-input"
        onChange={({ target }) => setTitle(target.value)}
      />
      <br></br>
      author
      <input
        value={author}
        id="author-input"
        onChange={({ target }) => setAuthor(target.value)}
      />
      <br></br>
      url
      <input
        value={url}
        id="url-input"
        onChange={({ target }) => setUrl(target.value)}
      />
      <br></br>
      <button id="create-blog-button" onClick={addBlog} type="submit">
        create
      </button>
    </form>
  )
}

export default BlogForm
