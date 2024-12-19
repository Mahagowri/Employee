import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './Edit.css';

const Edit = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(state?.userDetails || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/update/${formData.id}`, formData);
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
        <input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} placeholder="Employee ID" disabled />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        <select name="department" value={formData.department} onChange={handleChange} required>
          <option value="" disabled>Select Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
        </select>
        <input type="date" name="doj" value={formData.doj} onChange={handleChange} required />
        <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" required />
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate("/dashboard")}>Cancel</button>
      </form>
    </div>
  );
};

export default Edit;
