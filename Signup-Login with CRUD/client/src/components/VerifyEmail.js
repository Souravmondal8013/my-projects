import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function VerifyEmail() {
    const [email, setEmail] = useState('');
    const [err, setErr] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/verifyemail', { email })
            .then((res) => {
                if(res.status===250)
                    {
                        alert(res.data.message)
                    }
                alert(res.data.message);
                // Save email to local storage
                localStorage.setItem('verifiedEmail', email);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    setErr(error.response.data.error);
                } else {
                    setErr('Something went wrong. Please try again later.');
                }
                console.log(error);
            });
    }

    return (
        <div className='vh-100 bg-secondary d-flex align-items-center justify-content-center'>
            <div className="w-50 bg-white rounded p-4 shadow">
                <h2 className="text-center mb-4">Email Verification(Do it before Signup)</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div><br />
                    {err && <p className="text-danger mb-3">{err}</p>}
                    <button type='submit' className="btn btn-info btn-block">Send Verification Email</button>
                </form>
                <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
            </div>
        </div>
    );
}

export default VerifyEmail;
