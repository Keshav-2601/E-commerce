import React, { Component } from "react";
import { Foot } from "../Components/Footer";
import { Head } from "../Components/Header";
import { SERVER_URL } from "../Services/helpers";
import '../productInfo.scss';
import { toast } from "react-toastify";

class ProductInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productID: window.location.pathname.split("/")[2],
            product: {},
            imageUrl: '',
            quantity: 1,
        }
    }

    fetchProductDetails = async () => {

        fetch(`${SERVER_URL}product/get-details/${this.state.productID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    this.setState({
                        product: json.data,
                        imageUrl: json.data.images[0]
                    })
                }
            })

    }

    handleAddToCart = () => {
        fetch(`${SERVER_URL}cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({
                itemID: this.state.productID,
                quantity: this.state.quantity
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    toast.success(json.message);
                } else {
                    toast.error(json.message);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Server Error");
            })
    }

    componentDidMount() {
        this.fetchProductDetails();
    }

    render() {

        if (!this.state.product) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        }

        const { name, description, images, price, size, gender, color, totalStock } = this.state.product;

        return (
            <>
                <Head />
                <div className="product-details">

                    <div className="image-viewer">

                        <img src={this.state.imageUrl} alt="" />

                        <div className="switcher">

                            {
                                images?.map((data, index) => {
                                    return (
                                        <button className={data === this.state.imageUrl ? "switch active" : "switch"} key={index} onClick={
                                            () => {
                                                this.setState({
                                                    imageUrl: data
                                                })
                                            }
                                        }>
                                            <img src={data} alt="" />
                                        </button>
                                    )
                                })
                            }

                        </div>

                    </div>

                    <div className="details">

                        <h2>{name}</h2>
                        <h3>$ {price}</h3>

                        <p>{description}</p>

                        <div className="product-info">

                            <div className="pill-view-main">

                                <p className="pill-view-head">
                                    Size
                                </p>

                                <div className="pill-view">

                                    {
                                        size?.map((data, index) => {
                                            return (
                                                <div className="pill" key={index}>{data}</div>
                                            )
                                        })
                                    }

                                </div>

                            </div>

                            <div className="pill-view-main">

                                <p className="pill-view-head">
                                    Gender
                                </p>

                                <div className="pill-view">

                                    {
                                        gender?.map((data, index) => {
                                            return (
                                                <div className="pill" key={index}>{data}</div>
                                            )
                                        })
                                    }

                                </div>

                            </div>

                            <div className="pill-view-main">

                                <p className="pill-view-head">
                                    Color
                                </p>

                                <div className="pill-view">

                                    {
                                        color?.map((data, index) => {
                                            return (
                                                <div className="pill" key={index}>{data}</div>
                                            )
                                        })
                                    }

                                </div>

                            </div>

                        </div>

                        <div className="quantity-selector">

                            <button className="quantity-selector-button" onClick={() => {
                                if (this.state.quantity === 1) {
                                    return;
                                }
                                this.setState({ quantity: this.state.quantity - 1 })
                            }}>-</button>

                            <div className="quantity-selector-button">{this.state.quantity}</div>

                            <button className="quantity-selector-button" onClick={() => {
                                if (this.state.quantity === totalStock) {
                                    toast.error("You can't add more than the available stock");
                                    return;
                                }
                                this.setState({ quantity: this.state.quantity + 1 })
                            }}>+</button>

                        </div>

                        <button className="add-button" onClick={this.handleAddToCart}>Add To Cart</button>

                    </div>
                    
                </div>
                <Foot />
            </>
        )
    }
}
export { ProductInfo };