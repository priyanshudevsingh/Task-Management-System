import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { backendUrl } from "../backendUrl";

const Edittask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();

  let email='';
  const [userEmail, setuserEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [duedateDay, setDuedateDay] = useState('');
  const [duedateMonth, setDuedateMonth] = useState('');
  const [duedateYear, setDuedateYear] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${backendUrl}/userdata`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwtToken"),
        },
        credentials: "include",
      });

      const data = await res.json();
      email=data.email;
      setuserEmail(data.email);
      callTasks();
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  const callTasks = async () => {
    try {
      const res = await fetch(`${backendUrl}/viewtask/${taskId}?email=${encodeURIComponent(email || userEmail)}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('jwtToken'),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data) {
        console.log(data);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setPriority(data.priority || '');
        setStatus(data.status || '');

        if (data.duedate) {
          const [day, month, year] = data.duedate.split('-');
          setDuedateDay(day || '');
          setDuedateMonth(month || '');
          setDuedateYear(year || '');
        }
      }
    } catch (error) {
      console.log(error);
      navigate('/login');
    }
  };

  const editTask = async (e) => {
    e.preventDefault(); 
    const duedate = `${duedateDay}-${duedateMonth}-${duedateYear}`;

    if (!title || !description || !duedate || !priority || !status) {
      window.alert("You're missing some fields");
      console.log("You're missing some fields");
      return;
    }

    try {
      const res = await fetch(
        `${backendUrl}/edittask/${taskId}?email=${encodeURIComponent(email || userEmail)}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            description,
            duedate,
            priority,
            status,
          }),
        }
      );
      
      const data = await res.json();
      console.log(data);
      if (data) {
        alert('Task Edited successfully');
        console.log('Task Edited successfully');
        navigate(`/viewtask/${taskId}`);
      } else {
        alert('Failed to Edit task.');
        console.log('Failed to Edit task.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="edittaskpage">
      <div className="form-box-edittask">
        <div className="form-value">
          <form method="POST">
            <h2 className="text1">Edit Task</h2>

            <div className="inputboxedittask">
              <label htmlFor="title"></label>
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </div>

            <div className="inputboxedittask">
              <label htmlFor="description"> </label>
              <input
                type="text"
                name="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>

            <div className="inputboxedittask">
              <label htmlFor="priority"></label>
              <select
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
                aria-label="Select Priority"
              >
                <option value="">Select Priority Level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="inputboxedittask">
              <label htmlFor="duedate" className="dd">Due Date</label>
              <div className="date-inputs">
                <input
                  type="text"
                  name="duedate-day"
                  required
                  value={duedateDay}
                  onChange={(e) => setDuedateDay(e.target.value)}
                  placeholder="DD"
                  className="date-input"
                  maxLength="2"
                />
                <input
                  type="text"
                  name="duedate-month"
                  required
                  value={duedateMonth}
                  onChange={(e) => setDuedateMonth(e.target.value)}
                  placeholder="MM"
                  className="date-input"
                  maxLength="2"
                />
                <input
                  type="text"
                  name="duedate-year"
                  required
                  value={duedateYear}
                  onChange={(e) => setDuedateYear(e.target.value)}
                  placeholder="YYYY"
                  className="date-input"
                  maxLength="4"
                />
              </div>
            </div>

            <div className="inputboxedittask">
              <label htmlFor="status"></label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                aria-label="Select Status"
              >
                <option value="">Select Status</option>
                <option value="To-Do">To-Do</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="click">
              <input type="submit" value="Update Task" onClick={editTask}/>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Edittask;
