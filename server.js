const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "M@haG0wr12004", 
  database: "employee_database"
});

// Register endpoint
app.post("/register", async (req, res) => {
  const { name, employeeId, email, phone, department, doj, role, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, employee_id, email, phone, department, doj, role, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, employeeId, email, phone, department, doj, role, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error registering user" });
      }
      res.status(201).json({ message: "User registered" });
    }
  );
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });
    res.status(200).json({ token });
  });
});

// Fetch employee data (only accessible by admins)
app.get("/employees", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token invalid" });
    }

    if (decoded.role !== 'Admin') {
      return res.status(403).json({ error: "Forbidden, only Admin can access employee list" });
    }

    db.query("SELECT * FROM users", (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching employee details" });
      }
      res.json(result);
    });
  });
});

// Dashboard endpoint
app.get("/dashboard", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token invalid" });
    }

    db.query("SELECT * FROM users WHERE id = ?", [decoded.userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user details" });
      }
      res.json(result[0]);
    });
  });
});

// Edit employee details (only Admin can edit)
app.put("/edit/:id", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token invalid" });
    }

    // Admin check (only Admin can edit employees)
    if (decoded.role !== 'Admin') {
      return res.status(403).json({ error: "Forbidden, only Admin can edit employee details" });
    }

    const { name, email, phone, department, doj, role } = req.body;
    const employeeId = req.params.id;

    db.query(
      "UPDATE users SET name = ?, email = ?, phone = ?, department = ?, doj = ?, role = ? WHERE id = ?",
      [name, email, phone, department, doj, role, employeeId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Error updating employee details" });
        }
        res.status(200).json({ message: "Employee details updated successfully" });
      }
    );
  });
});

// Delete employee (only Admin can delete)
app.delete("/delete/:id", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token invalid" });
    }

    // Admin check (only Admin can delete employees)
    if (decoded.role !== 'Admin') {
      return res.status(403).json({ error: "Forbidden, only Admin can delete employee details" });
    }

    const employeeId = req.params.id;

    db.query("DELETE FROM users WHERE id = ?", [employeeId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error deleting employee" });
      }
      res.status(200).json({ message: "Employee deleted successfully" });
    });
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
