import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const blogFormRef = React.createRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.slice().sort(compareLikes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const setNotification = (message, type) => {
    setErrorMessage(message)
    setMessageType(type)
    setTimeout(() => {
      setErrorMessage(null)
      setMessageType(null)
    }, 5000)
  }

  const compareLikes = (a, b) => { return b.likes - a.likes }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog).slice().sort(compareLikes))
      })
  }

  const deleteBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {

      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          setNotification(`Removed ${blog.title} by ${blog.author}`, 'success')
        }).catch(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          setNotification(`${blog.title} by ${blog.author} already removed`, 'error')
        })
    }
  }

  const addLikeTo = (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const changedBlogFullUserInfo = { ...blog, likes: blog.likes + 1, user: blog.user }
    blogService
      .update(id, changedBlog)
      .then(() => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : changedBlogFullUserInfo).slice().sort(compareLikes))
      })
      .catch(() => {
        setBlogs(blogs.filter(b => b.id !== id))
        setNotification('Blog was already removed from server', 'error')
      })
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification('Logout success', 'success')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification('Login success', 'success')
    } catch (exception) {
      setNotification('Wrong credentials', 'error')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification  message={errorMessage} messageType={messageType} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} messageType={messageType} />
      <p>{user.name} logged in
        <button onClick={handleLogout}>
        Log out
        </button>
      </p>
      {blogForm()}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => addLikeTo(blog.id)}
          deleteBlog={ () => deleteBlog(blog.id)}
          loggedUsername={ user.username }
        />
      )}
    </div>
  )
}

export default App