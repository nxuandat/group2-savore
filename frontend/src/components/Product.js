import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  // const addToCartHandler = async (item) => {
  //   const existItem = cartItems.find((x) => x._id === product._id);
  //   const quantity = existItem ? existItem.quantity + 2 : 1;
  //   const { data } = await axios.get(`/api/products/${item._id}`);
  //   if (data.countInStock < quantity) {
  //     window.alert('Sorry. Product is out of stock');
  //     return;
  //   }
  //   ctxDispatch({
  //     type: 'CART_ADD_ITEM',
  //     payload: {},
  //   });
  // };
  return (
    <Card>
      <a href={`/product/${product.slug}`}>
        <img
          src={product.image}
          className="card-img-top card"
          alt={product.name}
        />
      </a>
      <Card.Body>
        <a href={`/product/${product.slug}`}>
          <Card.Title>
            {' '}
            <span style={{ textDecoration: 'none', color: 'black' }}>
              {' '}
              <b> {product.name} </b>{' '}
            </span>{' '}
          </Card.Title>
        </a>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <a href={`/product/${product.slug}`}>
            <Button
              style={{
                backgroundColor: '#5e9ea0',
                textDecoration: 'none',
                color: '#0e191d',
              }}
              // onClick={() => addToCartHandler(product)}
            >
              <b> Add to Cart </b>
            </Button>
          </a>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
