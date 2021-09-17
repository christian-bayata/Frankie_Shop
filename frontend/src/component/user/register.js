import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAlert } from 'react-alert';
import Metadata from '../layout/metadata';

import { register, clearErrors } from '../../actions/authAction';


const Register = ({ history }) => {

    const {isAuthenticated, loading, error} = useSelector(state => state.auth);

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/avatar_default.jpg");

    const alert = useAlert();
    const dispatch = useDispatch();

    useEffect(() => {

        if(isAuthenticated) {
            history.push('/');
        }

        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, isAuthenticated, error, history]);

    const submitHandler = (e)  => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('avatar', avatar);

        dispatch(register(formData)) 
    }

    const onChange = (e) => {
        if(e.target.name === 'avatar') {
            
            const reader = new FileReader();

            reader.onload = () => {
                //readyState === 0: empty
                //readyState === 1: loading
                //readyState === 0: done
                if(reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            } 

            reader.readAsDataURL(e.target.files[0]);
        
        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    return (
        <Fragment>

            <Metadata title={'Register user'} />

            <div className="row justify-content-center wrapper">
                <div className="col-10 col-lg-5">
                <form className="shadow-lg mt-5" onSubmit={submitHandler} encType='multipart/form-data'>
                    <h1 className="p-4">Register</h1>

                <div className="form-group px-4 ">
                    <label htmlFor="name-field">Name</label>
                    <input 
                        type="name" 
                        id="name-field" 
                        className="form-control" 
                        name="name"
                        value={name}
                        onChange={onChange} 
                    />
                </div>

                <div className="form-group px-4">
                    <label htmlFor="email-field">Email</label>
                    <input
                        type="email"
                        id="email-field"
                        className="form-control"
                        name="email"
                        value={email}
                        onChange={onChange}
                    />
                </div>
        
                <div className="form-group px-4">
                    <label htmlFor="password-field">Password</label>
                    <input
                        type="password"
                        id="password-field"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={onChange}
                    />
                </div>

                <div className='form-group p-4'>
                    <label htmlFor='avatar_upload'>Avatar</label>
                    <div className='d-flex align-items-center'>
                        <div>
                            <figure className='avatar mr-3 pt-2 item-rtl'>
                                <img
                                    src={avatarPreview}
                                    id="avatar_wh"
                                    className='rounded-circle'
                                    alt="Avatar Preview"
                                />
                            </figure>
                        </div>
                        <div className='custom-file'>
                            <input
                                type='file'
                                name='avatar'
                                className='custom-file-input'
                                id='customFile'
                                accept='images/*'
                                onChange={onChange}
                            />
                            <label className='custom-file-label' htmlFor='customFile'>
                                Choose Avatar
                            </label>
                        </div>
                    </div>

                    <button
                    id="submit-login"
                    type="submit"
                    className="btn btn-block my-3"
                    disabled={loading ? true : false}
                    >
                    REGISTER
                    </button>
                </div>
                </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Register;
