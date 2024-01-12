import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/jobs'
const baseUrlDeply = 'https://job-webscraper-backend.onrender.com/api/jobs'

const getAll = async () => {
    const response = await axios.get(baseUrlDeply)
    return response.data
};

export { getAll }
