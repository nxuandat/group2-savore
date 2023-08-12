import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import PasswordChecklist from 'react-password-checklist';

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMeetsCriteria, setPasswordMeetsCriteria] = useState(false);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo || !token) {
      navigate('/');
    }
  }, [navigate, userInfo, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await Axios.post('/api/users/reset-password', {
        password,
        token,
      });
      navigate('/signin');
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className='small-container'>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <h1 className='my-3'>Reset Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>Confirm New Password</Form.Label>
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
        <div className='mb-3'>
          <Button
            style={{ backgroundColor: '#5e9ea0' }}
            type='submit'
            disabled={!passwordMeetsCriteria}
          >
            <b> Reset Password </b>
          </Button>
        </div>
      </Form>
    </Container>
  );
}
