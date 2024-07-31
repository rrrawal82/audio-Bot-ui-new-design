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
import uploadImg from '../images/uploadImg.jpg'
import { BsFiles } from "react-icons/bs";
import { CgOverflow } from 'react-icons/cg';

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
      uploadProgress: 0, // Track upload progress percentage
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
      this.state.files=[]
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
       
        try {
          const res = await axios.post("http://localhost:5000/upload_document", formData, {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              this.setState({uploadProgress:progress});
            },
          });
          // console.log('File uploaded successfully:', res.data);
          if(res.data)
          {
             this.props.navigate('/chatbot');
          }
        } catch (err) {
          console.error('Error uploading file:', err);
        } finally {
          this.setState({ uploading: false, uploadProgress: 0 }); // Reset after upload
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
    
  const progressBarStyle = {
    width: `${this.state.uploadProgress}%`,
    height: "5px",
    backgroundColor: "blue",
    position: "absolute",
    top: 0,
    left: 0,
  };


  return (
    <div className="App container"style={backgroundStyle} >
      <div className='row' >
        <div className='col-sm'  >
          
        </div>  
        <div className='col-sm'> 
          <div >
            <Card style={{height:'90vh' ,width:'90%',marginTop:'4%',marginLeft:'8%',borderRadius:'5px'}} >
                <Card.Body>
                  <Card.Title style={{color:'#204E7E',marginTop:'10px',fontSize: '1.875em'}} >Upload Files</Card.Title>
                  <Card.Text style={{top: '13px'}}>
                    <Card 
                    style={{position:'absolute', top: '80px', left: '10%',width:'80%', height:'70vh', border:'dotted 2px grey'  }}
                    onDragOver={this.handleDragOver}
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}
                    >
                        <Card.Body>
                          <img src={uploadImg} width="30%" color="#3385ff"  style={{top: '80px',cursor: 'pointer' }}  onClick={() => this.fileInput.click()}/>
                          <p ><b>Drag & Drop a file here </b>
                          </p><p style={{ fontSize: '1.0em',color:'black'}}><b>Or</b></p>
                          <p> <b>Click on upload icon to upload files</b></p>
                        
                          <input  type="file"  multiple
                            ref={fileInput => this.fileInput = fileInput}
                            onChange={this.handleAddFile}  
                            style= {{color:'white',border: 'none',cursor:'pointer',marginLeft:'38%', display: 'none' }}
                          />
                          <p>(Only PDF , XLS , DOC and PPT files . )</p>
                          <br>
                          </br>
                          
                          <Button  class="open-button" id="myBtn"  
                          style= {{color:'white', backgroundColor:'#204E7E',border: 'none', borderRadius:'50px',cursor:'pointer',width:'150px', height:'45px',marginLeft:'6%',marginTop:'-7%',zIndex:'10000',marginBottom:'5%'}}
                          onClick={() => this.uploadFiles(this.state.files)}       
                          >Save Files</Button>
                          <br></br>
                        {this.state.uploading && (
                            <div className="progress" style={{ marginTop: '-10px' }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${this.state.uploadProgress}%` }}
                                aria-valuenow={this.state.uploadProgress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              >
                              <div>Upload Progress: {this.state.uploadProgress}%</div>
                              </div>
                            </div>
                          )}
                        
                          {this.state.files.length > 0 && (
                            <div style={{ marginTop: '3px',overflowY:'scroll',maxHeight:'100px' }}>
                            
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
