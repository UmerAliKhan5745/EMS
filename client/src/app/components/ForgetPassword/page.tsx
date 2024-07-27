"use client"
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../../styles/Form.module.css'; // Adjust the path to your CSS module
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from '../Navbar/page';
import { useRouter } from 'next/navigation';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Required'),
});

const ForgotPassword = () => {
  const router = useRouter();

  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const initialValues = {
    email: '',
  };

  const handleEmailSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });
      if (response.ok) {
        setMessage('Please check your email for further instructions.');
        setMessageType('success');
        router.push('/components/OtpPasswordReset');

      } else {
        setMessage('Failed to send reset instructions. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };
const crossfuntion=()=>{
   setShowForm(false)
   setTimeout(()=>{
    router.push('/')
   },1000)
}
  return (
    <>
      {message && (
        <div className={`${styles.message} ${messageType === 'success' ? styles.success : styles.error}`}>
          {message}
        </div>
      )}
      <div className={`${styles.formContainer} ${showForm ? styles.visible : ''}`}>
        <div className={styles.form}>
          <h2>Reset Password</h2>
          <FontAwesomeIcon
            icon={faTimes}
            className={`${styles.closeButton} ${styles.fixedSizeIcon}`}
            onClick={crossfuntion}

          />
          <Formik
            initialValues={initialValues}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleEmailSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className={styles.inputBox}>
                  <Field type="email" name="email" placeholder="Enter your email" />
                  <ErrorMessage name="email" component="div" className={styles.error} />
                </div>
                <button type="submit" className={styles.button} disabled={isSubmitting} >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
