import axios from "axios";
import React, {  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();

  // Fetch initial values from cookies if available
  const initialValues = {
    email: Cookies.get('rememberedEmail') || "",
    password: Cookies.get('rememberedPassword') || "",
    rememberMe: !!Cookies.get('rememberedEmail') // Check if rememberedEmail exists
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Please enter a valid Email").required("Enter Your Email"),
    password: Yup.string().required("Enter Your Password")
  });

  const handleSubmit = (values, { setSubmitting }) => {
    axios.post('http://localhost:5000/api/login', values)
      .then(result => {
        console.log(result.data);
        if (values.rememberMe) {
          // If "Remember Me" is checked, store in cookies
          Cookies.set('rememberedEmail', values.email, { expires: 7 }); // Expires in 7 days
          Cookies.set('rememberedPassword', values.password, { expires: 7 });
        } else {
          // If not checked, clear cookies
          Cookies.remove('rememberedEmail');
          Cookies.remove('rememberedPassword');
        }
        Cookies.set('token', result.data.token);
        if (result.data.message === 'success') {
          alert("Login Successful")
          navigate('/dashboard');
        }
      })
      .catch(err => console.log(err))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="d-flex vh-100 bg-secondary justify-content-center align-items-center">
      <div className="w-25 bg-white rounded p-3">
        <h2>Login Here</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="mb-3">
                <label>
                  <strong>Email</strong>
                </label>
                <Field
                  type="email"
                  placeholder="Enter Your Email"
                  name="email"
                  className="form-control rounded-0"
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label>
                  <strong>Password</strong>
                </label>
                <Field
                  type="password"
                  placeholder="Enter Your Password"
                  name="password"
                  className="form-control rounded-0"
                />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>

              <div className="mb-3 form-check">
                <Field
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  className="form-check-input"
                />
                <label htmlFor="rememberMe" className="form-check-label">Remember Me</label>
              </div>

              <button type="submit" className="btn btn-dark w-100 rounded-0" disabled={isSubmitting}>
                Login
              </button>
            </Form>
          )}
        </Formik>
        <p>New User?</p>
        <Link to="/forgot-password" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Forgot Password</Link>
        <Link to='/' className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
