import { httpService } from './http.service'

export const studentService = {
  query,
  getById,
  add,
  update,
  remove
}

async function query(filterBy = {}) {
  try {
    return await httpService.get('students', filterBy)
  } catch (err) {
    console.error('Failed to get students:', err)
    throw new Error('Failed to get students')
  }
}

async function getById(id) {
  try {
    return await httpService.get(`students/${id}`)
  } catch (err) {
    console.error('Failed to get student:', err)
    throw new Error('Failed to get student')
  }
}

async function add(student) {
  try {
    return await httpService.post('students', student)
  } catch (err) {
    console.error('Failed to add student:', err)
    throw new Error('Failed to add student')
  }
}

async function update(student) {
  try {
    return await httpService.put(`students/${student._id}`, student)
  } catch (err) {
    console.error('Failed to update student:', err)
    throw new Error('Failed to update student')
  }
}

async function remove(studentId) {
  try {
    return await httpService.delete(`students/${studentId}`)
  } catch (err) {
    console.error('Failed to remove student:', err)
    throw new Error('Failed to remove student')
  }
}