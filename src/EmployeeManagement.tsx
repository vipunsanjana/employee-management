import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeForm, setEmployeeForm] = useState<Employee>({
    id: 0,
    name: '',
    position: '',
    department: '',
    salary: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8086/employees/all');
      console.log("Fetched Employees:", response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Could not fetch employees. Please try again later.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmployeeForm({ ...employeeForm, [name]: name === 'id' || name === 'salary' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const employeeData = {
      ...employeeForm,
      id: Number(employeeForm.id), // Convert id to a number
      salary: parseFloat(employeeForm.salary.toString()), // Ensure salary is a number
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8086/employees/id?id=${employeeData.id}`, employeeData);
        setIsEditing(false);
      } else {
        await axios.post('http://localhost:8086/employees/employee', employeeData);
      }

      setEmployeeForm({ id: 0, name: '', position: '', department: '', salary: 0 });
      fetchEmployees();
    } catch (error) {
      console.error("Error during submission:", error);
      setError("Could not add/update employee. Please check the input and try again.");
    }
  };

  const handleEdit = (employee: Employee) => {
    setEmployeeForm(employee);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:8086/employees/id?id=${id}`);
    fetchEmployees();
  };

  return (
    <div>
      <h1>Employee Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id"
          value={employeeForm.id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={employeeForm.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={employeeForm.position}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={employeeForm.department}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={employeeForm.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">{isEditing ? 'Update' : 'Add'} Employee</button>
      </form>

      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.position} - {employee.department} - ${employee.salary}
            <button onClick={() => handleEdit(employee)}>Edit</button>
            <button onClick={() => handleDelete(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EmployeeManagement;
