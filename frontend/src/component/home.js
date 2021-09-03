import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';

import Metadata from './layout/metadata';
import Product from './product/product';
import Loader from './layout/loader';

import { getProducts } from '../actions/productsAction';

const Home = () => {

    const [currentPage, setCurrentPage] = useState(1);

    const alert = useAlert()
 
    const dispatch = useDispatch();

    const { loading, products, productCount, error, resPerPage } = useSelector(state=>state.products);
 
    useEffect(() => {
        
        if(error) {
            return alert.error(error);
        }
 
        dispatch(getProducts(currentPage));
        
    }, [dispatch, alert, error, currentPage]);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    return(
        <Fragment>
           {loading ? ( 
               <Loader />
               ) : (
                <Fragment>
                    <Metadata title={`Your no 1 online shopping mart`} />

                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">                        
                            {products && products.map(product => (
                            <Product key={product._id} product={product} /> 
                            ))}  
                        </div>
                    </section>
                    
                    {resPerPage <= productCount && (
                        <div className="d-flex justify-content-center mt-5">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resPerPage}
                            totalItemsCount={productCount}
                            onChange={setCurrentPageNo}
                            nextPageText={'Next'}
                            prevPageText={'Prev'}
                            firstPageText={'First'}
                            lastPageText={'Last'}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                        </div>
                        )}                    
                    </Fragment>
           )}
                    
        </Fragment>
    )
}

export default Home