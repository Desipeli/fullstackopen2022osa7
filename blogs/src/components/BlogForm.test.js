import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('BlogForm', async () => {
  const eventUser = userEvent.setup()
  const mockHandler = jest.fn()

  render(<BlogForm sendBlog={mockHandler} />)

  const inputs = screen.getAllByRole('textbox')
  const create = screen.getByText('create')

  await eventUser.type(inputs[0], 'titteli')
  await eventUser.type(inputs[1], 'tekijä')
  await eventUser.type(inputs[2], 'url')

  await eventUser.click(create)

  expect(mockHandler.mock.calls[0][0]).toMatchObject({
    title: 'titteli',
    author: 'tekijä',
    url: 'url'
  })
})
