export function buildTrees(employees) {
  let trees = []
  employees.forEach((employee, index) => {
    if (employee.parent === 0) {
      employees.splice(index, 1)
      trees.push(employee)
    }
  })
  trees.forEach((root, index) => {
    root.children = getChildren(root.id, employees)
  })
  return trees
}

function getChildren(id, employees) {
  let children = []
  employees.forEach((employee, index) => {
    // Get the children
    if (employee.parent === parseInt(id)) {
      children.push(employee)
    }
  })

  // Remove children from employees array as they have been placed in the right place
  children.forEach((child, index) => {
    employees.splice(employees.indexOf(child), 1)
  })
  
  // Get the children of the children
  // This could be called in the first loop, but then you have to iterate over everything again
  // This does each level of the tree, so the size of the array you have to search through
  // Decreases each new depth you go
  children.forEach((child, index) => {
    child.children = getChildren(child.id, employees)
  })

  return children
}