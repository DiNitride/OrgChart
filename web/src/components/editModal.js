import React from 'react'
import styles from './editModal.module.css'

class EditModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      forename: props.employee.forename,
      surname: props.employee.surname,
      position: props.employee.position,
      joiningDate: props.employee.joiningDate

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
      id: this.props.employee.id,
      forename: this.state.forename,
      surname: this.state.surname,
      position: this.state.position,
      joiningDate: this.state.joiningDate,
      parent: this.props.employee.parent
    }
    this.props.editHandler(employee)
    this.props.handleClose()
  }

  render() {
    return (
      <div className={styles.modal}>
        <div className={styles.modalTitle}>
          <button className={styles.modalExitButton} onClick={this.props.handleClose}>X</button>
          <h3 className={styles.employeeName} >Editing {this.props.employee.forename} {this.props.employee.surname} details</h3>
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