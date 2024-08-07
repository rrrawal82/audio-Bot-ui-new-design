import React, { Component, createRef  } from 'react';
import '../App.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import logo from '../images/quickparts_logo.JPG';
import pbi from '../images/pbi.jpg';
import MaskGroup from '../images/MaskGroup.png';
import videoUrl from '../images/chat_video.mp4';
import MicRecorder from 'mic-recorder-to-mp3';
import { IoMdSend } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { SiFiles } from "react-icons/si";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class AudioDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blobURL: '',
      isBlocked: false,
      show: false,
      isRecording: false,
      newVideo: false,
      micDisable: false,
      videoURL: videoUrl,
      loading:false,
      loadingChat:false,
      output_video_url:'',
      question:'',
      answer:'',
      userInput: '',
      files: []
    };
    
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  videoEl = createRef();

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      })
      .catch(() => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true });
      });
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .then(() => {
          this.setState({ newVideo: false, isRecording: true });
          
        }).catch(e => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder.stop().getMp3()
      .then(async ([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        const file = new File(buffer, 'audio.mp3', { type: blob.type, lastModified: Date.now() });
        const baseAudio = await this.audioToBase64(file);
        this.setState({ loading: true });
        // Send base64 audio to the backend
        try {
          const response = await axios.post("http://localhost:5000/upload_question", { audio: baseAudio });
          //const newVideoURL = `http://localhost:5000${response.data.output_video_url}`;
          const newVideoURL = response.data.output_video_url;
          this.setState({ videoURL: newVideoURL, newVideo: true });
          this.setState({ output_video_url: response.data.output_video_url });
          this.setState({ question: response.data.transcript_text });
          this.setState({ answer: response.data.response });
          this.setVideo(newVideoURL);
        } catch (err) {
          console.error(err);
        }

        this.setState({ blobURL, isRecording: false });
      }).catch(e => console.log(e));
  };

  audioToBase64 = (audioFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(audioFile);
    });
  };

  setVideo = (newVideoUrl) => {
    let vid = document.getElementById("chatVideo");
    vid.src = newVideoUrl;
    this.setState({ newVideo: true });
    this.setState({ loading: false });
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
    try {
      //console.log(this.state.output_video_url)
      if(this.state.output_video_url !== '')
      {
        //const output_video_url = `http://localhost:5000${this.state.output_video_url}`;
       // const response = axios.post("http://localhost:5000/delete_file", { file_path: this.state.output_video_url });
      }
      
    } catch (err) {
      console.error(err);
    }
  };
  sendQuestion = async () => {
    try {
      const question = this.state.userInput;
      this.setState({ loadingChat: true });
      if (question !== '') {
         //const response = await axios.post("http://localhost:5000/ask_question", { question: question });
       // if (response.data) {
           this.setState({ question: question });
           // this.setState({ answer: response.data.response });
           this.setState({ answer: "I  am good .How are you?" });
           this.setState({ loadingChat: false });
        // }
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  handleVideoPlaying = () => {
    this.setState({ micDisable: false });
  };

  handleInputChange = (e) => {
    this.setState({ userInput: e.target.value });
  };
  handleAddFile=(e)=>{
    this.state.files=[]
    const files = Array.from(e.target.files);
    this.setState({ files }, () => {
      // Trigger file upload after file selection
      this.uploadFiles();
    });
  };
    uploadFiles = async () => {
      const { files } = this.state;
      if (files.length === 0) return;
  
      this.setState({ loading: true });
  
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
  
      try {
        const response = await axios.post('http://localhost:5000/upload_files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Files uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        this.setState({ loading: false });
      }
    };
  
  
  render() {
    return (
      <div className="App">
          <div class="d-flex flex-row bd-highlight mb-3">
              <div class="p-2 bd-highlight">
                <video width="600" height="400" style={{marginTop:'-1%'}} autoPlay onPlaying={this.handleVideoPlaying} onEnded={this.handleVideoEnd} id="chatVideo">
                   <source src={this.state.videoURL} type="video/mp4" />
                </video>
              </div>
              <input  type="file"  multiple
                            ref={fileInput => this.fileInput = fileInput}
                            onChange={this.handleAddFile}  
                            style= {{color:'white',border: 'none',cursor:'pointer',marginLeft:'38%', display: 'none' }}
                          />
              <div class="p-2 bd-highlight" style={{position:'relative',width:'90%',height:'380px',marginTop:'3%',fontSize:'14px',backgroundColor:'rgb(51, 51, 51)', overflowY:'hidden',maxHeight:'337px',paddingBottom:'10%',textAlign:'left'}}>
                    {this.state.question && (<div style={{backgroundColor:'#cce0ff',padding:'9px',borderRadius: '10px',overflow:'hidden' ,float:'right',marginRight:'5px'}}>
                    <span>{this.state.question}</span>
                    </div>)}
                    {this.state.answer && ( <div class= "chatRequestText" 
                    style={{backgroundColor:'rgb(51, 51, 51)',color:'white',padding:'9px',borderRadius: '10px', marginRight:'8px',marginTop:'20px',overflow:'hidden',float:'left',maxWidth:'380px'}}>
                    <span> {this.state.answer}</span>
                    </div>)}
                    {this.state.loadingChat && (  <div class="spinner-border spinner-border-md text-primary" style={{
                          marginLeft: "45%",position:'absolute',top:'100px'
                      }} role="status">
                    </div>
                    ) }
              </div>
           </div>
            
            {this.state.loading && (  <div class="spinner-border spinner-border-md text-primary" style={{
                   marginLeft: "50%",
               }} role="status">
            </div>
            ) }
         
            {/* <span style={{float:'left'}}> [Note : Upload files to start interacting using AI]</span>
             <Button variant="secondary" onClick={this.stop} disabled={this.state.micDisable}>
                <FaUpload size="42px" />
             </Button>
            */}
            
            <div style={{position:'absolute',bottom:'0px',marginTop:'10px'}}>
                  <textarea
                  onChange={this.handleInputChange} 
                  value={this.state.userInput}
                  style={{width:'82vw',background: 'rgb(51, 51, 51)',color:'white',border:'0px',marginLeft:'5px',padding:'7px',fontSize:'14px',display:'block' ,bottom:'50px',marginBottom:'50px',borderRadius:'10px' }} placeholder='Type your message'/>
                  {this.state.isRecording ? (
                  <Button className="open-button"  onClick={this.stop}  style={{ backgroundColor:'rgb(51, 51, 51)', color: 'white', padding: '10px 10px',marginTop:'-98px', border: 'none', 
                  borderRadius: '8px', cursor: 'pointer', width: '50px',fontSize:'10px',float:'right',position:'relative' ,marginRight:'35px'}}  disabled={this.state.micDisable}>
                  <FaMicrophone size="18px" color='blue'/>
                  </Button>
                  ) : (
                  <Button className="open-button" onClick={this.start}  style={{ backgroundColor:'rgb(51, 51, 51)', color: 'white', padding: '10px 10px',marginTop:'-98px', border: 'none', 
                  borderRadius: '8px', cursor: 'pointer', width: '50px',fontSize:'10px',float:'right',position:'relative' ,marginRight:'35px'}}  disabled={this.state.isRecording}>
                 <FaMicrophone size="18px"/>
                  </Button>
                  )}
                  <Button className="sendChatBtn" id="myBtn" 
                  style={{ backgroundColor:'rgb(51, 51, 51)', color: 'white', padding: '10px 10px',marginTop:'-100px', border: 'none', 
                  borderRadius: '8px', cursor: 'pointer',marginRight:'70px', width: '50px',fontSize:'12px',float:'right',position:'relative' ,}} 
                  rows={4} onClick={() => this.fileInput.click()}
                  ><SiFiles  size="21px"/></Button>
                  <Button className="sendChatBtn" id="myBtn" 
                  style={{ backgroundColor:'rgb(51, 51, 51)', color: 'white', padding: '10px 10px',marginTop:'-100px', border: 'none', 
                  borderRadius: '8px', cursor: 'pointer', width: '50px',fontSize:'12px',float:'right',position:'relative' ,}} 
                  onClick={this.sendQuestion}
                  rows={4}
                  ><IoMdSend size="23px"/></Button>
            </div>
           {/*<Button variant="primary">
              <img src={chat} height="45" alt="chat" />
          </Button>*/}
            {/* <audio src={this.state.blobURL} controls="controls" /> */}
         
      </div>
    );
  }
}
