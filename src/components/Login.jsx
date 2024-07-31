import React, {useState}  from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import BackgroundImage from '../images/background.jpg';
import Logo from '../images/logo.png';
import {link,useNavigate} from 'react-router-dom';
import axios from "axios"
const Login = () => {
    const [inputs,setInputs]= useState({
        username:"",
         email:"",
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
    const handleLogin=async e =>{
        e.preventDefault();
        try{
           // const res = await axios.post("/auth/login", inputs)
            navigate("/audioBot")
          }catch(err){
            setError(err.response.data)
          }
    }
    const handleChange= e =>{
        setInputs(prev=>({...prev,[e.target.name]:e.target.value}))
    }
  return (
    <div className="App container"style={backgroundStyle}>
        <div className='row' >
            <div className='col-sm'  >
            
            </div>  
            <div className='col-sm'> 
                <Card style={{height:'94vh' ,width:'93%',marginTop:'1%',marginLeft:'8%',borderRadius:'5px'}}>
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
                                    <Form.Control type="email" placeholder="name@example.com" onChange={handleChange} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control type="password" placeholder="Password" onChange={handleChange} />
                            </FloatingLabel>
                        </Card.Text>
                        <Button variant="primary" onClick={handleLogin}>Login</Button>
                    </Card.Body>
                </Card>
            </div>  
        </div>
    </div>
  )
}

export default Login