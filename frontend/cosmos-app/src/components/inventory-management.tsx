import React from 'react';
import { useEffect } from 'react';
import { adddToInventory, getFromInventory } from '../services/inventory-service';

function InventoryManagement() {
    const [productName, setProductName] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    const [inventory, setInventory] = React.useState([]);

    const handleAddToInventory = async (e) => {
        e.preventDefault();
        
        const product = {
            name: productName,
            price,
            quentity: quantity
        }

        try {
            const response = await adddToInventory(product);
            alert('Product added successfully');
            window.location.reload();
        } catch (error) {
            alert('Error adding product: ' + error);
        }
    } 

    useEffect(() => {
        fetchOrders();
    }, 
    []) 

    const fetchOrders = async () => {
        try {
            const response = await getFromInventory();
            
            setInventory(response.data);
        }
        catch(error) {
            alert("Error in getting inventory details: " + error);
        }
    }
    return (
        <>
            <h3>Add to Inventory</h3>
            <form onSubmit={ handleAddToInventory }>
                <label htmlFor="product_name">Product Name</label>
                <input type="text" id="prod_name" name="prod_name" value={productName} onChange={ (e) => setProductName(e.target.value)} required /><br/><br/>

                <label htmlFor="price">Price</label>
                <input type="text" id="price" name="price" value={price} onChange={ (e) => setPrice(e.target.value)} required /><br/><br/>

                <label htmlFor="quantity">Quantity</label>
                <input type="text" id="quantity" name="quantity" value={quantity} onChange={ (e) => setQuantity(e.target.value)} required /><br/><br/>

                <input type="submit" value="Add Product" />
            </form> 

            <div>
                <h3>Inventory Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.quentity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default InventoryManagement;