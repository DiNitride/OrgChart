import React from 'react';
import Employee from './components/employee'
import EditModal from './components/editModal'
import SwapModal from './components/swapModal'

class App extends React.Component {

  positionHeirachy = {
    'CEO': 5,
    'MD': 4,
    'SM': 3,
    'M': 2,
    'TM': 1
  }

  constructor() {
    super()
    this.state = {
      employees: [],
      root: null,
      modalOpen: false,
      modal: null,
      a: null,
      b: null,
    }
  }

  async getChildren(parent, employees) {
    let children = []
    employees.forEach(async (employee, index) => {
      if ((employee.parent) === parent) {
        employee.children = await this.getChildren(parseInt(employee.id), employees)
        children.push(employee)
      }
    })
    return children;
  }

  async refresh() {
    const resp = await fetch(
      "http://localhost:8000/employees/"
    )
    const json = await resp.json()
    let employees = json.employees

    employees.sort((a,b) => {
      return this.positionHeirachy[a.position] - this.positionHeirachy[b.position]
    })

    employees.reverse() // CEO to top
    let ceo = employees.shift() // Get CEO/root
    ceo.children = await this.getChildren(parseInt(ceo.id), employees) // Construct children arrays recursively

    this.setState({employees: employees, root: ceo})
  }

  async componentDidMount() {
    await this.refresh()
  }

  async swap(employeeA, employeeB, keepChildren) {
    console.log("Swap")

    const respSwap = await fetch("http://localhost:8000/employees/swap",
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "employee_a=" + encodeURIComponent(employeeA.id) +
            "&employee_b=" + encodeURIComponent(employeeB.id) +
            "&keep_children=" + encodeURIComponent(keepChildren) 
    })

    if (respSwap.status === 200) {
      const json = await respSwap.json()
      console.log(json)
    }
    await this.refresh()
  }

  async edit(employee) {

    const respEdit = await fetch("http://localhost:8000/employees/" + employee.id,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: "surname=" + encodeURIComponent(employee.surname) +
            "&forename=" + encodeURIComponent(employee.forename) +
            "&position=" + encodeURIComponent(employee.position) +
            "&joiningDate=" + encodeURIComponent(employee.joiningDate) +
            "&parent=" + encodeURIComponent(employee.parent)
    })

    if (respEdit.status === 200) {
      const json = await respEdit.json()
      console.log(json)
    }
    await this.refresh()
    
  }

  async delete(employee) {
    console.log('Deleted employee ' + employee);
  }

  async openEditModal(employee) {
    this.setState({
      'modalOpen': true,
      'modal': 0,
      'a': employee
    })
  }

  getEmployeeFromId(id) {
    let matches = this.state.employees.filter((employee) => {
      if (employee.id === id) {
        return true
      }
      return false
    })
    return matches[0]
  }

  async openSwapModal(employeeA, employeeB) {
    employeeA = this.getEmployeeFromId(employeeA)
    this.setState({
      'modalOpen': true,
      'modal': 1,
      'a': employeeA,
      'b': employeeB
    })
  }

  async closeModal() {
    this.setState({
      'modalOpen': false,
      'modal': null,
      'a': null,
      'b': null
    })
  }

  render() {
    return (
      <div>
        {this.state.modalOpen === true &&
          <div className={'modalBase'}>
            {this.state.modal === 0 &&
              <EditModal
                editHandler={(employee) => this.edit(employee)}
                employee={this.state.a}
                handleClose={() => this.closeModal()}
              />
            }
            {this.state.modal === 1 &&
              <SwapModal
                editHandler={(employee) => this.edit(employee)}
                swapHandler={(a,b,keepChildren) => this.swap(a,b,keepChildren)}
                employeeA={this.state.a}
                employeeB={this.state.b}
                handleClose={() => this.closeModal()}
              />
            }
          </div>
        }
        
        {this.state.root !== null &&
          <Employee
            openSwapModal={(a,b) => this.openSwapModal(a,b)} 
            openEditModal={(employee) => this.openEditModal(employee)}
            employee={this.state.root}>
          </Employee>}
      </div>
    )
  }

}

export default App;
