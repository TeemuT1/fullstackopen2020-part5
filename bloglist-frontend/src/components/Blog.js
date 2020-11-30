import React, { useState } from 'react'
const Blog = ({ blog, addLike, deleteBlog, loggedUsername }) => {

  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showButtonToOwner = { display: blog.user.username === loggedUsername ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  if(!visible) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className='blog' style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>
          {blog.url} <br/>
          likes <span className='like-value'>{blog.likes}</span> <button className='like-button' onClick={addLike}>like</button><br/>
          {blog.author}
          <div style={showButtonToOwner}>
            <button onClick={deleteBlog}>remove</button>
          </div>
        </div>
      </div>
    )
  }
}
export default Blog
