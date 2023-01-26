import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setError, setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      const blogs = state.filter((blog) => blog.id !== action.payload)
      return blogs
    },
    likeBlog(state, action) {
      const blogs = state.map((blog) =>
        blog.id === action.payload.id
          ? { ...blog, likes: action.payload.likes }
          : blog
      )
      return blogs
    }
  }
})

export const createBlog = (blog, user) => {
  return async (dispatch) => {
    try {
      blogService.setToken(user.token)
      const res = await blogService.create(blog)
      const newBlog = { ...res, user: user }
      dispatch(addBlog(newBlog))
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          3
        )
      )
    } catch (error) {
      console.log(error.response.data.error)
      dispatch(setError(error.response.data.error, 3))
    }
  }
}

export const addManyBlogs = (blogs) => {
  return async (dispatch) => {
    dispatch(setBlogs(blogs))
  }
}

export const deleteBlogWithId = (id) => {
  return async (dispatch) => {
    const response = await blogService.removeBlog(id)
    if (response.status === 204) {
      dispatch(removeBlog(id))
    }
  }
}

export const like = (blog) => {
  return async (dispatch) => {
    const res = await blogService.like(blog)
    if (res.status === 200) {
      dispatch(likeBlog(res.data))
    }
  }
}

export const { addBlog, setBlogs, removeBlog, likeBlog } = blogSlice.actions
export default blogSlice.reducer
