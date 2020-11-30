import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author only', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    likes: 3,
    url: 'www.test.com',
    user: {
      id: '123',
      username: 'testuser',
      name: 'Test Name'
    }
  }

  const component = render(
    <Blog blog={blog}/>
  )

  expect(component.container).toHaveTextContent(
    'Test Blog'
  )
  expect(component.container).toHaveTextContent(
    'Test Author'
  )
  expect(component.container).not.toHaveTextContent(
    'www.test.com'
  )
  expect(component.container).not.toHaveTextContent(
    'likes 3'
  )
})

test('clicking the view button shows likes and url', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    likes: 3,
    url: 'www.test.com',
    user: {
      id: '123',
      username: 'testuser',
      name: 'Test Name'
    }
  }

  const component = render(
    <Blog blog={blog}/>
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'www.test.com'
  )
  expect(component.container).toHaveTextContent(
    'likes 3'
  )
})

test('clicking the like button twice calls event handler twice', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    likes: 3,
    url: 'www.test.com',
    user: {
      id: '123',
      username: 'testuser',
      name: 'Test Name'
    }
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} addLike={ mockHandler }/>
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})