import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './component/layout/header'; 
import Footer from './component/layout/footer';
import Home from './component/home';
import productDetails from './component/product/productDetails';
import Login from './component/user/login';
import Register from './component/user/register';
import Profile from './component/user/profile';

import ProtectedRoute from './component/route/protectedRoute';
import { loadUser } from './actions/authAction';
import UpdateProfile from './component/user/updateProfile';
import UpdatePassword from './component/user/updatePassword';
import ForgotPassword from './component/user/forgotPassword';
import NewPassword from './component/user/newPassword';
import store from './store'; 

function App() {

  useEffect(() => {    
      store.dispatch(loadUser());
  }, [])

  return (
    <Router>
     <div className="App"> 
        <Header />
        
        <div className="container container-fluid">
        <Route path ="/" component={Home} exact />
        <Route path ="/search/:keyword" component={Home}  />
        <Route path ="/product/:id" component={productDetails} exact />
        
        <Route path ="/login" component={Login} />
        <Route path ="/register" component={Register} />
        <Route path ="/password/forgot" component={ForgotPassword} exact/>
        <Route path ="/password/reset/:token" component={NewPassword} exact/>
        <ProtectedRoute path ="/me" component={Profile} exact/>
        <ProtectedRoute path ="/me/update" component={UpdateProfile} exact/>
        <ProtectedRoute path ="/password/update" component={UpdatePassword} exact/>
        </div>

        <Footer />
      </div> 
    </Router>
       
  );
};

export default App;
