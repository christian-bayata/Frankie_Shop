import React, {Fragment} from 'react'
import { Link } from 'react-router-dom';

 import { useSelector } from 'react-redux'
// import useAlert from  'react-alert';

import Loader from '../../component/layout/loader';
import Metadata from '../../component/layout/metadata';


const Profile = () => {
    
    
    const {user, loading} = useSelector(state => state.auth);

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <Metadata title={'User Profile'} />

                    <div className="row justify-content-around mt-5">
                        <div className="col-md-6">
                            <h1>My Profile</h1>
                            
                            <figure class="figure mt-5">
                                <img src={user && user.avatar.url}
                                class="figure-img img-fluid"
                                id="profile-image"
                                alt={user && user.name} />
                            </figure>
                            
                            <Link to="/me/update">
                                <button type="submit" id="edit-profile" className="btn btn-block mt-3">Edit Profile</button>
                            </Link>
                        </div>

                        <div id="profile-details" className="col-md-6 ">
                            
                            <h3>Full Name</h3>
                            <p>{user && user.name}</p>

                            <h3>Email</h3>
                            <p>{user && user.email}</p>

                            <h3>Joined On</h3>
                            <p>{user && String(user.createdAt).substring(0,10)}</p>
                            

                            {user.role !== 'admin' && (
                                <Link to="/order/new" type="submit" id="order-item" className="btn btn-block mt-5">
                                Order
                                </Link>    
                            )}
                        
                            <Link to="/password/update" type="submit" id="change-password" className="btn btn-block mt-5">
                                Change Password
                            </Link>
                        </div>                        
                        
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Profile
