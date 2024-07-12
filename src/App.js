import React from 'react';
import { createBrowserRouter, Routes, Route,Link,NavLink,Outlet,RouterProvider } from 'react-router-dom';
import {Navbar ,AudioBot,AudioDemo, Main} from './components';
import './App.css';
const Layout =()=>{
  return (
     <div >
     
      <div>
          <Outlet/>
       </div> 
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
