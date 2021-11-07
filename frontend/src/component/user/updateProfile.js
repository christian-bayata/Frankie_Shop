import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAlert } from 'react-alert';
import Metadata from '../layout/metadata';

import { updateUserProfile, loadUser, clearErrors } from '../../actions/authAction';
import {UPDATE_PROFILE_RESET} from '../../constants/authConstant';


const UpdateProfile = ({ history }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/avatar_default.jpg");

    const alert = useAlert();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { error, loading, isUpdated } = useSelector(state => state.user);

    useEffect(() => {

        if(user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }

        if(error) { 
            alert.error(error);
            dispatch(clearErrors());
        }

        if(isUpdated) {
            alert.success('Your Profile update is successful');
            dispatch(loadUser());

            history.push('/me');
 
            dispatch({
                type: UPDATE_PROFILE_RESET})
            }

    }, [dispatch, alert, error, history, user, isUpdated]);

    const submitHandler = (e)  => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);

        dispatch(updateUserProfile(formData)) 
    }

    const onChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if(reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        } 

            reader.readAsDataURL(e.target.files[0]);
    }

    return (
        <Fragment>
            <Metadata title={'Update user profile'} />

            <div className="row justify-content-center wrapper">
                <div className="col-10 col-lg-5">
                <form className="shadow-lg mt-5" onSubmit={submitHandler} encType='multipart/form-data'>
                    <h1 className="p-4">Update Profile</h1>

                <div className="form-group px-4 ">
                    <label htmlFor="name-field">Name</label>
                    <input 
                        type="name" 
                        id="name-field" 
                        className="form-control" 
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)} 
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
                        onChange={e => setEmail(e.target.value)} />
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
                                accept='image/*'
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
                    UPDATE
                    </button>
                </div>
                </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProfile
