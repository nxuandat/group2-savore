/* eslint-disable react/jsx-no-comment-textnodes */
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import PasswordChecklist from 'react-password-checklist';
import ReCAPTCHA from 'react-google-recaptcha';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMeetsCriteria, setPasswordMeetsCriteria] = useState(false);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  // const sitekeyReCaptcha = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);

  const handleCaptchaChange = (value) => {
    console.log('ReCAPTCHA value:', value);
    // Đây là nơi bạn có thể kiểm tra nếu giá trị value không null để xác minh Captcha
    if (value) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(false);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (isCaptchaVerified) {
      submitHandler(e);
      setIsSignUpSuccessful(true); // Khi đăng ký thành công, cập nhật state
    } else {
      alert('Please complete the ReCAPTCHA challenge.');
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    // Fetch the reCAPTCHA site key from the server
    Axios.get('/api/recaptcha-site-key')
      .then((response) => {
        setRecaptchaSiteKey(response.data.siteKey);
      })
      .catch((error) => {
        console.error('Error fetching reCAPTCHA site key:', error);
      });
  }, [navigate, redirect, userInfo]);
  return (
    <Container className='small-container'>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className='my-3'>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group className='mb-3' controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <PasswordChecklist
            rules={['minLength', 'specialChar', 'number', 'capital']}
            minLength={8}
            value={password}
            onChange={(isValid) => setPasswordMeetsCriteria(isValid)}
          />
          {!passwordMeetsCriteria && (
            <div style={{ color: 'red' }}>Password must meet criteria</div>
          )}
        </Form.Group>
        <div className='mb-3'>
          <ReCAPTCHA
            sitekey={recaptchaSiteKey}
            onChange={handleCaptchaChange}
            className='mb-3'
          />
          <Button
            style={{ backgroundColor: '#5e9ea0' }}
            type='submit'
            disabled={!passwordMeetsCriteria && isSignUpSuccessful}
            onClick={(e) => handleSignUp(e)}
          >
            <b> Sign Up </b>
          </Button>
        </div>
        <div className='mb-3'>
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
