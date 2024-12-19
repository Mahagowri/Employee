import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../components/Register.css';
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "",
    doj: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", formData);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      alert("Error registering user.");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee ID" maxLength="10" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" pattern="\d{10}" required />
        <select name="department" value={formData.department} onChange={handleChange} placeholder ="Department" required >
          <option value="" disabled selected>Select a Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
        </select>
        <input type="date" name="doj" value={formData.doj} onChange={handleChange} max={new Date().toISOString().split("T")[0]} required />
        <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
        <button type="submit">Register</button>
      </form>
      <button onClick={() => navigate("/login")}>Already have an account? Login</button>
    </div>
  );
};

export default Register;