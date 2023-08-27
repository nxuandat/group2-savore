import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useState } from 'react';
import { Store } from './Store';
// Cart Screen
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';

// Order Screen
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';

// Profile Screen
import ProfileScreen from './screens/ProfileScreen';

//sidebar
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';

// footer
import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  // MDBBtn,
} from 'mdb-react-ui-kit';
import { Footer } from 'flowbite-react';
import {
  // BsDribble,
  BsFacebook,
  BsGoogle,
  BsInstagram,
  BsTwitter,
} from 'react-icons/bs';
//search Screen
import SearchScreen from './screens/SearchScreen';
//admin view
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';

// Product Management
import ProductListScreen from './screens/ProductListScreen';

//Product Edit
import ProductEditScreen from './screens/ProductEditScreen';

//Order List
import OrderListScreen from './screens/OrderListScreen';

// Users List
import UserListScreen from './screens/UserListScreen';

// Edit Users
import UserEditScreen from './screens/UserEditScreen';

import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import MapScreen from './screens/MapScreen';
import AboutUsScreen from './screens/AboutUsScreen';

import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import LoginIcon from '@mui/icons-material/Login';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
        console.log(currentDate);
        console.log(currentHour);
        console.log(isClosed);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    ></Menu>
  );
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const isClosed = currentHour >= 22 || currentHour < 7;

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar
            style={{ backgroundColor: '#2f4f4e' }}
            variant="dark"
            expand="lg"
          >
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Savoré Coffee Shop</Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  {(userInfo
                    ? !userInfo.isAdmin && !userInfo.isStaff
                    : true) && (
                    <Link to="/cart" className="nav-link">
                      <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                          size="large"
                          aria-haspopup="true"
                          color="inherit"
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                        <p className="m-0 ms-2">Shopping Cart</p>
                        {cart.cartItems.length > 0 && (
                          <Badge pill bg="danger">
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )}
                      </MenuItem>
                    </Link>
                  )}

                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                          size="large"
                          aria-haspopup="true"
                          color="inherit"
                        >
                          <AccountCircle />
                        </IconButton>
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                      </MenuItem>

                      <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                          size="large"
                          aria-haspopup="true"
                          color="inherit"
                        >
                          <ListAltIcon />
                        </IconButton>
                        <LinkContainer to="/orderhistory">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                      </MenuItem>

                      <NavDropdown.Divider />
                      <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                          size="large"
                          aria-haspopup="true"
                          color="inherit"
                        >
                          <LogoutIcon />
                        </IconButton>
                        <Link
                          className="dropdown-item signout-link align-items-center"
                          to="#signout"
                          onClick={signoutHandler}
                        >
                          Sign Out
                        </Link>
                      </MenuItem>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                          fontSize="large"
                          aria-label="account of current user"
                          aria-controls="primary-search-account-menu"
                          aria-haspopup="true"
                          color="inherit"
                        >
                          <LoginIcon />
                        </IconButton>
                        <p className="m-0 ms-2">Sign In</p>
                      </MenuItem>
                    </Link>
                  )}

                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                          fontSize="large"
                          aria-haspopup="true"
                          color="inherit"
                        >
                          <DashboardIcon />
                        </IconButton>
                        <LinkContainer to="/admin/dashboard">
                          {/* <DashboardIcon /> */}
                          <NavDropdown.Item>Dashboard</NavDropdown.Item>
                        </LinkContainer>
                      </MenuItem>

                      <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                          fontSize="large"
                          aria-haspopup="true"
                          color="inherit"
                        >
                          <CategoryIcon />
                        </IconButton>
                        <LinkContainer to="/admin/products">
                          <NavDropdown.Item>Products</NavDropdown.Item>
                        </LinkContainer>
                      </MenuItem>

                      <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                          fontSize="large"
                          aria-haspopup="true"
                          color="inherit"
                        >
                          <ListAltIcon />
                        </IconButton>
                        <LinkContainer to="/admin/orders">
                          <NavDropdown.Item>Orders</NavDropdown.Item>
                        </LinkContainer>
                      </MenuItem>

                      <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                          fontSize="large"
                          aria-haspopup="true"
                          color="inherit"
                        >
                          <VerifiedUserIcon />
                        </IconButton>
                        <LinkContainer to="/admin/users">
                          <NavDropdown.Item>Users</NavDropdown.Item>
                        </LinkContainer>
                      </MenuItem>
                    </NavDropdown>
                  )}
                  {userInfo && userInfo.isStaff && !userInfo.isAdmin && (
                    <NavDropdown title="Staff" id="staff-nav-dropdown">
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          style={{
            backgroundColor: '#2f4f4e',
            textDecoration: 'none',
            color: 'white',
          }}
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item style={{ color: '#5e9ea0', fontSize: '30px' }}>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item
                key={category}
                // style={{ backgroundColor: '#5e9ea0', border: '4px' }}
              >
                <LinkContainer
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>
                    <span style={{ textDecoration: 'none', color: 'white' }}>
                      {' '}
                      <strong>{category} </strong>{' '}
                    </span>
                  </Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        {isClosed && (
          <div className="closing-notification">
            <p
              style={{
                color: 'red',
                fontWeight: 'bold',
                textAlign: 'center',
                backgroundColor: '#f8d7da',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '20px',
              }}
            >
              We are currently closed. Our opening hours are from 7 AM to 10 PM.
              Please visit us during these times.
            </p>
          </div>
        )}

        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/about" element={<AboutUsScreen />} />

              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/*admin route*/}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>

              {/*Staff Route*/}
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <MDBFooter
          style={{ backgroundColor: 'rgb(47, 79, 78)' }}
          className="text-center text-lg-start text-light mt-3"
        >
          <section className="">
            <MDBContainer className="text-center text-md-start mt-5">
              <MDBRow className="mt-3">
                <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4 justify-content">
                    <img src="/128.png" alt=" " className="me-3" />
                    Savore Café Shop
                  </h6>
                  <p style={{ textAlign: 'justify' }}>
                    The ideal destination for coffee aficionados and those with
                    a taste for exquisite pastries. We take pride in being the
                    go-to place for delightful experiences and refined flavors
                    that coffee and desserts can offer.
                  </p>
                </MDBCol>

                <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Products</h6>
                  <p>
                    <Link to="/search?category=Coffee" className="link">
                      Coffee
                    </Link>
                  </p>
                  <p>
                    <Link to="/search?category=Freeze" className="link">
                      Freeze
                    </Link>
                  </p>
                  <p>
                    <Link to="/search?category=Milk%20Tea" className="link">
                      Milk Tea
                    </Link>
                  </p>
                  <p>
                    <Link to="/search?category=Cake" className="link">
                      Cake
                    </Link>
                  </p>
                  <p>
                    <Link to="/search?category=Topping" className="link">
                      Topping
                    </Link>
                  </p>
                </MDBCol>

                <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Opening Time</h6>
                  <div className="mb-2">
                    <MDBIcon icon="angle-right" /> Monday
                    <span> 7.00 AM - 10.00 PM</span>
                  </div>
                  <div className="mb-2">
                    <MDBIcon icon="angle-right" /> Tuesday
                    <span> 7.00 AM - 10.00 PM</span>
                  </div>
                  <div className="mb-2">
                    <MDBIcon icon="angle-right" /> Wednesday
                    <span> 7.00 AM - 10.00 PM</span>
                  </div>
                  <div className="mb-2">
                    <MDBIcon icon="angle-right" /> Thursday
                    <span> 7.00 AM - 10.00 PM</span>
                  </div>
                  <div className="mb-2">
                    <MDBIcon icon="angle-right" /> Thursday
                    <span> 7.00 AM - 10.00 PM</span>
                  </div>
                  <div className="mb-2">
                    <MDBIcon icon="angle-right" /> Friday
                    <span> 7.00 AM - 10.00 PM</span>
                  </div>
                  <div className="mb-2">
                    <MDBIcon icon="angle-right" /> Saturday
                    <span> 7.00 AM - 10.00 PM</span>
                  </div>
                  <div className="mb-2">
                    <MDBIcon icon="angle-right" /> Sunday
                    <span> 7.00 AM - 10.00 PM</span>
                  </div>
                </MDBCol>

                <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                  <p>
                    <LinkContainer to="/about">
                      <Nav.Link className="link">
                        <MDBIcon color="light" icon="coffee" className="me-2" />
                        About Us
                      </Nav.Link>
                    </LinkContainer>
                  </p>
                  <p>
                    <MDBIcon color="light" icon="home" className="me-2" />
                    Nguyen Van Cu, district 5, HoChiMinh city
                  </p>
                  <p>
                    <MDBIcon color="light" icon="envelope" className="me-3" />
                    info@SavoreCafeShop.com
                  </p>
                  <p>
                    <MDBIcon color="light" icon="phone" className="me-3" /> + 01
                    234 567 88
                  </p>
                  <div className="d-flex justify-content-center justify-content-lg-between p-2 ">
                    <Footer.Icon
                      href="#!"
                      icon={BsFacebook}
                      className="me-4 cus-icon"
                      size="lg"
                      color="white"
                    />
                    <Footer.Icon
                      href="#!"
                      icon={BsInstagram}
                      className="m-4 cus-icon"
                      fontSize="40px"
                    />
                    <Footer.Icon
                      href="#!"
                      icon={BsTwitter}
                      className="m-4 cus-icon"
                      size="lg"
                    />
                    <Footer.Icon
                      href="#!"
                      icon={BsGoogle}
                      className="m-4 cus-icon"
                      size="lg"
                    />
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </section>
          <div
            className="text-center p-3 text-light"
            style={{ backgroundColor: 'rgb(47, 79, 78)' }}
            textDecoration="none"
          >
            &copy;2023{' '}
            <a className="link" href="https://savore.onrender.com">
              SavoreCafeShop.com
            </a>
          </div>
        </MDBFooter>
      </div>
    </BrowserRouter>
  );
}

export default App;
