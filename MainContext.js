import React, { createContext } from "react";
import { SERVER_URL } from "../Services/helpers";

const MainContext = createContext();

class MainContextProvider extends React.Component {

    state = {
        user: null,
        userType: null,
        userAccessCode: 1,
        products: [],
        cart: []
    }

    fetchUserProfile = async (token) => {

        fetch(`${SERVER_URL}user/profile`, {
            method: 'GET',
            headers: {
                'auth-token': token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    this.setState({
                        user: json.data,
                        userType: json.data.isAdmin ? 'admin' : 'user',
                        userAccessCode: json.data.userTypeCode
                    })
                    if (json.data.isAdmin) {
                        sessionStorage.setItem('isAdmin', true);
                        sessionStorage.setItem('userType', 'admin');
                        sessionStorage.setItem('userAccessCode', json.data.userTypeCode);
                    }
                } else {
                    localStorage.removeItem('auth-token');
                }
            })
            .catch(err => console.log(err))

    }


    fetchProducts = async () => {

        fetch(`${SERVER_URL}product/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    this.setState({
                        products: json.data
                    })
                }
            })
            .catch(err => console.log(err))
    }

    token = localStorage.getItem('auth-token');

    fetchCart = async () => {

        fetch(`${SERVER_URL}cart`, {
            method: 'GET',
            headers: {
                'auth-token': this.token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    this.setState({
                        cart: json.data
                    })
                }
            })
            .catch(err => console.log(err))

    }

    updateProduct = (newData) => {

        this.setState({
            products: newData
        })

    }

    updateUser = (newData) => {

        this.setState({
            user: newData
        })

    }

    componentDidMount() {

        this.fetchProducts();

        if (this.token) {
            this.fetchUserProfile(this.token);
        }

    }

    render() {
        return (
            <MainContext.Provider value={{ ...this.state, fetchUserProfile: this.fetchUserProfile, fetchCart: this.fetchCart, fetchProducts: this.fetchProducts, updateProduct: this.updateProduct, updateUser: this.updateUser }}>
                {this.props.children}
            </MainContext.Provider>
        )
    }

}

export { MainContext, MainContextProvider };