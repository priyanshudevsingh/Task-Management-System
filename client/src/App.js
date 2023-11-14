import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./Components/navbar";
import Home from "./Components/home";
import AddTask from "./Components/addTask";
import MyTasks from "./Components/myTasks";
import Login from "./Components/login";
import Register from "./Components/register";
import ViewTask from "./Components/viewTask";
import EditTask from "./Components/editTask";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addTask" element={<AddTask />} />
          <Route path="/myTasks" element={<MyTasks />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/viewTask/:taskId" element={<ViewTask />} />
          <Route path="/editTask/:taskId" element={<EditTask />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
