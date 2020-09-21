import React from 'react';

import Employee from './components/employee'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      employees: []
    }
  }

  async refresh() {
    const resp = await fetch(
      "http://127.0.0.1:8000/employees/"
    )

    const json = await resp.json()
    console.log(json)
    this.setState({employees: json.employees})
  }

  async componentDidMount() {
    await this.refresh()
  }

  async edit(employee) {
    console.log('Edited employee ' + employee.forename);
  }

  async delete(employee) {
    console.log('Deleted employee ' + employee);
  }

  render() {
    return (
      <div>
        <h1>Employees</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Position</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.employees.map((employee, index) => (
              <Employee employee={employee} deleteOnClickHandler={() => this.delete(employee.id)}></Employee>
            ))}
          </tbody>
        </table>
        
      </div>
    )
  }

}

export default App;
