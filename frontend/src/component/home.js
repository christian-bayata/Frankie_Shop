import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Metadata from './layout/metadata';
import Product from './product/product';
import Loader from './layout/loader';

import { getProducts } from '../actions/productsAction';

const {createSliderWithTooltip} = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = ({ match }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 1000]);
    const [category, setCategory] = useState('');

    const categories = [
        'Electronics',
        'Cameras',
        'Foodstuff/Fruits',
        'Accessories',
        'Laptops',
        'Headphones',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]

    const alert = useAlert()
 
    const dispatch = useDispatch();

    const { loading, products, productCount, error, resPerPage, filteredProductsCount } = useSelector(state=>state.products);

    const keyword = match.params.keyword;
 
    useEffect(() => {
        
        if(error) {
            return alert.error(error);
        }
  
        dispatch(getProducts(keyword, currentPage, price, category));
        
    }, [dispatch, alert, error, keyword, currentPage, price, category]);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    let count = productCount;
    if(keyword) {
        count = filteredProductsCount;
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

                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range 
                                                marks={{
                                                    1: "$1",
                                                    1000: "$1000"
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]}
                                                value={price}
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                onChange={price => setPrice(price)}
                                            />

                                            <hr className="my-5" />

                                            <div className="mt-5">

                                                <h4 className="mb-3">Categories</h4>
                                                
                                                <ul className="pl-0">
                                                    {categories.map(category => (
                                                        <li style={{
                                                            cursor: "pointer",
                                                            listStyleType: "none"
                                                        }}
                                                        key={category}
                                                        onClick={() => setCategory(category)}
                                                        >
                                                            {category}
                                                        </li>
                                                    ))}
                                                </ul>

                                            </div>

                                            
                                        </div> 
                                    </div>

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            { products && products.map(product => (
                                                <Product key={product._id} product={product} col={4} /> 
                                            ))}
                                        </div>
                                    </div>

                                </Fragment>
                            ) : (
                               products && products.map(product => (
                                    <Product key={product._id} product={product} col={3} /> 
                                ))
                            )}

                              
                        </div>
                    </section>
                    
                    {resPerPage <= count && (
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