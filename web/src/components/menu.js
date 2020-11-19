import React from 'react'
import styles from './menu.module.css'
import { deleteEmployee } from '../api/employees'

class Menu extends React.Component {

  handleDeleteDrop(e) {
    let id = e.dataTransfer.getData('id')
    console.log('Deleted ' + id)
    deleteEmployee(id)
    this.props.refresh()
  }

  handleDragOver(e) {
    e.preventDefault()
  }

  handleDragStart(e) {
    console.log('Started dragging employee creation box')
    e.dataTransfer.setData("id", 'create')
  }

  render() {

    return (
      <div
        className={styles.menuBox}
      >
        <div
          className={styles.deleteBox}
          onDrop={(e) => this.handleDeleteDrop(e)}
          onDragOver={(e) => this.handleDragOver(e)}
        >
          Drag Here to Delete Employee
        </div>

        <div
          className={styles.createBox}
          draggable
          onDragStart={(e) => this.handleDragStart(e)}
        >
          Drag to Create Employee
        </div>
      </div>
      
    )

  }

}

export default Menu