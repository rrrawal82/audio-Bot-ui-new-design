import React, { useState, useContext, useEffect } from 'react';
import {Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { createBrowserRouter, Routes, Route,Link,NavLink,Outlet,RouterProvider,Navigate  } from 'react-router-dom';
import {AudioBot,AudioDemo, Main,AiVoiceChat,Login, Sidebar,Navbar,Register} from './components';
import { AuthContext } from './context/authContext';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
const Layout = () => {
  const backgroundStyle = {
    backgroundColor: 'black',
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: '99%'
  };

  const [showModal, setShowModal] = useState(false);

  const handleModalShow = async e => {
    setShowModal(true);
  };
  const handleValueChange = (newValue) => {
    setShowModal(newValue);
  };
  
  return (
    <div style={backgroundStyle}>
      <Row>
        <Col xs={1} id="sidebar-wrapper">
          <Sidebar onAddClick={handleModalShow} />
        </Col>
        <Col xs={10} id="page-content-wrapper">
          <Navbar />
          <AiVoiceChat showModal={showModal} onValueChange={handleValueChange} />
        </Col>
      </Row>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/chatbot",
    element:  <ProtectedRoute element={<Layout />} />,
    children: [
      {
        index: true,
        element: <AiVoiceChat />,
      },
      {
        path: "audioBot",
        element: <AudioBot />,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="app">
       <RouterProvider router={router} />
    </div>
  );
}

export default App;
