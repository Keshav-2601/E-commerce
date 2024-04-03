import React from "react";
import { Component } from "react";
import { Head } from "./Header";
import { Foot } from "./Footer";
import { Link, Navigate } from "react-router-dom";

import './productCard.scss';

class ProductCard extends Component {

    constructor() {
        super();
    }

    render() {

        const { name, price, description, images, _id } = this.props.data;
        return (
            <>
                <div className="product-card">
                    <img src={images[0]} />
                    <div className="product-info">
                        <div className="product-details-card">
                            <h1>{name}</h1>
                        </div>
                        <div className="product-subdetails">
                            $ {price}
                        </div>
                    </div>
                    <Link to={`/productinfo/${_id}`} className="link">View Product</Link>
                </div>
            </>
        )
    }
}
export default ProductCard;