import axios from 'axios';
const baseUrl =
    process.env.MODE === 'development'
        ? process.env.REACT_APP_BASEURLDEV
        : process.env.REACT_APP_BASEURLDEPLOY;

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

export { getAll };
