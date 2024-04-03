import React from "react";
import { Component } from "react";
import { Head } from "../Components/Header";
import { Foot } from "../Components/Footer";
import './cartPage.scss';
import { MainContext } from "../Contexts/MainContext";
import { Link, Navigate } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import { SERVER_URL } from "../Services/helpers";
import { toast } from "react-toastify";

class CartComponent extends Component {

    static contextType = MainContext;

    constructor() {
        super();
        this.state={
            paypalpage:false
        }
    }

    deleteCartItem = () => {
        fetch(`${SERVER_URL}cart/update/${this.props.data._id}/${0}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            }
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    toast.success(json.message);
                    this.context.fetchCart();
                }
            })
    }

    render() {

        const { _id, product, quantity } = this.props.data;

        return (
            <>
                <div className="cart-item">

                    <div className="product-info">

                        <img src={product.images[0]} alt="product" />

                        <div className="cart-item-details">
                            <h4>{product.name}</h4>
                            <p>$ {product.price}</p>
                        </div>

                    </div>

                    <div className="order-info">

                        <div className="cart-item-details-final">
                            <p>Quantity : {quantity}</p>
                            <p>Total : $ {Number(product.price) * Number(quantity)}</p>
                        </div>
                        <div className="options">
                            <button onClick={() => this.deleteCartItem()} className="buttons"><FaTrash /></button>
                            <Link className="buttons" to={`/productinfo/${product._id}`}><FaEye /></Link>
                        </div>

                    </div>
                </div>
            </>
        )

    }

}

class Cart extends Component {
    static contextType = MainContext;
    constructor() {
        super();
    }

    componentDidMount() {
        this.context.fetchCart();
    }
    Paypal=()=>{
        this.setState({
            paypalpage:true
        })
    }
    render() {
        
        const { cart } = this.context;

        if (cart.length === 0) {
            return (

                <>
                    {/* {this.state.paypalpage?<Navigate to={'/buy'}/>:""}; */}
                    <Head />
                    <div className="cart-body">
                        <h1>Your cart is empty</h1>
                        <Link to='/' className="">Explore Items</Link>
                    </div>
                    
                    <Foot />
                </>
            )
        }

        return (
            <>
                <Head />

                <div className="cart-body">
                    {cart?.map((data) => {
                        return (
                            <CartComponent key={data._id} data={data} />
                        )
                    })}
                    <button onClick={this.Paypal} className="buy-button">BUY</button>
                    
                </div>

                <Foot />
            </>
        )
    }
}
export { Cart };