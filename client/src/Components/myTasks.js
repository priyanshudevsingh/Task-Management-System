import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../backendUrl";

const Mytasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(null);
  const [userEmail, setuserEmail] = useState("");
  let email='';

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
      const res = await fetch(
        `${backendUrl}/mytasks?email=${encodeURIComponent(email || userEmail)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  let sortOpt = "";

  const sortTasks = () => {
    let sortedTasks = [...tasks];
    if (sortOpt === "priority") {
      sortedTasks.sort((a, b) => comparePriority(a.priority, b.priority));
    } else if (sortOpt === "status") {
      sortedTasks.sort((a, b) => compareStatus(a.status, b.status));
    } else if (sortOpt === "duedate") {
      sortedTasks.sort((a, b) => compareDueDate(a.duedate, b.duedate));
    }
    setTasks([...sortedTasks]);
  };

  const comparePriority = (priorityA, priorityB) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[priorityA] - priorityOrder[priorityB];
  };

  const compareStatus = (statusA, statusB) => {
    const statusOrder = { "To-Do": 1, "In-Progress": 2, Completed: 3 };
    return statusOrder[statusA] - statusOrder[statusB];
  };

  const compareDueDate = (dateA, dateB) => {
    const dateAComponents = dateA.split("-").map(Number);
    const dateBComponents = dateB.split("-").map(Number);

    for (let i = 2; i >= 0; i--) {
      if (dateAComponents[i] < dateBComponents[i]) return -1;
      if (dateAComponents[i] > dateBComponents[i]) return 1;
    }

    return 0;
  };

  const calDateTime = (createdAt) => {
    const dateTime = new Date(createdAt);

    const day = String(dateTime.getDate()).padStart(2, "0");
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const year = dateTime.getFullYear();

    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} at ${hours}:${minutes}`;
  };

  const generateCSV = () => {
    let csv = "Title, Description, Due Date, Priority, Status, Created At\n";
    tasks.forEach((task) => {
      csv += `"${task.title}","${task.description}","${task.duedate}","${
        task.priority
      }","${task.status}","${calDateTime(task.createdAt)}"\n`;
    });
    return csv;
  };

  const generateDownloadLink = () => {
    const csvData = generateCSV();
    const blob = new Blob([csvData], { type: "csv" });
    return URL.createObjectURL(blob);
  };

  const onSortBy = (event) => {
    const selectedValue = event.target.value;
    sortOpt = selectedValue;
    sortTasks();
  };

  return (
    <section className="tasktable">
      {tasks ? (
        <div>
          {/* for sorting */}
          <div className="labell">
            <label htmlFor="sortOption" className="sort">
              Sort By:
            </label>
            <select
              id="sortOption"
              className="selectt"
              value={sortOpt}
              onChange={onSortBy}
            >
              <option value="">Select Sorting Option</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="duedate">Due Date</option>
            </select>
          </div>

          {/* For downloading .csv file */}
          <a
            className="download-link"
            href={generateDownloadLink()}
            download="task_list.csv"
          >
            Download CSV
          </a>

          {/* task list display */}
          <table className="content-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((i) => (
                <tr key={i.taskid}>
                  <td>
                    <a href={`/viewtask/${i.taskid}`}>{i.title}</a>
                  </td>
                  <td>{i.duedate}</td>
                  <td className={i.priority}>{i.priority}</td>
                  <td>{i.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ):(<p className="text1">Loading...</p>)}
      
    </section>
  );
};

export default Mytasks;
