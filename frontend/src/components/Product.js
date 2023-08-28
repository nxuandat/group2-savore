import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Rating from './Rating';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

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
            >
              <b> Buy </b>
            </Button>
          </a>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
