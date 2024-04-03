import React, { Component } from "react";
import ReactModal from "react-modal";
import { Head } from "../Components/Header";
import { Foot } from "../Components/Footer";
import './adminPage.scss';
import { FaEye, FaPen, FaTrash, FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MainContext } from "../Contexts/MainContext";
import Modal from '@mui/material/Modal';
import { SERVER_URL } from "../Services/helpers";
import { toast } from 'react-toastify';

class ProductCardAdmin extends Component {

    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = {
            openDeleteModal: false,
            openEditModal: false,
            formData: {
                name: this.props?.data.name,
                price: this.props?.data.price,
                description: this.props?.data.description,
                brand: this.props?.data.brand,
                totalStock: this.props?.data.totalStock,
                size: this.props?.data.size,
                images: [],
                gender: this.props?.data.gender
            },
        }
    }

    openDeleteModal = () => {
        this.setState({
            openDeleteModal: true
        })
    }

    closeDeleteModal = () => {
        this.setState({
            openDeleteModal: false
        })
    }

    openEditModal = () => {
        this.setState({
            openEditModal: true
        })
    }

    closeEditModal = () => {
        this.setState({
            openEditModal: false
        })
    }

    handleEditProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', this.state.formData.name);
        formData.append('price', this.state.formData.price);
        formData.append('description', this.state.formData.description);
        formData.append('totalStock', this.state.formData.totalStock);
        formData.append('gender', this.state.formData.gender)
        formData.append('brand', this.state.formData.brand);
        formData.append('size', this.state.formData.size);

        this.state.images?.forEach((file) => {
            formData.append('images', file);
        })

        fetch(`${SERVER_URL}product/update/${this.props.data._id}`, {
            method: 'PUT',
            headers: {
                'auth-token': localStorage.getItem('auth-token')
            },
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    toast.success(json.message);
                    this.context.fetchProducts();
                    this.closeEditModal();
                } else {
                    toast.error(json.message);
                }
            })
            .catch(err => {
                toast.error('Something went wrong');
            })

    }

    handleImageDelete = (e) => {

        fetch(`${SERVER_URL}product/deleteImage/${this.props.data._id}`, {
            method: 'DELETE',
            headers: {
                'auth-token': localStorage.getItem('auth-token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageURL: e.target.src
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    toast.success(json.message);
                    this.context.fetchProducts();
                } else {
                    toast.error(json.message);
                }
            })

    }

    handleProductDelete = () => {
        fetch(`${SERVER_URL}product/delete/${this.props.data._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            }
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    toast.success(json.message);
                    this.context.fetchProducts();
                    this.closeDeleteModal();
                } else {
                    toast.error(json.message);
                }
            })
            .catch(err => {
                toast.error('Something went wrong');
            })
    }

    onChange = (e) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [e.target.name]: e.target.value
            }
        })
    }

    onFileChange = (e) => {
        const files = e.target.files;
        this.setState({
            images: [...this.state.formData.images, ...files]
        })
    }

    render() {

        const { _id, name, description, price, totalStock, size, gender, images } = this.props.data;

        return (

            <div className="admin-product-card">

                <div className="product-details-admin">

                    <img src={images[0]} alt="" className="product-image" />

                    <div>
                        <h4>{name}</h4>
                        <p>$ {price}</p>
                    </div>

                    <div>
                        <p>Description</p>
                        <p>{description}</p>
                    </div>

                </div>

                <div className="buttons">

                    <button className="edit" onClick={this.openEditModal}>
                        <FaPen />
                    </button>

                    <Modal
                        open={this.state.openEditModal}
                        onClose={this.closeEditModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className="admin-modal-container"
                    >
                        <div className="admin-modal">
                            <h3>Edit Product</h3>

                            <form encType="multipart/form-data" method="POST" onSubmit={this.handleEditProduct}>

                                <label htmlFor="product-name">
                                    Product Name
                                </label>
                                <input onChange={this.onChange} id="product-name" type="text" placeholder="Enter Product Name" name="name" value={this.state.formData.name} />

                                <label htmlFor="product-price">
                                    Product Price
                                </label>
                                <input onChange={this.onChange}
                                    id="product-price" type="number"
                                    min={1}
                                    placeholder="Enter Product Price"
                                    name="price"
                                    value={this.state.formData.price}
                                />

                                <label htmlFor="product-stock">
                                    Product Stock
                                </label>
                                <input onChange={this.onChange}
                                    id="product-stock" type="number"
                                    min={1}
                                    placeholder="Enter Product Stock"
                                    name="totalStock"
                                    value={this.state.formData.totalStock}
                                />

                                <label htmlFor="product-brand">
                                    Product Brand
                                </label>
                                <input onChange={this.onChange}
                                    id="product-brand" type="text"
                                    placeholder="Enter Product Brand"
                                    name="brand"
                                    value={this.state.formData.brand}
                                />

                                <label htmlFor="product-description">
                                    Product Description
                                </label>
                                <textarea onChange={this.onChange} id="product-description" placeholder="Enter Product Description"
                                    name="description"
                                    value={this.state.formData.description}
                                />

                                <label htmlFor="product-size">
                                    Product Size ( Seperate with comma ) <br />
                                    Example: small, medium, large
                                </label>
                                <input onChange={this.onChange}
                                    id="product-size"
                                    placeholder="Enter Product Size"
                                    type="text"
                                    name="size"
                                    value={this.state.formData.size}
                                />

                                <label htmlFor="product-gender">
                                    Gender ( Seperate with comma ) <br />
                                    Example : M,F,O
                                </label>
                                <input onChange={this.onChange}
                                    id="product-gender"
                                    placeholder="Enter Genders"
                                    type="text"
                                    name="gender"
                                    value={this.state.formData.gender}
                                />

                                <label htmlFor="product-image">
                                    Product Image
                                </label>
                                <input onChange={this.onFileChange} id="product-image" type="file" name="images" accept="image/*" multiple />

                                <div className="product-image">

                                    {
                                        this.state.formData.images.map((file, index) => {
                                            return (
                                                <img key={index} src={URL.createObjectURL(file)} alt="" />
                                            )
                                        })
                                    }

                                    {
                                        images?.map((data, index) => {
                                            return (
                                                <img key={index} src={data} alt="" onClick={this.handleImageDelete} />
                                            )
                                        })
                                    }

                                </div>

                                <p>Click on the previous images to delete them.</p>

                                <button type="submit">Update Product</button>

                            </form>
                        </div>
                    </Modal>

                    <button className="delete" onClick={this.openDeleteModal}>
                        <FaTrash />
                    </button>

                    <Modal
                        open={this.state.openDeleteModal}
                        onClose={this.closeDeleteModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className="admin-modal-container"
                    >
                        <div className="admin-modal">
                            <h3>Delete Product</h3>
                            <p>Are you sure you want to delete this product?</p>
                            <button onClick={this.closeDeleteModal}>Cancel</button>
                            <button onClick={this.handleProductDelete}>Delete</button>
                        </div>
                    </Modal>

                    <Link to={`/productinfo/${_id}`} target="_blank" className="view">
                        <FaEye />
                    </Link>

                </div>

            </div>

        )
    }

}

class AdminPage extends Component {

    static contextType = MainContext;

    constructor() {
        super();
        this.state = {
            addProductModal: false,
            formData: {
                name: '',
                price: '',
                description: '',
                brand: '',
                totalStock: '',
                size: '',
                gender: '',
                color: ''
            },
            images: []
        }
    }

    openAddProductModal = () => {
        this.setState({
            addProductModal: true
        })
    }

    closeAddProductModal = () => {
        this.setState({
            addProductModal: false
        })
    }

    handleAddProduct = (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append('name', this.state.formData.name);
        formData.append('price', this.state.formData.price);
        formData.append('description', this.state.formData.description);
        formData.append('totalStock', this.state.formData.totalStock);
        formData.append('gender', this.state.formData.gender)
        formData.append('brand', this.state.formData.brand);
        formData.append('size', this.state.formData.size);

        this.state.images.forEach((file) => {
            formData.append('images', file);
        })

        fetch(`${SERVER_URL}product/create`, {
            method: 'POST',
            headers: {
                'auth-token': localStorage.getItem('auth-token')
            },
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    toast.success(json.message);
                    this.context.fetchProducts();
                    this.closeAddProductModal();
                } else {
                    toast.error(json.message);
                }
            })
            .catch(err => {
                toast.error('Something went wrong');
            })

    }

    componentDidMount() {
        this.context.fetchProducts();
    }

    onChange = (e) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [e.target.name]: e.target.value
            }
        })
    }

    onFileChange = (e) => {
        const files = e.target.files;
        this.setState({
            images: [...this.state.images, ...files]
        })
    }

    render() {

        const { products } = this.context;

        if (!products) return (
            <div>
                <h1>Loading...</h1>
            </div>
        )

        return (
            <>
                <Head />
                <div className="admin-main">
                    <h3 style={{ textAlign: "center", paddingTop: '3rem' }}>Manage Products</h3>

                    <button onClick={this.openAddProductModal} className="add-product">
                        Add Product
                    </button>

                    <Modal
                        open={this.state.addProductModal}
                        onClose={this.closeAddProductModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className="admin-modal-container"
                    >
                        <div className="admin-modal">
                            <h3>Add Product</h3>

                            <form encType="multipart/form-data" method="POST" onSubmit={this.handleAddProduct}>

                                <label htmlFor="product-name">
                                    Product Name
                                </label>
                                <input onChange={this.onChange} id="product-name" type="text" placeholder="Enter Product Name" name="name" value={this.state.formData.name} />

                                <label htmlFor="product-price">
                                    Product Price
                                </label>
                                <input onChange={this.onChange}
                                    id="product-price" type="number"
                                    min={1}
                                    placeholder="Enter Product Price"
                                    name="price"
                                    value={this.state.formData.price}
                                />

                                <label htmlFor="product-stock">
                                    Product Stock
                                </label>
                                <input onChange={this.onChange}
                                    id="product-stock" type="number"
                                    min={1}
                                    placeholder="Enter Product Stock"
                                    name="totalStock"
                                    value={this.state.formData.totalStock}
                                />

                                <label htmlFor="product-brand">
                                    Product Brand
                                </label>
                                <input onChange={this.onChange}
                                    id="product-brand" type="text"
                                    placeholder="Enter Product Brand"
                                    name="brand"
                                    value={this.state.formData.brand}
                                />

                                <label htmlFor="product-description">
                                    Product Description
                                </label>
                                <textarea onChange={this.onChange} id="product-description" placeholder="Enter Product Description"
                                    name="description"
                                    value={this.state.formData.description}
                                />

                                <label htmlFor="product-size">
                                    Product Size ( Seperate with comma ) <br />
                                    Example: small, medium, large
                                </label>
                                <input onChange={this.onChange}
                                    id="product-size"
                                    placeholder="Enter Product Size"
                                    type="text"
                                    name="size"
                                    value={this.state.formData.size}
                                />

                                <label htmlFor="product-gender">
                                    Gender ( Seperate with comma ) <br />
                                    Example : M,F,O
                                </label>
                                <input onChange={this.onChange}
                                    id="product-gender"
                                    placeholder="Enter Genders"
                                    type="text"
                                    name="gender"
                                    value={this.state.formData.gender}
                                />

                                <label htmlFor="product-image">
                                    Product Image
                                </label>
                                <input onChange={this.onFileChange} id="product-image" type="file" name="images" accept="image/*" multiple />

                                <div className="product-image">

                                    {
                                        this.state.images.map((file, index) => {
                                            return (
                                                <img key={index} src={URL.createObjectURL(file)} alt="" />
                                            )
                                        })
                                    }

                                </div>

                                <button type="submit">Add Product</button>

                            </form>
                        </div>
                    </Modal>

                    <div className="main-container">

                        {
                            products.map((data) => {
                                return (
                                    <ProductCardAdmin key={data._id} data={data} />
                                )
                            })
                        }

                    </div>

                </div>
            </>
        )
    }
}
export default AdminPage;