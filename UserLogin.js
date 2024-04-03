import React from "react";
import { Component } from "react";
import { Foot } from "../Components/Footer";
import { toast } from 'react-toastify';
import { Navigate } from "react-router-dom";
import { MainContext } from "../Contexts/MainContext";
import { SERVER_URL } from "../Services/helpers";

let emailref = React.createRef();
let password = React.createRef();

class UserLogin extends Component {

    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = {
             redirectToHome: false,
             backsignup:false
             }
    }

    handeluserLogin = (e) => {
        e.preventDefault()

        fetch(`${SERVER_URL}user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailref.current.value,
                password: password.current.value,
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    toast.success(json.message);
                    localStorage.setItem('auth-token', json.token);
                    this.context.fetchUserProfile(json.token);
                    this.setState({ redirectToHome: true })
                } else {
                    toast.error(json.message);
                }
            })
    }
    signuppage=()=>{
        this.setState({
          backsignup:true
        })
    }
    render() {
        return (
            <>
                {this.state.redirectToHome ? <Navigate to='/' /> : null}
                {this.state.backsignup? <Navigate to='/signup'/>:null}
                {localStorage.getItem('auth-token') ? <Navigate to='/' /> : null}
                <div>
                    <div className='Heading'>

                        <h3 id="Adidas" style={{ color: 'red' }}>H&M</h3>
                    </div>

                    <form method="POST" className="userInputForm" onSubmit={this.handeluserLogin}>
                        <label>Email</label>
                        <input ref={emailref} type="email" placeholder="abc@gmail.com"></input>
                        <label>Password</label>
                        <input ref={password} type="password"></input>
                        <button type="submit">Submit</button>
                        <p style={{ color: 'blue', cursor: "pointer", position: "relative", left: 650, top: -10 }} onClick={this.signuppage}>Don't have Account?create Account</p>
                    </form>

                    <Foot />
                </div>
            </>
        )
    }
}
export { UserLogin };