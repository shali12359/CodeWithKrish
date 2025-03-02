import axios from 'axios';

const baseUrl = "http://localhost:3002/customers";

const adddCustomer = async (customer) => {
    return axios.post(baseUrl, customer);
}

const getCustomers = async () => {
    return axios.get(baseUrl);
}

export { adddCustomer, getCustomers }