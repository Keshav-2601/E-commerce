import MainBody from './Pages/MainBody';
import { Signup } from './Pages/Signup';
import { UserLogin } from './Pages/UserLogin';
import { UpdateUser } from './Pages/UpdateUser';
import { Cart } from './Pages/Cart';
import { ProductInfo } from './Pages/Productinfo';
import AdminPage from './Pages/AdminPage';
import './index.scss';
import 'react-toastify/dist/ReactToastify.css';
import './mainbody.scss';
import './admin.scss';
import { ToastContainer, toast } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { MainContextProvider } from './Contexts/MainContext';
import UserAuth from './Routes/UserAuth';
import AdminAuth from './Routes/AdminAuth';
import Paypal from './Pages/Paypal';

function App() {
  return (
    <MainContextProvider>

      <Routes>

        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/' element={<MainBody />} />
        <Route path='/productinfo/:id' element={<ProductInfo />} />
        <Route path='/buy' element={<Paypal/>}/>

        {/* user secured routes */}
        <Route element={<UserAuth />}>
          <Route path='/cart' element={<Cart />} />
          <Route path='/update' element={<UpdateUser />} />
        </Route>

        {/* admin secured routes */}
        <Route element={<AdminAuth />}>
          <Route path='/admin' element={<AdminPage />} />
        </Route>

      </Routes>

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />

    </MainContextProvider>
  );
}

export default App;