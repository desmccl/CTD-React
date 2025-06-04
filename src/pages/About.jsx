import React from "react";

const About = () => {
    return (
        <div>
        <h1>About This App</h1>
        <p>
        This Todo List app allows users to create, view, update, and complete tasks efficiently. 
        It uses Airtable as a backend and supports sorting and filtering for better task management.
        </p>
        <p>
        The app is built with React and demonstrates use of hooks like <code>useReducer</code>, 
        <code>useEffect</code>, and custom routing using React Router.
      </p>
      <p>
        Developed by Desiree McClain, this app is a project designed to practice full-stack JavaScript development.
      </p>
        </div>
        
    );
};

export default About;