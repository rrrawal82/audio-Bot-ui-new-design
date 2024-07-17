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
import BackgroundImage from '../images/background.jpg';
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class AiVoiceChat extends Component {
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
      if (question !== '') {
         const response = await axios.post("http://localhost:5000/ask_question", { question: question });
         if (response.data) {
          this.setState({ question: question });
          //this.setState({ answer: "It allows you to create complex user interfaces using “components,” or small, self-contained pieces of code. It controls the view layer in web applications. Despite the fact that React is more of a library than a language, it is frequently used in web development." });
          this.setState({ userInput: '' })
          this.setState({ answer: response.data.response });
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
    const backgroundStyle = {
      backgroundImage:`url(${BackgroundImage})`,
      height: "96vh",
      marginTop: "2%",
      //fontSize: "50px",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    };
    return (
      <div className="App" style={backgroundStyle} >
         <div className="row" style={{backgroundColor:'black',height:'500px',marginTop:'5%'}}>
              <div className="col-sm">
                <video  style={{marginTop:'-50%', width:'100%',height:'100%'}} autoPlay onPlaying={this.handleVideoPlaying} onEnded={this.handleVideoEnd} id="chatVideo">
                   <source src={this.state.videoURL} type="video/mp4" />
                </video>
                {this.state.isRecording ? (
                 <div style={{marginTop:'-50%'}} >
                    <Button variant="secondary" onClick={this.stop} disabled={this.state.micDisable} style={{float:'right'}}>
                    <img src={record} height="45" alt="record" />
                    </Button><br></br>
                        {this.state.loading && (  <div class="spinner-border spinner-border-md text-primary" style={{
              
                        }} role="status">
                        </div>
                        ) }
                </div>
                ) : (
                <div style={{marginTop:'-55%'}}>
                    <Button variant="secondary" onClick={this.start} disabled={this.state.isRecording} style={{float:'right'}}>
                    <img src={mic} height="45" alt="mic" />
                    </Button>
                </div>
                )}
              </div>
              <div className="col-sm" >
                 
                <div style={{maxHeight:'50%',overflowY:'scroll',width:'95%',height:'900px',position:'relative', marginTop:'4%',fontSize:'12px',
                  backgroundColor:'#ebebe0',borderRadius:'2%', overflowY:'hidden'}}> 
                  {this.state.question && <div style={{backgroundColor:'#cce0ff',padding:'9px',margin:'10px',borderRadius: '10px',overflow:'hidden',textAlign:'left'}}>
                      {this.state.question && (<span>{this.state.question}</span>)}
                      </div>}
                  {this.state.answer && <div className= "chatRequestText" style={{backgroundColor:'#8cd98c',padding:'9px', margin:'10px',borderRadius: '10px',marginTop:'10px',overflow:'hidden',textAlign:'left'}}>
                      {this.state.answer && (<span> {this.state.answer}</span>)}
                    </div>}
                    <div style={{position:'absolute',bottom:'0px'}}>
                    <textarea
                    onChange={this.handleInputChange} 
                    value={this.state.userInput}
                    style={{width:'500px',border:'0px',padding:'5px',fontSize:'12px',cologreyr:''}} placeholder='Type your message'/>
                    <Button className="open-button" id="myBtn" 
                    style={{ backgroundColor:'#ebebe0', color: 'blue',border: 'none', 
                    borderRadius: '8px', cursor: 'pointer',fontSize:'14px',float:'right' }} 
                    onClick={this.sendQuestion}
                    rows={4}
                    >SEND</Button>
                  </div>
                </div>
               
              </div>
             
            </div>
            
       
          
           {/*<Button variant="primary">
              <img src={chat} height="45" alt="chat" />
          </Button>*/}
            {/* <audio src={this.state.blobURL} controls="controls" /> */}
         
      </div>
    );
  }
}
