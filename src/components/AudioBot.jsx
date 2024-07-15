import React, { Component,useState ,useEffect, useRef,createRef } from 'react';
import '../App.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import logo from '../images/quickparts_logo.JPG';
import pbi from '../images/background.jpg';
import pdxp from '../images/pdf-doc-xls-ppt.jpg';
import MaskGroup from '../images/MaskGroup.png'
import mic from '../images/mic.png'
import record from '../images/record.png'
import chat from '../images/chat.png'
import videoUrl from '../images/chat_video.mp4'
import newVideoUrl from '../images/new-video.mp4' 
import MicRecorder from 'mic-recorder-to-mp3';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { BsFiles } from "react-icons/bs";
const Mp3Recorder = new MicRecorder({ bitRate: 128 });
export default class AudioDemo extends Component {

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
   videoEl = createRef(); 
   componentDidMount(){
    console.log(this.state.newVideo)
      navigator.getUserMedia({ audio: true },
        () => {
          console.log('Permission Granted');
          this.setState({ isBlocked: false });
        },
        () => {
          console.log('Permission Denied');
          this.setState({ isBlocked: true })
        },
      );
   } 
    start = () => {
        if (this.state.isBlocked) {
          console.log('Permission Denied');
        } else {
          Mp3Recorder
            .start()
            .then(() => {
              this.setState({ newVideo: false });
              this.setState({ isRecording: true });
            }).catch((e) => console.error(e));
        }
      };
      stop = () => {
        Mp3Recorder
          .stop()
          .getMp3()
          .then(async([buffer, blob]) => {
           const blobURL = URL.createObjectURL(blob)
           const file = new File(buffer, 'audio.mp3', {
            type: blob.type,
            lastModified: Date.now()
           });
            let baseAudio=await this.audioToBase64(file) 
            //console.log(baseAudio)
            this.setVideo();
            //call API
            try{
              const res = await axios.post("/auth/register", baseAudio)
              
            }catch(err){
              //this.setError(err.response.data)
            }

            this.setState({ blobURL, isRecording: false });
          }).catch((e) => console.log(e));

      };
      audioToBase64 = async(audioFile)=> {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onerror = reject;
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(audioFile);
        });
      }

      setVideo = () => {
        let vid = document.getElementById("chatVideo");
        vid.src = newVideoUrl;
        this.setState({ newVideo: true });
        console.log(this.state.newVideo)
             //this.setState({ videoUrl: require('../images/new-video.mp4') });
        
      }
      handleClose() {
        this.setState({ show: false });
      }
      handleShow() {
        this.setState({ show: true });
      }
      handleVideoEnd = () => {
        let vid = document.getElementById("chatVideo");
        vid.src = videoUrl;
        this.setState({ micDisable: false });
        console. log("The video has ended");
     };
     handleVideoPlaying=()=>{
      this.setState({ micDisable: true });
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

    uploadFiles = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file)
    if(file.length!=0)
    {
      try {
        const res = await axios.post("http://localhost:5000/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('File uploaded successfully:', res.data);
        // Handle success or update UI accordingly
      } catch (err) {
        console.error('Error uploading file:', err);
        // Handle error or update UI accordingly
      }
    }else{
      alert('Select atleast one file to upload.')
    }
  }
 render()
   {
  return (
    <div className="App" style={{ position: 'relative'}}>
         <Card style={{ position:'absolute', top: '40px', left: '25%',width:'50%', height:'90%' }}>
            <Card.Body>
              <Card.Title style={{color:'#ff6600',marginTop:'0px',fontSize: '1.875em'}} >UPLOAD FILES</Card.Title>
              <Card.Text style={{top: '13px'}}>
                 <Card 
                 style={{position:'absolute', top: '60px', left: '10%',width:'80%', height:'80%', border:'1px',
                 borderStyle: 'dotted',borderColor:'grey',
                 borderColor: this.state.dragOver ? 'blue' : 'grey', // Highlight border on drag over
                }}
                 onDragOver={this.handleDragOver}
                 onDragEnter={this.handleDragEnter}
                 onDragLeave={this.handleDragLeave}
                 onDrop={this.handleDrop}
                 >
                    <Card.Body>
                      <BsFiles size = '50px' color="#0073e6"  style={{top: '80px'}}/>
                      <p style={{ fontSize: '1.2em',marginTop:'20px',color:'grey'}}><b>Drag & Drop  </b>
                      </p><p><b>Or</b></p>
                      <input  type="file"  multiple
                        ref={fileInput => this.fileInput = fileInput}
                        onChange={this.handleAddFile}  
                        style={{ marginLeft: '20%' }}
                      />
                      \ <p>(Only PDF , XLS , DOC and PPT files . )</p>
                     
                    
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
            <Button  class="open-button" id="myBtn"  
              style= {{color:'white', backgroundColor:'#3385ff',border: 'none', borderRadius:'50px',cursor:'pointer',width:'150px', height:'45px',marginLeft:'38%',marginTop:'-3%'}}
              onClick={() => this.uploadFiles(this.state.files)}       
              >SAVE FILES</Button>
            </Card>
           
        <img src={pbi} style={{width:'85%'}}></img>
         {/* <div class="main" style={{position:'fixed',bottom: '23px',right: '28px', display:'block'}}>
            <img src={MaskGroup} style={{borderRadius:'50%',width:'90%',border:'5px solid black',marginBottom:'5px'}}/><br/>
           
            <button class="open-button" id="myBtn"  onClick={this.handleShow}
            style= {{backgroundColor:'#010000',color:'white',padding:'13px 20px',border: 'none', borderRadius:'8px',cursor:'pointer',width:'200px'}}>Ask about it</button>
        </div> */}
    
          <Modal show={this.state.show} onHide={this.handleClose} size="lg">
            <Modal.Header  style={{backgroundColor:'black'}}>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
            </Modal.Header>
            <Modal.Body style={{backgroundColor:'black',width:'100%'}}>
              <div>
              <video width="750" height="500" autoPlay loop={this.props.newVideo} onplaying={this.handleVideoPlaying} onEnded={this.handleVideoEnd} id="chatVideo" >
                  <source src={videoUrl} type="video/mp4"/>
              </video>
                   {/* <video
                  style={{ maxWidth: "100%", width: "1000px", margin: "0 auto" }}
                  playsInline
                  loop
                  muted
                  alt="All the devices"
                  src={chatVideo}
                  ref={this.videoEl}
                />  */}
              </div>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor:'black'}}>
              {this.state.micDisable}
             {this.state.isRecording?(
              <Button variant="secondary" onClick={this.stop} disabled={this.state.micDisable} >
                <img src={record}  height="55"/>
              </Button>
              ) : (  <Button variant="secondary" onClick={this.start} disabled={this.state.isRecording} >
                <img src={mic}  height="55"/>
              </Button>)}
              <Button variant="primary" >
                 <img src={chat} height="55" />
              </Button>
            <audio src={this.state.blobURL} controls="controls" />
            </Modal.Footer>
          </Modal>       
    </div>
  );
}
}

