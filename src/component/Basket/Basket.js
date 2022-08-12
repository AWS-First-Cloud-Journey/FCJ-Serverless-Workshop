import { useNavigate } from "react-router-dom";
import React from "react";
import config from '../../config'
import axios from 'axios';

function Basket(props) {
    const navigate = useNavigate();
    const { currentItemInCart, onAdd, onRemove, checkOut } = props;
    const itemsPrice = currentItemInCart.reduce((prev, next) => prev + next.qty * next.price, 0);
    const shippingPrice = itemsPrice > 2000 ? 0 : 10;
    const totalPrice = itemsPrice + shippingPrice;
    const redirectPage = () => {
        navigate('/');
    }

    async function sendOrderToServer(e) {
        e.preventDefault();
        var order_data = [];
        currentItemInCart.map((item) => order_data.push({id: item.id, name: item.name, qty: item.qty}))
        
        try {
            const response = await axios({
                method: 'post',
                url: `${config.APP_API_URL}/books/order`,
                data: {
                    books: order_data,
                    price: totalPrice.toFixed(2)
                },
                headers: { "Content-Type": "application/json" }
            })
            
            const status = response.status
            if (status === 200)
            {
                alert("Checkout successfully")
                checkOut();
                redirectPage();
            }
            else
            {
                alert("Error Occured while checkout the books")
            }
        } catch (e) {
            console.log(e)
            alert("Error Occured while checkout the books")
        }
        
    }
    return (
        <div className="container pt-5">
            <div class="d-flex justify-content-center">
                <div class="col-md-9">
                    <h2>Cart Items</h2>
                    {currentItemInCart.length === 0 && <div>Cart is empty</div>}
                    {currentItemInCart.map((item) => (
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item col-4">{item.name}</li>
                            <li className="list-group-item col-2 text-center">
                                <button className="btn btn-secondary btn-sm" onClick={() => onRemove(item)} >
                                    -
                                </button>{' '}
                                &nbsp;
                                <button className="btn btn-secondary btn-sm" onClick={() => onAdd(item)}>
                                    +
                                </button>
                            </li>
                            <li className="list-group-item col-3 text-end">
                                {item.qty} x ${Number(item.price).toFixed(2)}
                            </li>
                        </ul>
                    ))}
                    {currentItemInCart.length !== 0 && 
                        <>
                        <hr className="col-9"></hr>
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item col-6">Items Price</li>
                            <li className="list-group-item col-3 text-end">${itemsPrice.toFixed(2)}</li>
                        </ul>
                        <ul className="list-group list-group-horizontal">   
                            <li className="list-group-item col-6">Shipping Price</li>
                            <li className="list-group-item col-3 text-end">${shippingPrice.toFixed(2)}</li>
                        </ul>
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item col-6 fw-bold">Total Price</li>
                            <li className="list-group-item col-3 text-end fw-bold">
                                ${totalPrice.toFixed(2)}
                            </li>
                        </ul>
                        <hr className="col-9"></hr>
                        <div class="d-grid gap-2 col-9">
                            <button className="btn btn-warning" onClick={sendOrderToServer}>
                                Checkout
                            </button>
                        </div>
                        </> 
                    }
                </div>
            </div>
        </div>
    );
}

export default Basket;
