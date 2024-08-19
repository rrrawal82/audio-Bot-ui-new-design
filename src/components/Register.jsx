import React,{useContext, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import BackgroundImage from '../images/background.jpg';
import Logo from '../images/logo.png';
import {Link,useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/authContext'
import axios from "axios"

const Register = () => {
    const [inputs,setInputs]= useState({
        username:"",
         email:"",
         password:""
      })
    
      const[err,setError]=useState(null)
      const handleChange= e =>{
          setInputs(prev=>({...prev,[e.target.name]:e.target.value}))
      }
    
      const navigate=useNavigate()
    
      const handleSubmit= async e =>{
        e.preventDefault()
        try{
          const res = await axios.post("http://localhost:8080/api/auth/register", inputs)
          //navigate("/login")
        }catch(err){
          setError(err.response.data)
        }
        
      }
     
  return (
    <div>
         <div className='row' >
           <div className='col-sm'> 
               <Card style={{height:'90vh' ,width:'35%',marginTop:'1%',marginLeft:'8%',borderRadius:'5px',marginLeft:'32%'}}>
                   <Card.Img variant="top" src={Logo}   style={{ width: '10rem',marginTop:'20px',marginLeft:'20px'}}/>
                   <Card.Body>
                       <Card.Title style={{float:'left'}} >Please enter details to register</Card.Title>
                       <br></br>
                       <Card.Text  style={{marginTop:'40px'}}>
                       <FloatingLabel
                                   controlId="floatingInput"
                                   label="Name"
                                   className="mb-3"
                           >
                                   <Form.Control type="name" placeholder="" name="username" onChange={handleChange} />
                           </FloatingLabel>
                           <FloatingLabel
                                   controlId="floatingInput"
                                   label="Email address"
                                   className="mb-3" >
                                   <Form.Control type="email" placeholder="name@example.com" name="email" onChange={handleChange} />
                           </FloatingLabel>
                           <FloatingLabel controlId="floatingPassword" label="Password"  className="mb-3">
                               <Form.Control type="password" placeholder="Password" name="password"  onChange={handleChange} />
                           </FloatingLabel>

                           <FloatingLabel controlId="floatingPassword" label="Confirm Password">
                               <Form.Control type="password" placeholder="Confirm Password" name="confirm_password"  onChange={handleChange} />
                           </FloatingLabel>
                       </Card.Text>
                       <div>
                           <Button variant="primary" onClick={handleSubmit} style={{float:'left'}}>Register</Button>
                       </div>
                       <br></br>
                       <p style={{float:'left' ,marginTop:'30px',marginLeft:'-70px'}}>
                           Already have an account?
                           <Link to="/"> Login</Link>
                       </p><br></br>
                       <p style={{float:'left' ,marginTop:'30px',marginLeft:'-257px',color:'red'}}>
                          
                       </p>
                   </Card.Body>
               </Card>
           </div>  
       </div>
    </div>
  )
}
export default Register