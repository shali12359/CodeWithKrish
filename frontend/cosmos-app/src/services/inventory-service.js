import axios from 'axios';

const baseUrl = "http://localhost:3001/products";

const adddToInventory = async (product) => {
    return axios.post(baseUrl, product);
}

const getFromInventory = async () => {
    return axios.get(baseUrl);
}

export { adddToInventory, getFromInventory }