import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../Header.scss';
import { Head } from '../Components/Header';
import { Foot } from '../Components/Footer';
import ProductCard from '../Components/ProductCard';
import { Navigate } from "react-router-dom";
import { MainContext } from '../Contexts/MainContext';

class MainBody extends React.Component {
  static contextType = MainContext;
  constructor() {
    super();
    this.state = {
      data: []
    }
  }
  render() {

    const { user, userType, products } = this.context;

    if (products.length === 0) {

      setTimeout(() => {

        return (
          <>
            <Head />
            <div className='MainBodyLoading'>

              <p>Loading...</p>

            </div>
          </>
        )

      }, 5000)

      return (
        <>
          <Head />
          <div className='MainBodyLoading'>

            <p>No products found</p>

          </div>
        </>
      )
    }

    return (
      <>

        <Head />
        <div className="MainBody">

          {this.context.products.map((data) => {
            return (
              <ProductCard key={data._id} data={data} />
            )
          })}
        </div>
        <Foot />
      </>
    )
  }

}

export default MainBody;
