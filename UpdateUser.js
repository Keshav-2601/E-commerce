import React, { Component } from "react";
import { toast } from 'react-toastify'
import { Head } from "../Components/Header";
import { Foot } from "../Components/Footer";
import { SERVER_URL } from "../Services/helpers";

let name = React.createRef();
let address = React.createRef();

class UpdateUser extends Component {
    constructor() {
        super();
    }
    handleUpdateUser = (e) => {
        e.preventDefault();
        console.log(localStorage.getItem("auth-token"));
        fetch(`${SERVER_URL}user/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('auth-token')
            },
            body: JSON.stringify({
                name: name.current.value,
                address: address.current.value
            })
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    toast.success(json.message)
                } else {
                    toast.error(json.message)
                }
            });
    }

    render() {
        return (
            <>
                <Head />
                <div>
                    <h1>Update Pofile</h1>
                    <form method="POST" className="userInputForm" onSubmit={this.handleUpdateUser}>
                        <label>UserName</label>
                        <input ref={name} type="text" />
                        <label>Address</label>
                        <input ref={address} type="text" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <Foot />
            </>
        )
    }
}
export { UpdateUser };