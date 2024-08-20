import React,{useState} from 'react'
import {Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { createBrowserRouter, Routes, Route,Link,NavLink,Outlet,RouterProvider } from 'react-router-dom';
import {AudioBot,AudioDemo, Main,AiVoiceChat,Login, Sidebar,Navbar,Register} from './components';

import './index.css';
const Layout =()=>{
  const backgroundStyle = {
    backgroundColor: 'black',
    height: "100vh",
    //fontSize: "50px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width:'99%'
    
  };
  const[showModal,setShowModal]=useState(false)
  
  const handleShow= async e =>{
    setShowModal(true);
  }
  return (
     <div style={backgroundStyle}>
       <Row>
          <Col xs={1} id="sidebar-wrapper">      
              <Sidebar onAddClick={handleShow}/>
          </Col>
          <Col  xs={10} id="page-content-wrapper">
            <Navbar/>
            <Outlet showModal={showModal}/>
          </Col>
        </Row>
     </div> 

  );
}
const router = createBrowserRouter([
  {
    path: "/chatbot",
    element: <Layout />,
    children: [
      {
        index: true, // Equivalent to path: "/"
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
    element: <Register/>,
  },
]);

function App() {
    return (
      <div className="app">
         <div className="">
            <RouterProvider router={router}/>
         </div>
      </div>
    );
  }
export default App;
