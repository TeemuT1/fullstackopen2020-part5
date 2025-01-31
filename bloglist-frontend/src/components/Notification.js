import React from 'react'
import PropTypes from 'prop-types'

const Notification = (props) => {
  const { message, messageType } = props
  if (message === null) {
    return null
  }

  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  messageType: PropTypes.string
}

export default Notification