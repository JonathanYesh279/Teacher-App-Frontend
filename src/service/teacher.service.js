import { httpService } from './http.service'

export const teacherService = {
  query,
  getById,
  add,
  remove,
  update,
}

async function query(filterBy = {}) {
  try {
    return await httpService.get('teachers', filterBy)
  } catch (err) {
    console.error('Failed to get teachers:', err)
    throw new Error('Failed to get teachers')
  }
}

async function getById(id) {
  try {
    return await httpService.get(`teachers/${id}`)
  } catch (err) {
    console.error('Failed to get teacher:', err)
    throw new Error('Failed to get teacher')
  }
}

async function add(teacher) {
  try {
    return await httpService.post('teachers', teacher)
  } catch (err) {
    console.error('Failed to add teacher:', err)
    throw new Error('Failed to add teacher')
  }
}

async function remove(teacherId) {
  try {
    return await httpService.delete(`teachers/${teacherId}`)
  } catch (err) {
    console.error('Failed to remove teacher:', err)
    throw new Error('Failed to remove teacher')
  }
}

async function update(teacher) {
  try {
    return await httpService.put(`teachers/${teacher._id}`, teacher)
  } catch (err) {
    console.error('Failed to update teacher:', err)
    throw new Error('Failed to update teacher')
  }
}