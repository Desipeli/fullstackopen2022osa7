import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'otsikko',
  author: 'tekijä',
  url: 'osoite',
  likes: '2',
  user: { username: 'moi' }
}

test('show initially only title and author', () => {
  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog-first-row')
  expect(div).toHaveTextContent('otsikko')
  expect(div).toHaveTextContent('tekijä')

  const div2 = container.querySelector('.blog-other-rows')
  expect(div2).toBeNull()
})

test('clicking the title shows all information', async () => {
  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const div = container.querySelector('.blog-first-row')
  expect(div).toHaveTextContent('otsikko')

  const div2 = container.querySelector('.blog-other-rows')
  expect(div2).toBeNull()

  await user.click(div)

  const others = container.querySelector('.blog-other-rows')
  screen.debug(others)
  expect(others).toHaveTextContent('moi')
  expect(others).toHaveTextContent('2')
  expect(others).toHaveTextContent('osoite')
})

test('clicking the title again hides other information', async () => {
  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const div = container.querySelector('.blog-first-row')
  expect(div).toHaveTextContent('otsikko')

  const div2 = container.querySelector('.blog-other-rows')
  expect(div2).toBeNull()

  await user.click(div)

  const others = container.querySelector('.blog-other-rows')
  expect(others).toHaveTextContent('moi')
  expect(others).toHaveTextContent('2')
  expect(others).toHaveTextContent('osoite')

  await user.click(div)

  const noOthers = container.querySelector('.blog-other-rows')
  expect(noOthers).toBeNull()
})

test('clicking removebutton', async () => {
  const mockHandler = jest.fn()
  window.confirm = jest.fn(() => true)

  const user = {
    username: 'moi'
  }

  const { container } = render(
    <Blog blog={blog} user={user} displayError={mockHandler} />
  )

  const eventUser = userEvent.setup()
  const div = container.querySelector('.blog-first-row')
  await eventUser.click(div)
  const button = screen.getByText('remove')
  await eventUser.click(button)
  await eventUser.click(button)
  await eventUser.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
