import React from 'react';
import { useEffect } from 'react';
import { adddCustomer, getCustomers } from '../services/customer-service';

function CustomerManagement() {
    const [customerName, setcustomerName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [customers, setcustomers] = React.useState([]);

    const handleAddCustomerSubmit = async (e) => {
        e.preventDefault();
        
        const customer = {
            name: customerName,
            email,
            address
        }

        try {
            const response = await adddCustomer(customer);
            alert('Customer added successfully');
            window.location.reload();
        } catch (error) {
            alert('Error adding customer: ' + error);
        }
    } 

    useEffect(() => {
        fetchOrders();
    }, 
    []) 

    const fetchOrders = async () => {
        try {
            const response = await getCustomers();

            setcustomers(response.data);
        }
        catch(error) {
            alert("Error in getting customer details: " + error);
        }
    }
    return (
        <>
            <h3>Add Customer</h3>
            <form onSubmit={ handleAddCustomerSubmit }>
                <label htmlFor="cus_name">Customer Name</label>
                <input type="text" id="cus_name" name="cus_name" value={customerName} onChange={ (e) => setcustomerName(e.target.value)} required /><br/><br/>

                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" value={email} onChange={ (e) => setEmail(e.target.value)} required /><br/><br/>

                <label htmlFor="address">Address</label>
                <input type="text" id="address" name="address" value={address} onChange={ (e) => setAddress(e.target.value)} required /><br/><br/>

                <input type="submit" value="Add Customer" />
            </form> 

            <div>
                <h3>Customer Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Email Address</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default CustomerManagement;