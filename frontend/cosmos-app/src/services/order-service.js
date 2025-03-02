import axios from 'axios';

const baseUrl = "http://localhost:3000/orders";

const createOrder = async (order) => {
    return axios.post(baseUrl, order);
}

const getOrders = async () => {
    return axios.get(baseUrl);
}

export {createOrder, getOrders}