import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const UpdateUser = () => {
  const { id } = useParams()

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [gender, setGender] = useState('')
  const [education, setEducation] = useState([])
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/updateStudent/' + id)
      .then(result => {
        const user = result.data
        setName(user.name)
        setCity(user.city)
        setGender(user.gender)
        setEducation(user.education)
        setImage(user.image)
        setImagePreview(`http://localhost:5000/${user.image}`)
      })
      .catch(err => console.log(err))
  }, [id])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleEducationChange = (e) => {
    const value = e.target.value
    setEducation(prev => 
      prev.includes(value) 
      ? prev.filter(item => item !== value) 
      : [...prev, value]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('city', city)
    formData.append('gender', gender)
    formData.append('education', JSON.stringify(education)) // Convert array to string for submission
    if (image) {
      formData.append('image', image)
    }

    axios.put('http://localhost:5000/api/editStudent/' + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(result => {
        navigate('/')
      })
      .catch(err => console.log(err))
  }

  return (
    <div className='d-flex vh-100 bg-secondary justify-content-center align-items-center'>
      <div className='w-50 h-100 bg-white rounded p-3 m-auto'>
        <form onSubmit={handleSubmit}>
          <h2>Update User</h2>
          <div className='mb-2'>
            <label>Image</label>
            <img
              src={imagePreview ? imagePreview : '/default-profile.png'}
              alt="Profile"
              className="rounded-circle mb-3"
              style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #fff' }}
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="form-control mb-3"
            />
          </div>

          <div className='mb-2'>
            <label>Name</label>
            <input type='text' placeholder='Enter Your Name' className='form-control' value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className='mb-2'>
            <label>City</label>
            <select className="form-control" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select Your City</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Houston">Houston</option>
              <option value="Phoenix">Phoenix</option>
            </select>
          </div>

          <div className='mb-2'>
            <label>Gender</label>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={gender === "male"}
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
                checked={gender === "female"}
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
                checked={gender === "other"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>

          <div className='mb-2'>
            <label>Education Preferences</label>
            <div>
              <input
                type="checkbox"
                id="computerScience"
                value="Computer Science"
                checked={education.includes("Computer Science")}
                onChange={handleEducationChange}
              />
              <label htmlFor="computerScience">Computer Science</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="business"
                value="Business"
                checked={education.includes("Business")}
                onChange={handleEducationChange}
              />
              <label htmlFor="business">Business</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="arts"
                value="Arts"
                checked={education.includes("Arts")}
                onChange={handleEducationChange}
              />
              <label htmlFor="arts">Arts</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="engineering"
                value="Engineering"
                checked={education.includes("Engineering")}
                onChange={handleEducationChange}
              />
              <label htmlFor="engineering">Engineering</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="medicine"
                value="Medicine"
                checked={education.includes("Medicine")}
                onChange={handleEducationChange}
              />
              <label htmlFor="medicine">Medicine</label>
            </div>
          </div>

          <button className='btn btn-success'>Update</button>
        </form>
      </div>
    </div>
  )
}

export default UpdateUser
