data = [
  {"id":"52","forename":"Big","surname":"Boss","position":"CEO","joiningDate":"2002-12-04","parent":0},
  {"id":"53","forename":"test","surname":"abcdef","position":"MD","joiningDate":"2002-02-15","parent":52},
  {"id":"54","forename":"a","surname":"a","position":"MD","joiningDate":"2002-02-15","parent":52},
  {"id":"56","forename":"c","surname":"c","position":"SM","joiningDate":"2002-02-15","parent":54},
  {"id":"57","forename":"d","surname":"d","position":"MD","joiningDate":"2002-02-15","parent":58},
  {"id":"58","forename":"e","surname":"e","position":"SM","joiningDate":"2002-02-15","parent": 0},
  {"id":"59","forename":"fa","surname":"fa","position":"SM","joiningDate":"2002-02-15","parent":54},
  {"id":"61","forename":"h","surname":"h","position":"SM","joiningDate":"2002-02-15","parent": 58},
  {"id":"62","forename":"test","surname":"name","position":"SM","joiningDate":"2002-12-04","parent":52}
]

function buildTrees(employees) {
  let trees = []
  console.log(employees.length)
  employees.forEach((employee, index) => {
    if (employee.parent === 0) {
      employees.splice(index, 1)
      trees.push(employee)
      console.log(employees.length)
    }
  })
  trees.forEach(async (root, index) => {
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

console.log(buildTrees(data))