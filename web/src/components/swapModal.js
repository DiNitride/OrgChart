import React from 'react'
import styles from './editModal.module.css'

class EditModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      action: 'swap',
      keepChildren: false,

    }

    this.handleKeepChildrenChange = this.handleKeepChildrenChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleActionChange = this.handleActionChange.bind(this)
  }

  handleKeepChildrenChange(e) {
    this.setState({keepChildren: e.target.checked})
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.action === 'swap') {
      this.props.swapHandler(this.props.employeeA, this.props.employeeB, this.state.keepChildren)
    } else if (this.state.action === 'child') {
      let e = this.props.employeeA
      e.parent = this.props.employeeB.id
      this.props.editHandler(e)
    }
    this.props.handleClose()
  }
  
  handleActionChange(e) {
    this.setState({action: e.target.value})
  }

  render() {
    return (
      <div className={styles.modal}>

        <div className={styles.modalTitle}>
          <button className={styles.modalExitButton} onClick={this.props.handleClose}>X</button>
          <h3 className={styles.employeeName}>Moving {this.props.employeeA.forename} {this.props.employeeA.surname}</h3>
        </div>

        <form onSubmit={this.handleSubmit}>
          <label className={'modalFormLabel'}>Action</label>
          <select value={this.state.action} onChange={this.handleActionChange}>
            <option value='swap'>Swap {this.props.employeeA.forename} with {this.props.employeeB.forename}</option>
            <option value='child'>Make {this.props.employeeA.forename} a child of {this.props.employeeB.forename}</option>
          </select>
          <br/>
          {this.state.action === 'swap' &&
            <>
              <label className={'modalFormLabel'}>Keep Children on swap</label>
              <input
                name="keepChildren"
                type="checkbox"
                checked={this.state.keepChildren}
                onChange={this.handleKeepChildrenChange}
              />
              <br/>
            </>
          }
          

          <input type="submit" value="Save"/>
        </form>
        
      </div>
    )
  }

}

export default EditModal