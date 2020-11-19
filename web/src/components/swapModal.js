import React from 'react'
import styles from './editModal.module.css'
import { swapEmployees, editEmployee, getEmployee } from '../api/employees'

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
      this.handleSwap(e)
    } else if (this.state.action === 'child') {
      this.handleMoveToChild(e)
    }

  }

  handleSwap() {
    swapEmployees(this.props.employeeA, this.props.employeeB.id, this.state.keepChildren)
    .then(() => {
      this.handleClose()
    }) 
    .catch((error) => {
      this.props.handleError(error.message)
    })
  }

  handleMoveToChild() {
    getEmployee(this.props.employeeA)
    .then((e) => {
      e.employee.parent = this.props.employeeB.id
      editEmployee(e.employee)
      .then(() => {
        this.handleClose()
      }) 
      .catch((error) => {
        this.props.handleError(error.message)
      })
    })
  }

  handleClose() {
    this.props.refresh()
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