import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEducationChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEducation((prev) => [...prev, value]);
    } else {
      setEducation((prev) => prev.filter((edu) => edu !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('city', city);
    formData.append('gender', gender);
    formData.append('education', education.join(','));
    if (image) {
      formData.append('image', image);
    }

    await axios.post("http://localhost:5000/api/createStudent", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((result) => {
        alert("Data Saved");
        console.log(result);
        navigate("/");
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  };

  return (
    <div className="d-flex vh-100 bg-secondary justify-content-center align-items-center">
      <div className="w-50 h-70 bg-white rounded p-3 m-auto">
        <form onSubmit={handleSubmit}>
          <h2>Add User</h2>
          <div className="mb-2">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter Your Name"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label>City</label>
            <select
              className="form-control"
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Select Your City</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Houston">Houston</option>
              <option value="Phoenix">Phoenix</option>
            </select>
          </div>

          <div className="mb-2">
            <label>Gender</label>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="female">Female</label>
            </div>
            <div>
              <input
                type="radio"
                id="other"
                name="gender"
                value="other"
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>

          <div className="mb-2">
            <label>Education Preferences</label>
            <div>
              <input
                type="checkbox"
                id="computerScience"
                value="Computer Science"
                onChange={handleEducationChange}
              />
              <label htmlFor="computerScience">Computer Science</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="business"
                value="Business"
                onChange={handleEducationChange}
              />
              <label htmlFor="business">Business</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="arts"
                value="Arts"
                onChange={handleEducationChange}
              />
              <label htmlFor="arts">Arts</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="engineering"
                value="Engineering"
                onChange={handleEducationChange}
              />
              <label htmlFor="engineering">Engineering</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="medicine"
                value="Medicine"
                onChange={handleEducationChange}
              />
              <label htmlFor="medicine">Medicine</label>
            </div>
          </div>

          <div className="mb-2">
            <label>Profile Picture</label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #fff' }}
              />
            )}
            <input
              type="file"
              onChange={handleImageChange}
              className="form-control mb-3"
            />
          </div>

          <button className="btn btn-info">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
