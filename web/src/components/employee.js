import React from 'react'
import styled from 'styled-components'
 
class Employee extends React.Component {

  render() {
    return (
      <tr>
        <td>{this.props.employee.id}</td>
        <td>{this.props.employee.forename} {this.props.employee.surname}</td>
        <td>{this.props.employee.position}</td>
        <td><button onClick={this.props.deleteOnClickHandler}>Delete</button></td>
      </tr>

    )
  }

}

export default Employee;