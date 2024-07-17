import React, { Component,useState ,useEffect, useRef,createRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import logo from '../images/quickparts_logo.JPG';
import pdxp from '../images/pdf-doc-xls-ppt.jpg';
import MaskGroup from '../images/MaskGroup.png'
import BackgroundImage from '../images/background.jpg';
import mic from '../images/mic.png'
import record from '../images/record.png'
import chat from '../images/chat.png'
import videoUrl from '../images/chat_video.mp4'
import newVideoUrl from '../images/new-video.mp4' 
import MicRecorder from 'mic-recorder-to-mp3';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import videoImg from '../images/upload.svg'
import { BsFiles } from "react-icons/bs";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });
 class AudioDemo extends Component {

   constructor(props) {
    super(props);
     this.state = {
      blobURL: '',
      isBlocked: false,
      show:false,
      isRecording: false,
      blobURL: '',
      isBlocked: false,
      newVideo:false,
      micDisable:false,
      dragOver: false, // State to track drag over effect
      files: [], // State to store dropped files
    };
    
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
   
   }

   componentDidMount(){
   // console.log(this.state.newVideo)
    
   } 
  
   
      handleClose() {
        this.setState({ show: false });
      }
      handleShow() {
        this.setState({ show: true });
      }
    

     handleDragEnter = (e) => {
      e.preventDefault();
      this.setState({ dragOver: true });
    };
    
    handleDragOver = (e) => {
      e.preventDefault();
    };
    
    handleDragLeave = (e) => {
      e.preventDefault();
      this.setState({ dragOver: false });
    };
    
    handleDrop = (e) => {
      e.preventDefault();
      this.setState({ dragOver: false });
      const files = [...e.dataTransfer.files];
      this.setState({ files: [...this.state.files, ...files] });
    };

    handleAddFile=(e)=>{
      const files = e.target.files;
      this.setState({ files: [...this.state.files, ...files] });
      console.log(this.state.files)
    };

    uploadFiles = async () => {
      const formData = new FormData();
      this.state.files.forEach(file => {
        formData.append('file', file);
      });
  
      if (this.state.files.length !== 0) {
        this.setState({ uploading: true });
        const config = {
          onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            const progress = Math.round((loaded * 100) / total);
            this.setState({ uploadProgress: progress });
          },
        };

        try {
          const res = await axios.post("http://localhost:5000/upload_document", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('File uploaded successfully:', res.data);
          if(res.data)
          {
            this.props.navigate('/chatbot');
          }
        } catch (err) {
          console.error('Error uploading file:', err);
        }
       
      } else {
        alert('Select at least one file to upload.');
      }
 };
  
 render()
 {
  const backgroundStyle = {
    backgroundImage:`url(${BackgroundImage})`,
    height: "96vh",
    marginTop: "2%",
    //fontSize: "50px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
    
  return (
    <div className="App container"style={backgroundStyle} >
      <div className='row' >
        <div className='col-sm'  >
          
        </div>  
        <div className='col-sm'> 
        <div style={{height:'92vh'}}>
        <Card style={{height:'90vh' ,width:'90%',marginTop:'4%',marginLeft:'8%',borderRadius:'5px'}} >
            <Card.Body>
              <Card.Title style={{color:'#204E7E',marginTop:'10px',fontSize: '1.875em'}} >Upload Files</Card.Title>
              <Card.Text style={{top: '13px'}}>
                 <Card 
                 style={{position:'absolute', top: '100px', left: '10%',width:'80%', height:'80%', border:'1px',
                 borderStyle: 'dotted',borderColor:'grey',
                 borderColor: this.state.dragOver ? 'blue' : 'grey', // Highlight border on drag over
                }}
                 onDragOver={this.handleDragOver}
                 onDragEnter={this.handleDragEnter}
                 onDragLeave={this.handleDragLeave}
                 onDrop={this.handleDrop}
                 >
                    <Card.Body>
                      <BsFiles size = '50px' color="#3385ff"  style={{top: '80px'}}/>
                      <p style={{ fontSize: '1.2em',marginTop:'20px',color:'grey'}}><b>Drag & Drop an image here </b>
                      </p><p style={{ fontSize: '1.2em',color:'grey'}}><b>Or</b></p>
                      <input  type="file"  multiple
                        ref={fileInput => this.fileInput = fileInput}
                        onChange={this.handleAddFile}  
                        style= {{color:'white',border: 'none',cursor:'pointer',marginLeft:'38%'}}
                      />
                       <p>(Only PDF , XLS , DOC and PPT files . )</p>
                       <Button  class="open-button" id="myBtn"  
                      style= {{color:'white', backgroundColor:'#204E7E',border: 'none', borderRadius:'50px',cursor:'pointer',width:'150px', height:'45px',marginLeft:'6%',marginTop:'-3%',zIndex:'10000',marginBottom:'5%'}}
                      onClick={() => this.uploadFiles(this.state.files)}       
                      >SAVE FILES</Button>
                    
                      {this.state.files.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                         
                          <ul>
                            {this.state.files.map((file, index) => (
                              <li key={index}>{file.name} - {file.size} bytes</li>
                            ))}
                          </ul>
                        </div>
                      )}
                     
                    </Card.Body>
                   </Card>
              </Card.Text>
            </Card.Body>
           
            </Card>
            </div>
        </div>
       </div>       
    </div>
  );
}

}
function WithNavigate(props) {
  let navigate = useNavigate();
  return <AudioDemo {...props} navigate={navigate} />
  
}

export default WithNavigate
