import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header/index'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    getProductsDetailsApiStatus: apiStatusConstants.initial,
    productDetails: {},
    productQty: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      getProductsDetailsApiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(eachSimilarProduct => ({
          availability: eachSimilarProduct.availability,
          brand: eachSimilarProduct.brand,
          description: eachSimilarProduct.description,
          id: eachSimilarProduct.id,
          imageUrl: eachSimilarProduct.image_url,
          price: eachSimilarProduct.price,
          rating: eachSimilarProduct.rating,
          style: eachSimilarProduct.style,
          title: eachSimilarProduct.title,
          totalReviews: eachSimilarProduct.total_reviews,
        })),
      }
      this.setState({
        productDetails: formattedData,
        getProductsDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        getProductsDetailsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderView = () => {
    const {getProductsDetailsApiStatus} = this.state
    switch (getProductsDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderLoadingView = () => (
    <div className="product-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  increaseQty = () => {
    this.setState(prevState => ({
      productQty: prevState.productQty + 1,
    }))
  }

  decreaseQty = () => {
    this.setState(prevState => ({
      productQty:
        prevState.productQty > 1
          ? prevState.productQty - 1
          : prevState.productQty,
    }))
  }

  renderProductDetailsView = () => {
    const {productDetails, productQty} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
      similarProducts,
    } = productDetails
    return (
      <div className="product-view-container">
        <div className="product-details-container">
          <img src={imageUrl} className="product-details-img" alt="product" />
          <div className="product-description-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-and-reviews-container">
              <div className="rating-container">
                <p className="product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-img"
                  alt="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="product-label-value-pair">
              <p className="product-label">Available:</p>
              <p className="product-label-value">{availability}</p>
            </div>
            <div className="product-label-value-pair">
              <p className="product-label">Brand:</p>
              <p className="product-label-value">{brand}</p>
            </div>
            <hr className="separation-line" />
            <div className="product-qty-container">
              <button
                type="button"
                className="product-qty-change-btn"
                onClick={this.decreaseQty}
                testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="product-qty">{productQty}</p>
              <button
                type="button"
                className="product-qty-change-btn"
                onClick={this.increaseQty}
                testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-card-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(eachProduct => (
              <SimilarProductItem
                productData={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="product-details-failure-view">
      <img
        className="product-details-failure-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="product-details-failure-view-heading">
        Product Not Found
      </h1>
      <Link to="/products">
        <button type="button" className="product-details-failure-view-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  render() {
    return (
      <div className="product-detail-section">
        <Header />
        {this.renderView()}
      </div>
    )
  }
}

export default ProductItemDetails
