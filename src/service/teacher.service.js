import { httpService } from './http.service'

export const teacherService = {
  query,
  getById,
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