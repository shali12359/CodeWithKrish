import axios from 'axios';

const baseUrl = "http://localhost:3000/orders";

const createOrder = async (order) => {
    return axios.post(baseUrl, order);
}

const getOrders = async () => {
    return axios.get(baseUrl);
}

// update order status
const updateOrderStatus = async (id, status) => {
    const requestBody = {
        status: status
    }

    return axios.patch(`${baseUrl}/${id}/status`, requestBody);
}

export {createOrder, getOrders, updateOrderStatus}