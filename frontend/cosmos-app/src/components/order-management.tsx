import React from 'react';
import { useEffect } from 'react';
import { createOrder, getOrders } from '../services/order-service';

function OrderManagement() {
    const [customerId, setCustomerId] = React.useState("");
    const [productId, setProductId] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    var [orders, setOrders] = React.useState("");

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
            console.log(response.data);
        } catch (error) {
            alert('Error submitting order: ' + error);
        }
    } 

    useEffect(() => {
        fetchOrders();
    }, 
    []) 

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            orders = response.data;
            console.log("orders: " + orders[0].id);
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
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Customer ID</th>
                        <th>Order Date</th>
                    </tr>
                    
                </table>
            </div>
        </>
    )
}

export default OrderManagement;