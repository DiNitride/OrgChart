import React from 'react'
import styles from './error.module.css'

class Error extends React.Component {

  render() {
    return (
      <div className={styles.errorBar}>
        <button
          className={styles.exitButton}
          onClick={() => this.props.handleExit()}
        >X</button>
        <p>ERROR: {this.props.errorMessage}</p>
      </div>
    )
  }

}

export default Error