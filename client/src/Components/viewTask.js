import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backendUrl } from "../backendUrl";

const ViewTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [userEmail, setuserEmail] = useState("");
  const [task, setTask] = useState("");
  const [hist, setHist] = useState(null);

  let email = "";

  useEffect(() => {
    fetchUserData();
  }, []);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Low":
        return "priority-low";
      case "Medium":
        return "priority-medium";
      case "High":
        return "priority-high";
      default:
        return "";
    }
  };

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
      email = data.email;
      setuserEmail(data.email);
      callTasks();
      viewHistory();
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  const callTasks = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/viewtask/${taskId}?email=${encodeURIComponent(
          email || userEmail
        )}`,
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
      setTask(data);
    } catch (error) {
      console.log(error);
      navigate("/mytasks");
    }
  };

  const calAgoTime = (createdAt) => {
    const currentTime = Date.now();
    const givenTime = new Date(createdAt).getTime();
    const timeDifference = currentTime - givenTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let agoMessage = "";

    if (days > 0) {
      agoMessage = `${days} day(s) ago`;
    } else if (hours > 0) {
      agoMessage = `${hours} hour(s) ago`;
    } else if (minutes > 0) {
      agoMessage = `${minutes} minute(s) ago`;
    } else {
      agoMessage = `${seconds} second(s) ago`;
    }

    return agoMessage;
  };

  const calDateTime = (createdAt) => {
    const dateTime = new Date(createdAt);

    const day = String(dateTime.getDate()).padStart(2, "0");
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const year = dateTime.getFullYear();

    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    const formattedDate = `${day}-${month}-${year} at ${hours}:${minutes}`;

    return formattedDate;
  };

  const viewHistory = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/viewhistory/${taskId}?email=${encodeURIComponent(email || userEmail)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
          withCredentials: true,
        }
      );

      const data = await res.json();
      setHist(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  const editTask = () => {
    navigate(`/editTask/${taskId}`);
  };

  const deleteTask = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/delete/${taskId}?email=${encodeURIComponent(
          email || userEmail
        )}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwtToken"),
          },
          credentials: "include",
        }
      );

      alert("Task deleted successfully");
      console.log("Task deleted successfully");
      navigate("/mytasks");
    } catch (error) {
      console.log(error);
      alert("Failed to delete task.");
      console.log("Failed to delete task.");
    }
  };

  return (
    <section className="everything">
      {task ? (
        <div>
          <div className="task-details">
            <div className="task-box">
              <p className="mega-content">{task?.title}</p>

              <p className="des">Description</p>
              <p className="des-content">{task?.description}</p>

              <p className="pri">
                Priority:{" "}
                <span className={getPriorityClass(task?.priority)}>
                  {task?.priority}
                </span>
              </p>

              <p className="sta">
                Status: <span className="sta-content">{task?.status}</span>
              </p>

              <p className="sta">
                Due Date: <span className="sta-content">{task?.duedate}</span>
              </p>

              <p className="ddd">
                Created At:{" "}
                <span className="dd-content">
                  {calDateTime(task?.createdAt)} | {calAgoTime(task?.createdAt)}
                </span>
              </p>

              <button className="edit-task" onClick={editTask}>
                Edit Task
              </button>
              <button className="delete-task" onClick={deleteTask}>
                Delete Task
              </button>
            </div>
            <p className="text1" style={{ display: !task ? "block" : "none" }}>
              Loading...
            </p>
          </div>

          <div
            className="hist-details"
            style={{ display: hist ? "block" : "none" }}
          >
            <div>
              <table className="content-table">
                <thead>
                  <tr style={{ display: hist?.length ? "table-row" : "none" }}>
                    <th>Edits History</th>
                  </tr>
                </thead>
                <tbody>
                  {hist
                    ?.slice()
                    .reverse()
                    .map((i) => (
                      <tr key={i.updatedAt}>
                        <td>
                          <p className="mainh">
                            Updated At:{" "}
                            <span className="udttime">
                              {calDateTime(i.updatedAt)} |{" "}
                              {calAgoTime(i.updatedAt)}
                            </span>
                          </p>

                          {i.title_prev !== i.title_now && (
                            <>
                              <p className="mainh">Title</p>
                              <p className="before">
                                Before:{" "}
                                <span className="histcont">{i.title_prev}</span>
                              </p>
                              <p className="after">
                                After:{" "}
                                <span className="histcont">{i.title_now}</span>
                              </p>
                            </>
                          )}

                          {i.description_prev !== i.description_now && (
                            <>
                              <p className="mainh">Description</p>
                              <p className="before">
                                Before:{" "}
                                <span className="histcont">
                                  {i.description_prev}
                                </span>
                              </p>
                              <p className="after">
                                After:{" "}
                                <span className="histcont">
                                  {i.description_now}
                                </span>
                              </p>
                            </>
                          )}

                          {i.priority_prev !== i.priority_now && (
                            <>
                              <p className="mainh">Priority</p>
                              <p className="before">
                                Before:{" "}
                                <span className="histcont">
                                  {i.priority_prev}
                                </span>
                              </p>
                              <p className="after">
                                After:{" "}
                                <span className="histcont">
                                  {i.priority_now}
                                </span>
                              </p>
                            </>
                          )}

                          {i.status_prev !== i.status_now && (
                            <>
                              <p className="mainh">Status</p>
                              <p className="before">
                                Before:{" "}
                                <span className="histcont">
                                  {i.status_prev}
                                </span>
                              </p>
                              <p className="after">
                                After:{" "}
                                <span className="histcont">{i.status_now}</span>
                              </p>
                            </>
                          )}

                          {i.duedate_prev !== i.duedate_now && (
                            <>
                              <p className="mainh">Due Date</p>
                              <p className="before">
                                Before:{" "}
                                <span className="histcont">
                                  {i.duedate_prev}
                                </span>
                              </p>
                              <p className="after">
                                After:{" "}
                                <span className="histcont">
                                  {i.duedate_now}
                                </span>
                              </p>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p
                className="text1"
                style={{ display: !hist?.length ? "block" : "none" }}
              >
                No Edits Found
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text1">Loading...</p>
      )}
    </section>
  );
};

export default ViewTask;
