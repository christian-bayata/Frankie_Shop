import React, {Fragment} from 'react';
import { Route, Link } from 'react-router-dom';

import { useDispatch, useSelector} from 'react-redux';
import {useAlert}  from 'react-alert';
import {logoutUser} from '../../actions/authAction';

import Search from './search';

import '../../App.css';

const Header = () => {

    const alert = useAlert();
    const dispatch = useDispatch();    

    const { loading, user } = useSelector(state => state.auth);

    const logoutHandler = () => {
        dispatch(logoutUser());
        alert.success("User Logged Out Successfully");
    } 

    return(
        <Fragment> 
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/">
                            <img id="header_logo" src="/images/wwtgyh.png" alt="..."/>
                        </Link>
                    </div>
                </div> 

                <div className="col-12 col-md-5 mt-2 mt-md-0">
                    <Route render={({history}) => <Search history={history} /> } />  
                </div>

               <div className="col-12 col-md-3 mt-4 mt-md-0 text-center justify-content-around">
                    <Link to="/cart" style={{textDecoration: 'none'}}>
                        <span id="cart">Cart</span>
                        <span className="mr-2" id="cart_count">2</span>
                    </Link>

                    {user ? (
                        <div className="ml-2 dropdown d-inline">
                            <button to="#!" 
                                className="btn dropdown-toggle text-white mr-4" 
                                type="button"
                                style={{textDecoration:'none'}} 
                                id="dropdownMenuButton" 
                                data-bs-toggle="dropdown"
                                aria-haspopup="true" 
                                aria-expanded="false"> 

                                    <Link  to="/">
                                        <figure className="avatar avatar-nav">
                                            <img src={user.avatar && user.avatar.url} 
                                                className="rounded-circle" 
                                                alt={user && user.name} 
                                                />
                                        </figure> 
                                        <span style={{color: 'white'}}>{user && user.name}</span>    
                                    </Link>

                            </button>

                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                {user && user.role !== 'admin' ? (
                                    <Link to="/orders/me" className="dropdown-item">Orders</Link>
                                ): (
                                    <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                                )}

                               <Link to="/me" className="dropdown-item">Profile</Link>
                               <Link to="/" className="dropdown-item text-danger" onClick={logoutHandler}>Logout</Link>                                
                            </div>

                        </div>

                    ) : !loading && <Link to="/login" className="btn" id="login_btn">Login</Link>
                    }
                    
                </div>
        </nav>
    </Fragment>
    )
};

export default Header;