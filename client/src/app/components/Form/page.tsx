"use client"
import axios from 'axios';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../../styles/Form.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import nookies from 'nookies'; 
import ForgotPassword from '../ForgetPassword/page';

interface FormValues {
  emailOrPhone: string;
  password: string;
}

export default function AuthForm() {
  const router = useRouter();

  const [showForm, setShowForm] = useState(true);
  const [activeForm, setActiveForm] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState<string | null>(null);

  const initialValues: FormValues = {
    emailOrPhone: '',
    password: '',
  };

  const validationSchema = Yup.object({
    emailOrPhone: Yup.string()
      .required('Required')
      .test('is-email-or-phone', 'Must be a valid email or phone number', (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s-+()]{7,}$/;
        return emailRegex.test(value!) || phoneRegex.test(value!);
      }),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required'),
  });


  const handleSubmit = async (values: FormValues) => {
    const { emailOrPhone, password } = values;
    const isEmail = emailOrPhone.includes('@');
    const requestData = isEmail ? { email: emailOrPhone, password } : { phoneNumber: emailOrPhone, password };
    const url = activeForm === 'signup' ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';

    try {
      const response = await axios.post(url, requestData);
      console.log('Response:', response.data);
      setMessage(response.data.message);

      if (activeForm === 'login') {
        // Store the token in cookies
        nookies.set(null, 'token', response.data.token, { path: '/' });
        // Redirect to dashboard
        router.push('/components/Dashboard');
      } else {
        // For signup, store userId and redirect to OTP verification
        localStorage.setItem('userId', response.data.user.id); // Store userId in local storage
        router.push('/components/OtpVerification');
      }

      setTimeout(() => setMessage(null), 2000);
    } catch (error: any) {
      console.error('Operation failed:', error);
      setMessage('Operation failed. Please try again.');
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
      }
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const toggleLoginForm = () => setShowForm(!showForm);

  const handleForgotPasswordClick = () => {
        router.push('/components/ForgetPassword');
  };

  return (
    <>
      {message && <div className={styles.message}>{message}</div>}
      <div className={`${styles.formContainer} ${showForm ? styles.visible : ''}`}>
        <div className={styles.form}>
          <FontAwesomeIcon
            icon={faTimes}
            className={styles.closeButton}
            onClick={toggleLoginForm}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <h2>{activeForm === 'login' ? 'Login' : 'Signup'}</h2>
                <div className={styles.inputBox}>
                  <Field
                    type="text"
                    name="emailOrPhone"
                    placeholder="Enter your email or phone number"
                  />
                  <ErrorMessage name="emailOrPhone" component="div" className={styles.error} />
                </div>
                <div className={styles.inputBox}>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="div" className={styles.error} />
                </div>
                <div className={styles.optionField}>
                  {activeForm === 'signup' && (
                    <span className={styles.checkbox}>
                      <input type="checkbox" id="check" />
                      <label htmlFor="check">Remember me</label>
                    </span>
                  )}
                  <a href="#" className={styles.forgotPw}onClick={handleForgotPasswordClick}>Forgot password?</a>
                </div>
                <button type="submit" className={styles.button} disabled={isSubmitting}>
                  {activeForm === 'login' ? 'Login Now' : 'Signup Now'}
                </button>
                <div className={styles.loginSignup}>
                  {activeForm === 'login'
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <a href="#" onClick={() => setActiveForm(activeForm === 'login' ? 'signup' : 'login')}>
                    {activeForm === 'login' ? 'Signup' : 'Login'}
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
