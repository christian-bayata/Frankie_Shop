import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './component/layout/header';
import Footer from './component/layout/footer';
import Home from './component/home';
import productDetails from './component/product/productDetails';

function App() {
  return (
    <Router>
     <div className="App">
        <Header />
        <div className="container container-fluid">
        <Route path = "/" component={Home} exact />
        <Route path = "/product/:id" component={productDetails} exact />
        </div>
        <Footer />
      </div> 
    </Router>
       
  );
};

export default App;
