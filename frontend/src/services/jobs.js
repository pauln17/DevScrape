import axios from "axios";
const baseUrl =
  process.env.REACT_APP_MODE === "development"
    ? process.env.REACT_APP_BASEURLDEV
    : process.env.REACT_APP_BASEURLDEPLOY;

const getAll = async () => {
  console.log(baseUrl, process.env.REACT_APP_MODE);
  const response = await axios.get(baseUrl);
  return response.data;
};

export { getAll };
