import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import VerifyEmail from './components/VerifyEmail';
import EditProfile from './components/EditProfile';
import CreateUser from './components/CreateUser';
import UpdateUser from './components/UpdateUser';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PrivateRoute><VerifyEmail /></PrivateRoute>}></Route>
          <Route path='/login' element={<PrivateRoute><Login /></PrivateRoute>}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path="/forgot-password" element={<PrivateRoute><ForgotPassword /></PrivateRoute>}></Route>
          <Route path="/reset-password/:id/:token" element={<PrivateRoute><ResetPassword /></PrivateRoute>}></Route>
          <Route path="/verifyemail/:email" element={<PrivateRoute><Signup /></PrivateRoute>}></Route>
          <Route path="/edit-profile" element={<EditProfile />} />
      
          <Route path='/create' element={<CreateUser />}></Route>
          <Route path='/update/:id' element={<UpdateUser />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
