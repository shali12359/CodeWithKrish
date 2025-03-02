import React from 'react';
import { useEffect } from 'react';
import { createOrder, getOrders, updateOrderStatus } from '../services/order-service';
import { useNavigate } from "react-router-dom";

function OrderManagement() {
    const [customerId, setCustomerId] = React.useState("");
    const [productId, setProductId] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    const [orderStatus, setOrderStatus] = React.useState("");
    const [updateId, setUpdateId] = React.useState("");
    const [orders, setOrders] = React.useState([]);

    // 1 - call create order endpoint
    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        console.log('Order submitted');
        
        const order = {
            customerId: customerId,
            Items: [
                {
                    productId,
                    price,
                    quentity: quantity
                }
            ]
        }

        try {
            const response = await createOrder(order);
            alert('Order placed successfully');
            window.location.reload();
        } catch (error) {
            alert('Error submitting order: ' + error);
        }
    } 

    // set update product id
    const handleUpdateButton = async (id) => {
        setUpdateId(id)
    }

    // set change value of order status dropdown
    const handleStatusChange = (event) => {
        setOrderStatus(event.target.value);
    };

    // 2 - call order status update endpoint
    const handleUpdateOrderStatusSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await updateOrderStatus(updateId, orderStatus);
            
            if (response.data.id) {
                alert("Product status updated");
                window.location.reload();
            }
        }
        catch(error) {
            alert("Error in getting order details: " + error);
        }
    }

    // get order data
    useEffect(() => {
        fetchOrders();
    }, 
    []) 

    // 3 - call get order details endpoint
    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data);
        }
        catch(error) {
            alert("Error in getting order details: " + error);
        }
    }
    
    return (
        <>
            <h3>Create Order</h3>
            <form onSubmit={ handleOrderSubmit }>
                <label htmlFor="cus_id">Customer ID</label>
                <input type="text" id="cus_id" name="cus_id" value={customerId} onChange={ (e) => setCustomerId(e.target.value)} required /><br/><br/>

                <label htmlFor="prod_id">Product ID</label>
                <input type="text" id="prod_id" name="prod_id" value={productId} onChange={ (e) => setProductId(e.target.value)} required /><br/><br/>

                <label htmlFor="price">Price</label>
                <input type="text" id="price" name="price" value={price} onChange={ (e) => setPrice(e.target.value)} required /><br/><br/>

                <label htmlFor="quantity">Quantity</label>
                <input type="text" id="quantity" name="quantity" value={quantity} onChange={ (e) => setQuantity(e.target.value)} required /><br/><br/>

                <input type="submit" value="Submit Order" />
            </form> 

            <div>
                <h3>Order Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer ID</th>
                            <th>Created At</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.customerId}</td>
                                <td>{item.createdAt}</td>
                                <td>{item.status}</td>
                                <td>
                                    <button onClick={() => handleUpdateButton(item.id)}>
                                        Update Status
                                    </button>    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
            <h3>Update Order Status</h3>
            <form onSubmit={ handleUpdateOrderStatusSubmit }>
                <label htmlFor="order_id">Order ID</label>
                <input type="text" id="order_id" name="order_id" value={updateId} required disabled="disabled"/><br/><br/>
                
                <label htmlFor="order_status">Order Status</label>
                <select name="category" value={orderStatus} onChange={handleStatusChange}>
                    <option value="" >Select Status</option>
                    <option value="PENDING" >PENDING</option>
                    <option value="CONFIRMED" >CONFIRMED</option>
                    <option value="SHIPED" >SHIPED</option>
                    <option value="DELIVERED" >DELIVERED</option>
                    <option value="CANCELED" >CANCELED</option>
                </select>

                <input type="submit" value="Update Order Status" />
            </form>
            </div>
        </>
    )
}

export default OrderManagement;