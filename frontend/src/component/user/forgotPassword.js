import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAlert } from 'react-alert';
import Metadata from '../layout/metadata';

import { forgotPassword, clearErrors } from '../../actions/authAction';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    
    const alert = useAlert();
    const dispatch = useDispatch();
    
    const { error, loading, message } = useSelector(state => state.forgotPassword);

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(message) {
            alert.success(message);
        }

    }, [dispatch, alert, error, message]);

    const submitHandler = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.set('email', email);

        dispatch(forgotPassword(formData));
    }
    
    return (
        <Fragment>

            <Metadata title={'Forgot Password'} />

            <div className="row justify-content-center wrapper">
                <div className="col-10 col-lg-6 mt-5">
                    <form className="shadow-lg mt-5" onSubmit={submitHandler}>
                        <h1 className="my-2 pt-4 pl-4">Forgot Password</h1>
                        <div className="form-group p-4">
                            <label htmlFor="email-field">Enter Your Email</label>
                            <input  
                                type="email"
                                id="email-field"
                                className="form-control mb-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <button type="submit" id="forgot-password-button" 
                            className="btn btn-block mb-3"
                            disabled={loading ? true : false }
                            >
                                SUBMIT EMAIL
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default ForgotPassword
