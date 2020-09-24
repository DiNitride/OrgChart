import React from 'react'
import styles from './employee.module.css'

class Employee extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      'draggedOver': false
    }
  }

  handleDrop(e, employee) {
    let id = e.dataTransfer.getData('id')
    this.setState({'draggedOver': false})
    console.log(id + ' dropped on employee ' + employee)
    this.props.openSwapModal(id, employee)

  }

  handleDragStart(e) {
    console.log('Started dragging ' + this.props.employee.id)
    e.dataTransfer.setData("id", this.props.employee.id)
  }

  handleDragOver(e) {
    e.preventDefault()
  }

  handleDragEnter(e) {
    this.setState({'draggedOver': true})
  }

  handleDragLeave(e) {
    this.setState({'draggedOver': false})
  }

  render() {
    return (
      <div className={styles.employeeBox}>

        <div
          className={`${styles.employeeDetails} ${this.state.draggedOver ? styles.draggedOver : ""}`}

          draggable 
          onDragStart={(e) => this.handleDragStart(e)}

          onDragEnter={(e) => this.handleDragEnter(e)}
          onDragLeave={(e) => this.handleDragLeave(e)}
          onDragOver={(e) => this.handleDragOver(e)}
          onDrop={(e) => this.handleDrop(e, this.props.employee)}

          onClick={() => this.props.openEditModal(this.props.employee)}
        >
          {this.props.employee.forename} {this.props.employee.surname}
          <br/>
          {this.props.employee.position}
          <br />
          {this.props.employee.joiningDate}
        </div>
        
        <div className={styles.childrenBox}>
          {this.props.employee.children.map((child, index) => {
            return <Employee
              key={child.id}
              openEditModal={(employee) => this.props.openEditModal(employee)}
              openSwapModal={(a,b) => this.props.openSwapModal(a,b)}
              employee={child}>  
            </Employee>
          })}
        </div>
        
      </div>
    )
  }

}

export default Employee;