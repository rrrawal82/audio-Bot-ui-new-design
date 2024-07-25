import React, { Component, createRef  } from 'react';
import '../App.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import logo from '../images/quickparts_logo.JPG';
import pbi from '../images/pbi.jpg';
import MaskGroup from '../images/MaskGroup.png';
import mic from '../images/mic.png';
import record from '../images/record.png';
import chat from '../images/chat.png';
import videoUrl from '../images/chat_video.mp4';
import MicRecorder from 'mic-recorder-to-mp3';
import { IoMdSend } from "react-icons/io";
import { FaUpload } from "react-icons/fa6";
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
      userInput: ''
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
         const response = await axios.post("http://localhost:5000/ask_question", { question: question });
         if (response.data) {
           this.setState({ question: question });
           this.setState({ answer: response.data.response });
           //this.setState({ answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." });
           this.setState({ loadingChat: false });
         }
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
  render() {
    return (
      <div className="App">
        <Modal show='true' onHide={this.handleClose} style={{marginTop:'2%',width:'100% !important' }} size="lg">
        
          <Modal.Body style={{ width: '100%',height:'420px' }}>
         
            <div class="d-flex flex-row bd-highlight mb-3">
              <div class="p-2 bd-highlight">
                <video width="600" height="380" style={{marginTop:'-1%'}} autoPlay onPlaying={this.handleVideoPlaying} onEnded={this.handleVideoEnd} id="chatVideo">
                   <source src={this.state.videoURL} type="video/mp4" />
                </video>
              </div>
              <div class="p-2 bd-highlight" style={{position:'relative',width:'90%',height:'342px',marginTop:'22px',fontSize:'12px',backgroundColor:'#ebebe0',borderRadius:'2%', overflowY:'hidden'}}>
                  <div style={{overflowY:'scroll',height:'280px',maxHeight:'285px',paddingBottom:'10%'}}>
                        {this.state.question && (<div style={{backgroundColor:'#cce0ff',padding:'9px',borderRadius: '10px',overflow:'hidden' ,float:'right',width:'280px',marginRight:'5px'}}>
                        <span>{this.state.question}</span>
                        </div>)}
                        {this.state.answer && ( <div class= "chatRequestText" 
                        style={{backgroundColor:'#8cd98c',padding:'9px',borderRadius: '10px', marginRight:'8px',marginTop:'20px',overflow:'hidden',float:'left',width:'280px'}}>
                        <span> {this.state.answer}</span>
                        </div>)}
                        {this.state.loadingChat && (  <div class="spinner-border spinner-border-md text-primary" style={{
                              marginLeft: "45%",position:'absolute',top:'100px'
                          }} role="status">
                        </div>
                        ) }
                  </div>
                  <div style={{position:'absolute',bottom:'0px',marginTop:'10px'}}>
                    <textarea
                    onChange={this.handleInputChange} 
                    value={this.state.userInput}
                    style={{width:'335px',border:'0px',padding:'5px',fontSize:'12px',display:'block' ,bottom:'50px',marginBottom:'5px',borderRadius:'10px' }} placeholder='Type your message'/>
                    <Button className="open-button" id="myBtn" 
                    style={{ backgroundColor:'white', color: 'blue', padding: '10px 10px', border: 'none', 
                    borderRadius: '8px', cursor: 'pointer', width: '50px',fontSize:'10px',float:'right',position:'absolute' ,bottom:'5px',right:'3px'}} 
                    onClick={this.sendQuestion}
                    rows={4}
                    ><IoMdSend size="20px" /></Button>
                  </div>
              </div>
             
            </div>
            
            {this.state.loading && (  <div class="spinner-border spinner-border-md text-primary" style={{
                   marginLeft: "50%",
               }} role="status">
            </div>
            ) }
          </Modal.Body>
          <Modal.Footer style={{  }}>
             <Button variant="secondary" onClick={this.stop} disabled={this.state.micDisable}>
                <FaUpload size="45px" />
             </Button>
           
            {this.state.isRecording ? (
              <Button variant="secondary" onClick={this.stop} disabled={this.state.micDisable}>
                <img src={record} height="45" alt="record" />
              </Button>
            ) : (
              <Button variant="secondary" onClick={this.start} disabled={this.state.isRecording}>
                <img src={mic} height="45" alt="mic" />
              </Button>
            )}
           {/*<Button variant="primary">
              <img src={chat} height="45" alt="chat" />
          </Button>*/}
            {/* <audio src={this.state.blobURL} controls="controls" /> */}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
