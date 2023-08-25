import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Rating from '../components/Rating';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import { toast } from 'react-toastify';
import Product from '../components/Product';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedSizePrice, setSelectedSizePrice] = useState(0);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        const { data } = await axios.get(`/api/products`);

        // Lọc danh sách sản phẩm có cùng category với sản phẩm đang xem
        const categoryProducts = data.filter(
          (product) =>
            product.category === result.data.category &&
            product.name !== result.data.name
        );

        setProducts(categoryProducts); // Cập nhật state với danh sách sản phẩm cùng category
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    const existItem = cart.cartItems.find(
      (x) => x._id === product._id && x.size === selectedSize
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock!');
      return;
    }
    let selectedSizePrice = 0;
    if (selectedSize === 'Medium') {
      selectedSizePrice = 0.5;
    } else if (selectedSize === 'Large') {
      selectedSizePrice = 1;
    }

    const totalPriceProduct = product.price + selectedSizePrice;

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...product,
        size: selectedSize,
        quantity: 1,
        totalPriceProduct,
      },
    });
    //navigate('/cart');
    // Quay trở lại trang trước đó
    navigate(-1);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className='img-large'
            src={selectedImage || product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={1} md={2} className='g-2'>
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className='thumbnail'
                        type='button'
                        variant='light'
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant='top' src={x} alt='product' />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price + selectedSizePrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg='success'>In Stock</Badge>
                      ) : (
                        <Badge bg='danger'>Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Available Sizes:</Col>
                    <Col>
                      <Form.Select
                        aria-label='Size'
                        value={selectedSize}
                        onChange={(e) => {
                          const size = e.target.value;
                          setSelectedSize(size);
                          // Cập nhật giá dựa vào kích thước đã chọn
                          if (size === 'Small') {
                            setSelectedSizePrice(0);
                          } else if (size === 'Medium') {
                            setSelectedSizePrice(0.5);
                          } else if (size === 'Large') {
                            setSelectedSizePrice(1);
                          }
                        }}
                      >
                        <option value=''>Size</option>
                        {product.sizes.map((size, index) => (
                          <option key={index} value={size}>
                            {size}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 &&
                  (userInfo
                    ? !userInfo.isAdmin && !userInfo.isStaff
                    : true) && (
                    <ListGroup.Item>
                      <div className='d-grid'>
                        <Button
                          style={{ backgroundColor: '#5e9ea0' }}
                          onClick={addToCartHandler}
                          variant='primary'
                        >
                          <b> Add to Cart </b>
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Display all menu of Coffee Shop */}

      <h1>Suggested Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
            <Product product={product}></Product>
          </Col>
        ))}
      </Row>

      <div className='my-3'>
        <h2 ref={reviewsRef}>Reviews</h2>
        <div className='mb-3'>
          {product.reviews.length === 0 && (
            <MessageBox>There is no review</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=' '></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className='my-3'>
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Write a customer review</h2>
              <Form.Group className='mb-3' controlId='rating'>
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label='Rating'
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value=''>Select...</option>
                  <option value='1'>1- Bad</option>
                  <option value='2'>2- Average</option>
                  <option value='3'>3- Good</option>
                  <option value='4'>4- Very good</option>
                  <option value='5'>5- Excellent </option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId='floatingTextarea'
                label='Comments'
                className='mb-3'
              >
                <Form.Control
                  as='textarea'
                  placeholder='Leave a comment here'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>

              <div className='mb-3'>
                <Button
                  style={{ backgroundColor: '#5e9ea0' }}
                  disabled={loadingCreateReview}
                  type='submit'
                >
                  <b> Submit </b>
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </form>
          ) : (
            <MessageBox>
              Please{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{' '}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductScreen;
