import axios from 'axios'
import Strings from './strings'
export const doGet = (url, headers) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { headers })
      .then(async (response) => {
        if (response && response.status === 200) {
          return resolve(response?.data || null)
        }
        return resolve(null)
      })
      .catch(async (error) => {
        reject(error)
      })
  })
}

export const doPost = (url, data, authToken) => {
  const headers = { 'Content-Type': 'application/json' }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, { headers })
      .then(async (response) => {
        if (response && (response.status === 200 || response.status === 201)) {
          return resolve(response?.data)
        }
        return reject(
          new Error(response?.data?.message || Strings.errorMessages.wentWrong),
        )
      })
      .catch(async (error) => {
        reject(error)
      })
  })
}
