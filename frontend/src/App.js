import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './component/layout/header';
import Footer from './component/layout/footer';
import Home from './component/home';
import productDetails from './component/product/productDetails';
import Login from './component/user/login';
import Register from './component/user/register';
import { loadUser } from './actions/authAction';
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
        </div>

        <Footer />
      </div> 
    </Router>
       
  );
};

export default App;
