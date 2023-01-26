import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

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
    }
  }
})

export const addNewBlog = (blog) => {
  return async (dispatch) => {
    dispatch(addBlog(blog))
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

export const { addBlog, setBlogs, removeBlog } = blogSlice.actions
export default blogSlice.reducer
