import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAlert } from 'react-alert';
import Metadata from '../layout/metadata';
import Loader from '../layout/loader';
import { Link } from 'react-router-dom'

import { login, clearErrors } from '../../actions/authAction';

const Login = ({ history }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();

    const {isAuthenticated, error, loading} = useSelector(state => state.auth);

    useEffect(() => {

        if(isAuthenticated) {
            history.push('/');
        }

        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error, isAuthenticated, history]);

    const submitHandler = e => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    return (
        <Fragment> 
            {loading ? <Loader /> : (
                <Fragment>
                    <Metadata title={'Login'} />

                    <div className="row justify-content-center wrapper">
                        <div className="col-10 col-lg-6 mt-5">
                            <form className="shadow-lg mt-5" onSubmit={submitHandler}>
                                <h1 className="my-2 pt-4 pl-4">Login</h1>
                                <div className="form-group p-4">
                                    <label htmlFor="email-field">Email</label>
                                    <input  
                                        type="email"
                                        id="email-field"
                                        className="form-control mb-3"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                    <label htmlFor="password-field">Password</label>
                                    <input 
                                        type="password"
                                        id="password-field"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    
                                    <Link to="/password/forgot" id="forgot-password" className="mt-2 mb-3">Forgot Password?</Link>

                                    <button type="submit" id="submit-login" className="btn btn-block mb-3">LOGIN</button>

                                    <Link to="/register" id="forgot-password" className="pb-2">New User?</Link>
                                </div>

                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>        
    )
}

export default Login
