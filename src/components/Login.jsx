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

const Login = () => {
    const [inputs,setInputs]= useState({
         username:"",
         password:""
      })
    const[err,setError]=useState(null)
    const backgroundStyle = {
        backgroundImage:`url(${BackgroundImage})`,
        height: "96vh",
        //fontSize: "50px",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };
     
    const navigate=useNavigate()
    const {login}=useContext(AuthContext)

    const handleLogin=async e =>{
        e.preventDefault();
       
            if(inputs.username!='' && inputs.password!=''){
                //const res = await axios.post("/auth/login", inputs)
                try{
                    const res =await login(inputs)
                    console.log(res)
                    console.log(res.username)
                    if(res.username!='' && res.username!=undefined)
                    {    console.log("innn")
                         navigate("/chatbot")
                    }else{
                       console.log("error")
                        setError(res.response.data)
                    }
           
                }catch(err){
                    //setError(err.response.data)
                }
            }else{
                    setError("Enter login and password!")     
            }
    }
    const handleChange= e =>{
        setInputs(prev=>({...prev,[e.target.name]:e.target.value}))
    }
  return (
    <div className="App ">
        <div className='row' >
           
            <div className='col-sm'> 
                <Card style={{height:'90vh' ,width:'35%',marginTop:'1%',marginLeft:'8%',borderRadius:'5px',marginLeft:'32%'}}>
                    <Card.Img variant="top" src={Logo}   style={{ width: '10rem',marginTop:'100px',marginLeft:'20px'}}/>
                    <Card.Body>
                        <Card.Title style={{float:'left'}} >Welcome back!</Card.Title>
                        <br></br>
                        <Card.Text  style={{marginTop:'40px'}}>
                            <FloatingLabel
                                    controlId="floatingInput"
                                    label="Email address"
                                    className="mb-3"
                            >
                                    <Form.Control type="email" placeholder="name@example.com" name="username" onChange={handleChange} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control type="password" placeholder="Password" name="password"  onChange={handleChange} />
                            </FloatingLabel>
                        </Card.Text>
                        <div>
                            <Button variant="primary" onClick={handleLogin} style={{float:'left'}}>Log In</Button>
                        </div>
                        <br></br><br></br>
                        <hr ></hr>
                        <p style={{float:'left' ,marginTop:'30px'}}>
                            Don't you have an account?
                            <Link to="/register"> Register</Link>
                        </p><br></br>
                        <p style={{float:'left' ,marginTop:'30px',marginLeft:'-257px',color:'red'}}>
                            {err&& <p>{err}</p>}
                        </p>
                        
                      
                    </Card.Body>
                </Card>
            </div>  
        </div>
    </div>
  )
}

export default Login