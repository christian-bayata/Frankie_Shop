import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { Carousel } from 'react-bootstrap';

import Metadata from '../layout/metadata';
import Loader from '../layout/loader';

import { getProductDetails, clearErrors } from '../../actions/productsAction';
  

export const ProductDetails = ({ match }) => {

    const alert = useAlert();

    const dispatch = useDispatch();

    const { loading, error, product } = useSelector(state=>state.productDetails);

    useEffect(() => {
        dispatch(getProductDetails(match.params.id));

        if(error) {

            dispatch(clearErrors());
        }

    }, [dispatch, alert, error, match.params.id]);


    return(
        <Fragment>
            {loading ? (<Loader />): 
            (
                <Fragment>
                    <Metadata title={`Your no 1 online shopping mart`} />
                    
                        <div className="row d-flex justify-content-around">
                            <div className="col-6 col-md-4 img-fluid" id="product_img">
                                <Carousel pause="hover">
                                    {product.images && product.images.map(image => (
                                        <Carousel.Item key={image.public_id}>
                                            <img className="d-block w-100" src={image.url} alt={product.title} />
                                        </Carousel.Item> 
                                    ))}
                                </Carousel> 
                            </div>

                            <div className="col-6 col-md-4 mt-5">
                                <h3 id="prod_name">{product.name}</h3>
                                <p id="prod_id">product # {product._id}</p>
                                
                                <hr />

                                <div className="rating-outer">
                                <div className="rating-inner" style={{width: `${(product.rating/5) * 100}%`}}></div>
                                </div>
                                <span id="no_of_reviews">({product.noOfReviews} Reviews)</span>

                                <hr />

                                <p classNameName="card-text" id="prod_price">${product.price}</p>

                                <div className="d-inline-flex p-2 bd-highlight">
                                    <span type="button "className="btn btn-danger minus">-</span>

                                    <input id="form-control" className="form-control d-inline" type="number" value="1" readonly />
                                        
                                    <span type="button" className="btn btn-primary plus">+</span>
                                </div>

                                <button type="button" id="cart-button" className="btn btn-primary d-inline ml-4" >Add to Cart</button>  

                                <hr />
                                
                                <p>Status: <span id="status_stock">In Stock</span></p>

                                <h4 className="mt-4">Description:</h4>
                                <p>{product.description}</p>

                                <hr />

                                <p>Sold By: <span id="status_stock">{product.seller}</span></p>

                                <button id="cart-button" type="button" className="btn btn-primary d-block mt-4" data-bs-toggle="modal" data-bs-target="#ratingModal">Submit Your Review</button>        
                            </div>

                    <div className="row mt-2 mb-5">
                        <div className="rating w-50">
                                <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            
                                            <hr />

                                            <div className="modal-body">
                                                <ul className="stars">
                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                </ul>

                                                <textarea name="review" id="review" className="form-control mt-3"></textarea>

                                                <button id="review-button" type="button" className="btn btn-primary my-3 px-4 float-right text-white" data-bs-dismiss="modal" aria-label="Close">Submit</button>
                                            </div>
                                        </div>
                                    </div>            
                                </div>
                            </div>
                        </div>
                    </div>    
                </Fragment>
            )}
        </Fragment>              
    )
}


export default ProductDetails;