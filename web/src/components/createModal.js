import React from 'react'
import styles from './editModal.module.css'
import { createEmployee } from '../api/employees'

class EditModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      parent: props.parentId,
      forename: "",
      surname: "",
      position: "TM",
      joiningDate: ""
    }

    this.handleForenameChange = this.handleForenameChange.bind(this)
    this.handleSurnameChange = this.handleSurnameChange.bind(this)
    this.handlePositionChange = this.handlePositionChange.bind(this)
    this.handleJoinDateChange = this.handleJoinDateChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleForenameChange(event) {
    this.setState({forename: event.target.value})
  }

  handleSurnameChange(event) {
    this.setState({surname: event.target.value})
  }

  handleJoinDateChange(event) {

    this.setState({joiningDate: event.target.value})
  }

  handlePositionChange(event) {
    this.setState({position: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    let employee = {
      forename: this.state.forename,
      surname: this.state.surname,
      position: this.state.position,
      joiningDate: this.state.joiningDate,
      parent: this.props.parentId
    }
    createEmployee(employee)
    .then((json) => {
      this.props.refresh()
      this.props.handleClose()
    }) 
    .catch((error) => {
      this.props.handleError(error.message)
    })

  }

  render() {
    return (
      <div className={styles.modal}>

        <div className={styles.modalTitle}>
          <button className={styles.modalExitButton} onClick={this.props.handleClose}>X</button>
          <h3 className={styles.employeeName} >Creating new employee</h3>
        </div>
        <form onSubmit={this.handleSubmit}>
          <label className={'modalFormLabel'}>Forename</label>
          <input type='text' value={this.state.forename} onChange={this.handleForenameChange} /><br/>

          <label className={'modalFormLabel'}>Surname</label>
          <input type='text' value={this.state.surname} onChange={this.handleSurnameChange} /><br/>

          <label className={'modalFormLabel'}>Joining Date (YYYY-MM-DD)</label>
          <input type='text' value={this.state.joiningDate} onChange={this.handleJoinDateChange} /><br/>

          <label className={'modalFormLabel'}>Position</label>
          <select value={this.state.position} onChange={this.handlePositionChange}>
            <option value="CEO">CEO</option>
            <option value="MD">MD</option>
            <option value="SM">SM</option>
            <option value="M">M</option>
            <option value="TM">TM</option>
          </select>

          <br/>

          <input type="submit" value="Save"/>
        </form>
        
      </div>
    )
  }

}

export default EditModal