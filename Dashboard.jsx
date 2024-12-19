import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [employees, setEmployees] = useState([]); // To store employee list
  const [isEmployeeListVisible, setIsEmployeeListVisible] = useState(false); // Flag to show employee list
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details for the dashboard
    const fetchUserDetails = async () => {
      const response = await axios.get("http://localhost:5000/dashboard", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUserDetails(response.data);
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleViewEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      setEmployees(response.data);
      setIsEmployeeListVisible(true); // Show the employee list when fetched
    } catch (error) {
      console.error(error);
      alert("You are not authorized to view the employee list.");
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${userDetails.id}`, { state: { userDetails } });
  };

  return (
    <div>
      {userDetails ? (
        <div>
          <h1>Welcome: {userDetails.name}</h1>
          <p>Employee ID: {userDetails.employee_id}</p>
          <p>Email: {userDetails.email}</p>
          <p>Phone: {userDetails.phone}</p>
          <p>Department: {userDetails.department}</p>
          <p>Date of Joining: {userDetails.doj}</p>
          <p>Role: {userDetails.role}</p>
          <button onClick={handleEdit}>Edit Profile</button>
          <button onClick={handleLogout}>Logout</button>

          {userDetails.role === 'Admin' && (
            <div>
              <button onClick={handleViewEmployees}>View Employees</button>
              {isEmployeeListVisible && (
                <div>
                  <h2>Employee List</h2>
                  <ul>
                    {employees.map((employee) => (
                      <li key={employee.id}>
                        {employee.name} - {employee.role} - {employee.email}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
