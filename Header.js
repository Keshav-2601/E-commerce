import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser, faHeart, faEnvelope, faAddressBook, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
import { FaPersonBooth, FaShoppingCart, FaUser } from 'react-icons/fa';
import ReactModal from 'react-modal';
import { Link, Navigate } from "react-router-dom";
import { MainContext } from "../Contexts/MainContext";
import { SERVER_URL } from "../Services/helpers";
import Modal from '@mui/material/Modal';
import { toast } from "react-toastify";

let inputUser = React.createRef();
let inputEmail = React.createRef();
let inputAddress = React.createRef();
let inputPassword = React.createRef();

class Head extends React.Component {

    static contextType = MainContext;

    constructor() {
        super();
        this.state = {
            userModal: false,
            formData: {
                email: '',
                password: '',
                name: '',
                userTypeCode: '',
            },
            query: null,
            token: '',
            message: '',
            options: {
                size: [],
                gender: [],
                price: 0,
                color: [],
                brand: []
            },
            redirect: false
        };

    }

    openUserModal = () => {
        this.setState({ userModal: true });
    }

    closeUserModal = () => {
        this.setState({ userModal: false });
    }

    handleSearch = async (query, options) => {
        try {
            if (query === '' || !options.size || !options.gender) {
                this.context.fetchProducts();
                return;
            }

            const response = await fetch(`${SERVER_URL}product/search/${query}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(options)
            });

            const json = await response.json();

            if (json.success) {
                if (json.data.length === 0) {
                    toast.error('Products Not Found');
                    this.context.fetchProducts();
                } else {
                    this.context.updateProduct(json.data);
                }
            }
        } catch (error) {
            console.error(error);
            // Handle other error scenarios (e.g., network issues)
        }
    };

    searchData = [
        {
            name: 'Size',
            data: [{
                name: 'Small',
                value: 'small'
            }, {
                name: 'Medium',
                value: 'medium'
            }, {
                name: 'Large',
                value: 'large'
            }]
        },
        {
            name: 'Gender',
            data: [{
                name: 'Male',
                value: 'M',
            },
            {
                name: 'Female',
                value: 'F',
            },
            {
                name: 'Others',
                value: 'O',
            }]
        },
        {
            name: 'Price',
            data: [{
                name: '1000',
                value: '1000',
            },
            {
                name: '2000',
                value: '2000',
            },
            {
                name: '3000',
                value: '3000',
            },
            {
                name: '4000',
                value: '4000',
            },
            {
                name: '5000',
                value: '5000',
            }],
        },
        // {
        //     name: 'Color',
        //     data: [{
        //         name: 'Red',
        //         value: 'red',
        //     },
        //     {
        //         name: 'Blue',
        //         value: 'blue',
        //     },
        //     {
        //         name: 'Green',
        //         value: 'green',
        //     },
        //     {
        //         name: 'Yellow',
        //         value: 'yellow',
        //     }],
        // },
        // {
        //     name: 'Brand',
        //     data: [{
        //         name: 'Nike',
        //         value: 'nike',
        //     },
        //     {
        //         name: 'Puma',
        //         value: 'puma',
        //     },
        //     {
        //         name: 'Adidas',
        //         value: 'adidas',
        //     },
        //     {
        //         name: 'Reebok',
        //         value: 'reebok',
        //     }]
        // }
    ]

    onChangeSearchOption = (e, index, index1) => {

        const searchData = this.searchData;

        const fieldName = searchData[index].name.toLowerCase();

        const { name, value } = searchData[index].data[index1];

        const isChecked = e.target.checked;

        const options = { ...this.state.options };

        if (!options[fieldName]) {
            options[fieldName] = [];
        }

        if (isChecked) {
            options[fieldName].push(value);
        } else {
            options[fieldName] = options[fieldName].filter(option => option !== value);
        }

        if (options[fieldName].length === 0) {
            delete options[fieldName];
        }

        this.setState({ options }, () => {
            this.handleSearch(this.state.query, options);
        });

    }

    render() {

        const { user, userType, products } = this.context;

        return (
            <>
                {this.state.redirect ? <Navigate to='/login' /> : null}
                <header>

                    <h3>H&M</h3>


                    <nav>

                        <div>
                            {
                                window.location.pathname.length === 1 && window.location.pathname === '/' ?
                                    < div className="search-input">
                                        {/* search */}
                                        <input type="text" placeholder="Search"
                                            onChange={(e) => {
                                                this.setState({ query: e.target.value })
                                                this.handleSearch(e.target.value, this.state.options)
                                            }}
                                        />
                                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    </div>
                                    : null
                            }
                        </div>

                        <div className="nav-icons">
                            {/* icons */}
                            <Link to='/cart'>
                                <FaShoppingCart className="icon" />
                            </Link>

                            <button onClick={this.openUserModal}>
                                <FaUser className="icon" />
                            </button>

                            <Modal
                                open={this.state.userModal}
                                onClose={this.closeUserModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                className="user-modal-container"
                            >
                                <div className="user-modal">

                                    {
                                        localStorage.getItem('auth-token') ? <div className="head-modal">

                                            <h3>{user?.name}</h3>

                                            {
                                                userType === 'admin' ? <Link to='/admin' className="head-modal-element">Admin Panel</Link> : null
                                            }

                                            <Link to='/cart' className="head-modal-element">Cart</Link>

                                            <Link to='/update' className="head-modal-element">Update Profile</Link>

                                            <button onClick={() => {
                                                localStorage.removeItem('auth-token');
                                                this.context.updateUser({});
                                                this.setState({ redirect: true });
                                                this.closeUserModal();
                                                sessionStorage.clear();
                                            }}>Logout</button>
                                        </div> :

                                            <div className="head-modal">

                                                <Link to='/login' className="head-modal-element">Login</Link>
                                                <Link to='/signup' className="head-modal-element">Signup</Link>

                                            </div>
                                    }

                                </div>
                            </Modal>
                        </div>

                    </nav>

                    {
                        window.location.pathname.length === 1 && window.location.pathname === '/' ? <div className="MainSideBar">

                            {
                                this.searchData.map((item, index) => {
                                    return (
                                        <div className="dropdown" key={index}>
                                            <h4 className="button2">{item.name}</h4>
                                            <div className="dropdown-content">
                                                {
                                                    item.data.map((item1, index1) => {
                                                        return (
                                                            <div key={item1.name}>
                                                                <label>{item1.name}</label>
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => this.onChangeSearchOption(e, index, index1)}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div> : null
                    }


                </header >
            </>
        )

    }
}
export { Head };