import axios from 'axios';
const baseUrl = process.env.REACT_APP_BASEURLDEV;

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

export { getAll };
