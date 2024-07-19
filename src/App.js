import React from 'react';
import { createBrowserRouter, Routes, Route,Link,NavLink,Outlet,RouterProvider } from 'react-router-dom';
import {Navbar ,AudioBot,AudioDemo, Main,AiVoiceChat} from './components';
import BackgroundImage from './images/background.jpg';
import './index.css';
const Layout =()=>{
  const backgroundStyle = {
    backgroundImage:`url(${BackgroundImage})`,
    height: "96vh",
    marginTop: "2%",
    //fontSize: "50px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
  return (
     <div  style={backgroundStyle}>
        <Outlet/>
     </div> 

  );
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path:"/",
        element:<AudioBot/>
      },
      {
        path:"/chatbot",
        element:<AiVoiceChat/>
      },
    ]
  }
  
])

  function App() {
    return (
      <div className="app">
         <div className="container">
            <RouterProvider router={router}/>
         </div>
      </div>
    );
  }
export default App;
