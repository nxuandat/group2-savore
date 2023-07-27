import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Rating from './Rating';

function Product(props) {
  const { product } = props;
  return (
    <Card>
      <a href={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </a>
      <Card.Body>
        <a href={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </a>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        <Button>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}
export default Product;
