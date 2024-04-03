import { Navigate, Outlet } from "react-router-dom"
import { MainContext } from "../Contexts/MainContext";
import { Component } from "react";

class AdminAuth extends Component {

    static contextType = MainContext;

    token = localStorage.getItem('auth-token');

    render() {
        return (
            this.token && this.context.userAccessCode === 2 && sessionStorage.getItem('isAdmin') && sessionStorage.getItem('userType') === 'admin' ? <Outlet /> : <Navigate to="/login" />
        );
    }
}

export default AdminAuth;