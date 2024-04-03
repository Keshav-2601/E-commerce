import { Component } from "react";
import React from "react";
import { Navigate } from "react-router-dom";
import { Foot } from "../Components/Footer";
import { toast } from 'react-toastify'
import { MainContext } from "../Contexts/MainContext";
import { SERVER_URL } from "../Services/helpers";

let emailref = React.createRef();
let password = React.createRef();
let name = React.createRef();


class Signup extends Component {

    static contextType = MainContext;

    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            userTypeCode: '',
            redirectToLogin: false,
            directtologin:false
        };
    }
    handelsignup = (e) => {
        e.preventDefault();
        fetch(`${SERVER_URL}user/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.current.value,
                email: emailref.current.value,
                password: password.current.value
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    toast.success(json.message)
                    this.setState({ redirectToLogin: true })
                } else {
                    toast.success(json.message)
                }
            })
    }
    loginpage=()=>{
         this.setState({
            directtologin:true
         })
    }
    render() {
        return (
            <>
                {this.state.redirectToLogin ? <Navigate to="/login" /> : null}
                {this.state.directtologin?<Navigate to='/login'/>:null}
                {localStorage.getItem('auth-token') ? <Navigate to='/' /> : null}
                <div className="Form">
                    <div className='Heading'>
                        <h3 id="Adidas" style={{ color: 'red' }}>H&M</h3>
                    </div>
                    <form className="userInputForm" method="POST" onSubmit={this.handelsignup} >
                        <label>Name</label>
                        <input ref={name} type="text" name="name" placeholder="Name" />
                        <label>Email</label>
                        <input ref={emailref} type="email" name="email" placeholder="abc@gmail.com" />
                        <label>Password</label>
                        <input ref={password} type="password" name="password" />
                        <button type="submit">Submit</button>
                        <p style={{ color: 'blue', cursor: "pointer", position: "relative", left: 650, top: -10 }} onClick={this.loginpage}>Already have an account? Login</p>
                    </form>

                    <Foot />
                </div>
            </>
        );
    }
}

export { Signup };