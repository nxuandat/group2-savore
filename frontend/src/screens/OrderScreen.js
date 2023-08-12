import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    case 'COD_PAY_REQUEST':
      return { ...state, loadingCOD: true };
    case 'COD_PAY_SUCCESS':
      return { ...state, loadingCOD: false, successCOD: true };
    case 'COD_PAY_FAIL':
      return { ...state, loadingCOD: false };
    case 'COD_PAY_RESET':
      return { ...state, loadingCOD: false, successCOD: false };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };

    case 'DELIVERING_REQUEST':
      return { ...state, loadingDelivering: true };
    case 'DELIVERING_SUCCESS':
      return {
        ...state,
        loadingDelivering: false,
        orderDelivering: action.payload,
      };
    case 'DELIVERING_FAIL':
      return {
        ...state,
        loadingDelivering: false,
        errorDelivering: action.payload,
      };
    case 'DELIVERING_RESET':
      return {
        ...state,
        loadingDelivering: false,
        orderDelivering: null,
        errorDelivering: null,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDelivering,
      orderDelivering,
      errorDelivering,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
    loadingDelivering: false,
    orderDelivering: null,
    errorDelivering: null,
    successDeliver: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  async function payWithCODHandler() {
    try {
      dispatch({ type: 'COD_PAY_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/pay`,
        { paymentMethod: 'COD' },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'COD_PAY_SUCCESS', payload: data });
      toast.success('Order successfully with COD');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      dispatch({ type: 'COD_PAY_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/signin');
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      orderDelivering ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
      if (orderDelivering) {
        dispatch({ type: 'DELIVERING_RESET' });
      }
      if (errorDelivering) {
        dispatch({ type: 'DELIVERING_FAIL' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
    orderDelivering,
    errorDelivering,
  ]);

  async function deliveringOrderHandler() {
    try {
      dispatch({ type: 'DELIVERING_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/delivering`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVERING_SUCCESS', payload: data });
      toast.success('Order is delivering');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVERING_FAIL' });
    }
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className='my-3'>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
                <br />
                <strong>Shipping Method:</strong>{' '}
                {order.shippingAddress.shippingMethod}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant='success'>
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : order.isDelivering ? (
                <MessageBox variant='info'>Delivering...</MessageBox>
              ) : (
                <MessageBox variant='danger'>Preparing...</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                order.paymentMethod === 'PayPal' ? (
                  <MessageBox variant='success'>
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : order.paymentMethod === 'COD' ? (
                  <MessageBox variant='info'>Cash on Delivery</MessageBox>
                ) : null
              ) : order.paymentMethod === 'PayPal' ? (
                <MessageBox variant='danger'>Not Paid</MessageBox>
              ) : order.paymentMethod === 'COD' ? (
                <MessageBox variant='warning'>Cash on Delivery</MessageBox>
              ) : null}
            </Card.Body>
          </Card>

          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant='flush'>
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className='align-items-center'>
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='img-fluid rounded img-thumbnail'
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        <p>Size: {item.size}</p> {/* Hiển thị kích thước */}
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.totalPriceProduct}</Col>{' '}
                      {/* Hiển thị giá */}
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${Number(order.itemsPrice).toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : order.paymentMethod === 'PayPal' ? ( // Sử dụng biến paymentMethod từ context Store
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    ) : order.paymentMethod === 'COD' ? (
                      <div className='d-grid'>
                        <Button
                          style={{ backgroundColor: '#5e9ea0' }}
                          variant='primary'
                          size='lg'
                          onClick={payWithCODHandler}
                        >
                          <b> Confirm (COD) </b>
                        </Button>
                      </div>
                    ) : null}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered &&
                  !order.isDelivering && (
                    // !order.isDelivering &&
                    <ListGroup.Item>
                      {loadingDelivering && <LoadingBox></LoadingBox>}
                      <div className='d-grid'>
                        <Button
                          style={{ backgroundColor: '#5e9ea0' }}
                          type='button'
                          onClick={deliveringOrderHandler}
                          // disabled={order.isDelivering || order.isDelivered}
                        >
                          <b> Delivering Order </b>
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
              </ListGroup>
              {userInfo.isAdmin &&
                order.isPaid &&
                order.isDelivering &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className='d-grid'>
                      <Button
                        style={{ backgroundColor: '#5e9ea0' }}
                        type='button'
                        onClick={deliverOrderHandler}
                        // disabled={order.isDelivering || order.isDelivered}
                      >
                        <b> Delivered Order </b>
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
