import { httpService } from './http.service'

export const orchestraService = {
  query,
  getById,
}

async function query(filterBy = {}) {
  try {
    return await httpService.get('orchestras', filterBy)
  } catch (err) {
    console.error('Failed to get orchestras:', err)
    throw new Error('Failed to get orchestras')
  }
}

async function getById(id) {
  try {
    return await httpService.get(`orchestras/${id}`)
  } catch (err) {
    console.error('Failed to get orchestra:', err)
    throw new Error('Failed to get orchestra')
  }
}