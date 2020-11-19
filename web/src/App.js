import React from 'react';
import Employee from './components/employee'
import EditModal from './components/editModal'
import SwapModal from './components/swapModal'
import CreateModal from './components/createModal'
import Menu from './components/menu'
import Error from './components/error'
import './api/employees'
import { getAllEmployees, getEmployee } from './api/employees';
import { buildTrees } from './utils/tree'

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
      trees: [],
      modalOpen: false,
      modal: null,
      a: null,
      b: null,
      error: null
    }
  }

  refreshTrees() {
    console.log("Refreshing...")
    getAllEmployees()
    .then((resp) => {
      console.log("Got refreshed employees")
      let trees = buildTrees(resp.employees)
      console.log("Built tree")
      this.setState({'trees': trees})
    })
    .catch((error) => this.setError(error.message))
  }

  async componentDidMount() {
    console.log("Mounted, refreshing trees")
    this.refreshTrees()
  }

  clearError() {
    this.setState({error: null})
  }

  setError(message) {
    console.log("Set error to " + message)
    this.setState({error: message})
  }

  openEditModal(employee) {
    this.setState({'modalOpen': true, 'modal': 0, 'a': employee})
  }
  
  openSwapModal(employeeA, employeeB) {
    employeeA = getEmployee(employeeA)
    .then(
      this.setState({'modalOpen': true, 'modal': 1, 'a': employeeA, 'b': employeeB})
    )
    
  }

  openCreateModal(parentId) {
    this.setState({'modalOpen': true, 'modal': 2, 'create_parent': parentId})
  }

  closeModal() {
    this.setState({'modalOpen': false, 'modal': null, 'a': null, 'b': null, 'create_parent': null})
  }

  render() {
    return (
      <div>
        {this.state.modalOpen === true &&
          <div className={'modalBase'}>
            {this.state.modal === 0 &&
              <EditModal
                employee={this.state.a}
                handleClose={() => this.closeModal()}
                handleError={(error) => this.setError(error)}
                refresh={() => this.refreshTrees()}
              />
            }
            {this.state.modal === 1 &&
              <SwapModal
                employeeA={this.state.a}
                employeeB={this.state.b}
                handleClose={() => this.closeModal()}
                handleError={(error) => this.setError(error)}
                refresh={() => this.refreshTrees()}
              />
            }
            {this.state.modal === 2 &&
              <CreateModal
                parentId={this.state.create_parent}
                handleClose={() => this.closeModal()}
                handleError={(error) => this.setError(error)}
                refresh={() => this.refreshTrees()}
              />
            }
          </div>
        }
        
        {this.state.error !== null &&
          <Error
            errorMessage={this.state.error}
            handleExit={() => this.clearError()}
          />
        }

        {
          this.state.trees.map((root, index) => {
            return <Employee
              key={root.id}
              openSwapModal={(a,b) => this.openSwapModal(a,b)} 
              openEditModal={(employee) => this.openEditModal(employee)}
              openCreateModal={(parentId) => this.openCreateModal(parentId)}
              employee={root}
            />
          })
        }
        

        <Menu
          refresh={() => this.refreshTrees()}
        />
        
      </div>
    )
  }

}

export default App;
