import { Navigate, Outlet } from "react-router-dom"
import { MainContext } from "../Contexts/MainContext";
import { Component } from "react";

class UserAuth extends Component {
    static contextType = MainContext;

    token = localStorage.getItem('auth-token');

    render() {
        return (
            this.token ? <Outlet /> : <Navigate to="/login" />
        );
    }
}

export default UserAuth;