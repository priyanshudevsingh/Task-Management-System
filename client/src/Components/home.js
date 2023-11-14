import React from "react";
import catmeme from "../assets/catmeme.gif";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const redirect = (e) => {
    e.preventDefault();
    navigate("/mytasks");
  };

  return (
    <>
      <section className="homepage">
        <p className="text4">
          Welcome to <span className="tuoj">Prioritize</span>, a MERN
          stack-based Task Management System!
        </p>

        <p className="text1">
          Made With ❤️ By &nbsp;
          <a
            className="linkedinlink"
            href="https://www.linkedin.com/in/priyanshudevsingh/"
          >
            Priyanshu Singh
          </a>
        </p>

        <img className="catmeme" src={catmeme} alt="cat typing on laptop"></img>

        <button className="redirectbut" onClick={redirect}>
          View your Tasks
        </button>
      </section>
    </>
  );
};

export default Home;
