import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAlert } from 'react-alert';
import Metadata from '../layout/metadata';

import { resetPassword, clearErrors } from '../../actions/authAction';

const NewPassword = ({ match, history }) => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, loading, success } = useSelector(state => state.forgotPassword);

    useEffect(() => {

        if(error) { 
            alert.error(error);
            dispatch(clearErrors()); 
        }

        if(success) {
            alert.success('New password update is successful');

            history.push('/login');
        }
        
    }, [dispatch, alert, error, success, history]);

    const submitHandler = (e)  => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);
 
        dispatch(resetPassword(match.params.token, formData)); 
    }
    
    return (
        <Fragment>
            
            <Metadata title={'New password'} />
            <div className="row justify-content-center wrapper">
                <div className="col-10 col-lg-6 mt-5">
                    <form className="shadow-lg mt-5" onSubmit={submitHandler}>
                        <h1 className="my-2 pt-4 pl-4">New Password</h1>
                        <div className="form-group p-4">
                            <label htmlFor="password-field">Password</label>
                            <input  
                                type="password"
                                id="confirm-password-field"
                                className="form-control mb-3"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <label htmlFor="confirm-password-field">Confirm Password</label>
                            <input 
                                type="password"
                                id="confirm-password-field"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <button type="submit" id="submit-login" 
                            className="btn btn-block my-3"
                            disabled={loading ? true : false}
                            >SUBMIT
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default NewPassword
