import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const verifyToken = token ? JSON.parse(atob(token.split('.')[1])) : null;

    if (!token) {
      navigate('/login');
    } else {
      setUser(verifyToken);
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleDeleteAccount = async () => {
    try {
      const token = Cookies.get('token');
      const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const userEmail = decodedToken.email;

      const response = await fetch(`http://localhost:5000/api/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        Cookies.remove('token');
        navigate('/login');
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api')
      .then(result => {
        setUsers(result.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete('http://localhost:5000/api/deleteStudent/' + id)
      .then(res => {
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container mt-5 bg-info ">
      <div className="row">
        <div className="col-md-4 mt-2 mb-2">
          <div className="card mx-auto" style={{ maxWidth: '400px' }}>
            <div className="card-header bg-primary text-white">
              <h2 className="card-title text-center mb-0">Welcome, {user && user.name}</h2>
            </div>
            <div className="card-body text-center">
              {user && (
                <>
                  <img
                    src={user.photo ? `http://localhost:5000/${user.photo}` : '/default-profile.png'}
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #fff' }}
                  />
                  <p className="card-text mb-4">Welcome back! You're logged in.</p>
                  <div>
                    <button className="btn btn-danger btn-block" onClick={handleLogout}>Logout</button>
                  </div>
                  <div>
                    <button className="btn btn-primary btn-block mt-3" onClick={handleEditProfile}>Edit Profile</button>
                  </div>
                  <div>
                    <button className="btn btn-warning btn-block mt-3" onClick={handleDeleteAccount}>Delete Account</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-8 mt-2 mb-2">
          <div className="bg-white rounded p-3">
            <Link to="/create" className="btn btn-success mb-3">Add +</Link>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Gender</th>
                  <th>Education</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={user.image ? `http://localhost:5000/${user.image}` : '/default-profile.png'}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', border: '2px solid #fff' }}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.city}</td>
                    <td>{user.gender}</td>
                    <td>{user.education.join(', ')}</td> 
                    <td>
                      <Link to={`/update/${user._id}`} className="btn btn-success btn-sm">Update</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
