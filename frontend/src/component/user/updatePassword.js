import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAlert } from 'react-alert';
import Metadata from '../layout/metadata';

import { updatePassword, clearErrors } from '../../actions/authAction';
import {UPDATE_PASSWORD_RESET} from '../../constants/authConstant';

const UpdatePassword = ({ history }) => {
    
    const [oldPassword, setOldPassword] = useState("");
    const [password, setNewPassword] = useState("");
    
    const alert = useAlert();
    const dispatch = useDispatch();

  
    const { error, isUpdated, loading } = useSelector(state => state.user);

    useEffect(() => {

        if(error) { 
            alert.error(error);
            dispatch(clearErrors()); 
        }

        if(isUpdated) {
            alert.success('Your password update is successful');

            history.push('/me');

            dispatch({
                type: UPDATE_PASSWORD_RESET})
            }

    }, [dispatch, alert, error, history, isUpdated]);

    const submitHandler = (e)  => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', password);

        dispatch(updatePassword(formData)); 
    }

    return (
        <Fragment>
            <Metadata title={'Update Password'} />

            <div className="row justify-content-center wrapper">
                <div className="col-10 col-lg-6 mt-5">
                    <form className="shadow-lg mt-5" onSubmit={submitHandler}>
                        <h1 className="my-2 pl-4">Update Password</h1>
                        <div className="form-group p-4">
                            <label htmlFor="old-password-field">Old Password</label>
                            <input  
                                type="password"
                                id="old-password-field"
                                className="form-control mb-3"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <label htmlFor="new-password-field">New Password</label>
                            <input 
                                type="password"
                                id="new-password-field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            
                            <button type="submit" 
                            id="update-password" 
                            className="btn btn-block mt-4 mb-2"
                            style={{'font-weight': '600'}}
                            disabled={loading ? true : false}
                            >
                            UPDATE PASSWORD
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdatePassword
