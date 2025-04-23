import axios from 'axios'

const API = 'http://localhost:5002/api/vocab'

export const getAllWords = () => axios.get(API)
export const addWord = (word) => axios.post(API, word)
export const getRandomWord = () => axios.get(`${API}/random`)
