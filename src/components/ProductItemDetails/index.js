import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

const apiStatusCode = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    productData: [],
    apiStatus: '',
  }

  componentDidMount() {
    this.getProductsList()
  }

  getProductsList = async () => {
    this.setState({apiStatus: apiStatusCode.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        productId: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        rating: data.rating,
        totalReviews: data.total_reviews,
        description: data.description,
        availability: data.availability,
        brand: data.brand,
        similarProducts: data.similar_products,
      }
      this.setState({
        productData: updatedData,
        apiStatus: apiStatusCode.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusCode.failure})
    }
  }

  renderProductData = () => {
    const {productData} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productData
    return (
      <div>
        <img src={imageUrl} alt={title} />
        <h1>{title}</h1>
        <p>RS {price}/- </p>
        <div>
          <div>
            <p>{rating}</p>
          </div>
          <p>{totalReviews} Reviews</p>
          <p>{description}</p>
          <div>
            <p>Available:</p>
            <p>{availability}</p>
          </div>
          <div>
            <p>Brand:</p>
            <p>{brand}</p>
          </div>
        </div>
      </div>
    )
  }

  renderFailure = () => (
    <div>
      <img src="" alt="" />
      <h1>Product Not Found </h1>
      <button type="button">Continue Shopping</button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderDisplay = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusCode.success:
        return this.renderProductData()
      case apiStatusCode.failure:
        return this.renderFailure()
      case apiStatusCode.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderDisplay()}</div>
  }
}

export default ProductItemDetails
