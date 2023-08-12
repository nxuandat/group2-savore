import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import PasswordChecklist from 'react-password-checklist';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo ? userInfo.name : '');
  const [email, setEmail] = useState(userInfo ? userInfo.email : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMeetsCriteria, setPasswordMeetsCriteria] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  //   const submitHandler = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const { data } = await axios.put(
  //         '/api/users/profile',
  //         {
  //           name,
  //           email,
  //           password,
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${userInfo.token}` },
  //         }
  //       );
  //       dispatch({
  //         type: 'UPDATE_SUCCESS',
  //       });
  //       ctxDispatch({ type: 'USER_SIGNIN', payload: data });
  //       localStorage.setItem('userInfo', JSON.stringify(data));
  //       toast.success('User updated successfully');
  //     } catch (err) {
  //       dispatch({
  //         type: 'FETCH_FAIL',
  //       });
  //       toast.error(getError(err));
  //     }
  //   };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const { data } = await axios.put(
          '/api/users/profile',
          {
            name,
            email,
            password,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success('User updated successfully');
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
        });
        toast.error(getError(err));
      }
    } else {
      toast.error('Passwords do not match');
    }
  };

  return (
    <div className='container small-container'>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className='my-3'>User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='email'>
          {/* controlId='name' */}
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <PasswordChecklist
          rules={['length', 'specialChar', 'number', 'capital']}
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
            {' '}
            <b> Update </b>
          </Button>
        </div>
      </form>
    </div>
  );
}
