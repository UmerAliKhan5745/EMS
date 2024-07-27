
"use client"
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../../styles/Form.module.css'; // Adjust the path to your CSS module
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

const OTPNewPasswordSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .required('Required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
});

const OTPNewPassword = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router =useRouter();

  const initialValues = {
    otp: '',
    newPassword: '',
  };
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // Make API call to reset password
      const response = await fetch('http://localhost:5000/api/auth/resetpassword', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setMessage('Password reset successfully!');
        setMessageType('success');
        router.push('/components/Dashboard')

        // Optionally, redirect to login page or home page
      } else {
        setMessage('Failed to reset password. Please try again.');
        setMessageType('error');
        setTimeout(()=>{router.push('/')},1500)
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
          <h2>Enter OTP and New Password</h2>
          <FontAwesomeIcon
            icon={faTimes}
            className={`${styles.closeButton} ${styles.fixedSizeIcon}`}
            onClick={crossfuntion}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={OTPNewPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className={styles.inputBox}>
                  <Field type="text" name="otp" placeholder="Enter OTP" />
                  <ErrorMessage name="otp" component="div" className={styles.error} />
                </div>
                <div className={styles.inputBox}>
                  <Field type="password" name="newPassword" placeholder="New Password" />
                  <ErrorMessage name="newPassword" component="div" className={styles.error} />
                </div>
                <button type="submit" className={styles.button} disabled={isSubmitting}>
                  Reset Password
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default OTPNewPassword;
