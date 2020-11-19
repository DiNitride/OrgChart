import { handleResp, encodeFormBody, handleError } from './apiUtils'

const API_URL = process.env.API_URL || 'http://localhost:8000/'

export function getAllEmployees() {
  return fetch(API_URL + "employees")
    .then(handleResp)
    .catch(handleError)
}

export function getEmployee(id) {
  return fetch(API_URL + "employees/" + id)
    .then(handleResp)
    .catch(handleError)
}

export function createEmployee(employee) {
  return fetch(API_URL + "employees/",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeFormBody(employee)
    })
    .then(handleResp)
    .catch(handleError)
}

export function deleteEmployee(id) {
  return fetch(API_URL + "employees/" + id,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(handleResp)
    .catch(handleError)
}

export function swapEmployees(aID, bID, keepChildren) {
  let body = {'employee_a': aID, 'employee_b': bID, 'keep_children': keepChildren}
  return fetch("http://localhost:8000/employees/swap",
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeFormBody(body)
    })
    .then(handleResp)
    .catch(handleError)
}

export function editEmployee(employee) {
  return fetch("http://localhost:8000/employees/" + employee.id,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeFormBody(employee)
    })
    .then(handleResp)
    .catch(handleError)
}

