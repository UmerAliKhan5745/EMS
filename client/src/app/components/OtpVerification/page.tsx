"use client"

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../../styles/Form.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation'

interface OtpValues {
  otp: string;
}

export default function OtpVerification() {
  const router =useRouter();

  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const initialValues: OtpValues = {
    otp: '',
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, 'OTP must be 6 digits')
      .required('Required'),
  });

  const handleSubmit = async (values: OtpValues) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

    if (!userId) {
      setVerificationStatus('User ID not found. Please register first.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', { // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // Replace with actual userId
          otp: values.otp
        }),
      });
      const data = await response.json();
      // console.log(data)
      if (data.success) {
        setVerificationStatus(data.message)
        router.push('/components/Dashboard')
        // Redirect or handle success
      } else {
        setVerificationStatus('Invalid OTP, please try again.');
        setTimeout(()=>{
          router.push('/')

        },1500)
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setVerificationStatus('An error occurred, please try again.');
    }
  };
  const crossfuntion=()=>{
    setShowForm(false)
    setTimeout(()=>{
     router.push('/')
    },1000)
 }

  return (
    <div className={`${styles.formContainer} ${showForm ? styles.visible : ''}`}>
      <div className={styles.form}>
        <FontAwesomeIcon
          icon={faTimes}
          className={`${styles.closeButton} ${styles.fixedSizeIcon}`} // Apply fixed size styling
          onClick={crossfuntion}
        />
        <h2>Verify OTP</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className={styles.inputBox}>
                <Field
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                />
                <ErrorMessage name="otp" component="div" className={styles.error} />
              </div>
              <button type="submit" className={styles.button} disabled={isSubmitting}>
                Verify OTP
              </button>
              {verificationStatus && (
                <div className={styles.verificationStatus}>
                  {verificationStatus}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
