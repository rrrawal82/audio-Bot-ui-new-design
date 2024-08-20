import React, { Component, createRef  } from 'react';
import '../App.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import MaskGroup from '../images/MaskGroup.png';
import videoUrl from '../images/chat_video.mp4';
import MicRecorder from 'mic-recorder-to-mp3';
import { IoMdSend } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { AiFillFileAdd } from "react-icons/ai";
import { AuthContext } from '../context/authContext';
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
      files: [],
      showInfo: true,
    };
    
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  videoEl = createRef();
  static contextType = AuthContext;
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
      console.log(this.props.showModal)
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
        const { currentUser } = this.context;
        const userid=currentUser?.id
        const token=currentUser?.verification_token
        try {
          const response = await axios.post("http://localhost:5000/upload_question", { audio: baseAudio,userid:userid,token:token});
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
    this.setState({ showInfo: false });
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
      const { currentUser } = this.context;
      const userid=currentUser?.id
      const token=currentUser?.verification_token
      if (question !== '') {
        const response = await axios.post("http://localhost:5000/ask_question", { question: question,userid:userid,token:token });
        if (response.data) {
           this.setState({ question: question });
           this.setState({ answer: response.data.response });
           //this.setState({ answer: "I  am good .How are you?" });
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
  handleAddFile=(e)=>{
    this.state.files=[]
    const files = Array.from(e.target.files);
    this.setState({ files }, () => {
      // Trigger file upload after file selection
      this.uploadFiles();
    });
  };
  uploadFiles = async () => {
    const formData = new FormData();
    this.state.files.forEach(file => {
      formData.append('file', file);
    });
    const { currentUser } = this.context;
    const userid=currentUser?.id
    const token=currentUser?.verification_token
    formData.append('userid', userid);
    formData.append('token', token);
    if (this.state.files.length !== 0) {
      this.setState({ uploading: true });
     
      try {
        const res = await axios.post("http://localhost:5000/upload_document", formData, {
        });
         console.log('File uploaded successfully:', res.data);
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
  
  render() {
    const { currentUser } = this.context; // Access context value using this.context
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
              <div class="p-2 bd-highlight" 
              className="chat-window"
              style={{position:'relative',width:'90%',height:'380px',marginTop:'3%',fontSize:'14px',backgroundColor:'rgb(51, 51, 51)', overflowY:'hidden',maxHeight:'337px',paddingBottom:'10%',textAlign:'left'}}>
                    {this.state.question && 
                    (<div className="message user-question" >
                    <span>{this.state.question}</span>
                    </div>)}
                    {this.state.answer && ( <span><div class= "chatRequestText" 
                    className="message bot-answer"
                    >
                    <span> {this.state.answer}</span>
                    </div></span>)}
                    {this.state.loadingChat && (  <div class="spinner-border spinner-border-md text-primary" style={{
                          marginLeft: "45%",position:'absolute',top:'100px'
                      }} role="status">
                    </div>
                    ) }
              </div>
           </div>
           {this.props.showModal}
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
            {/* Modal for instructions */}
            <Modal show={this.state.showInfo} onHide={this.handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Instructions</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Welcome to the Chatbot application!</p>
                <p>Before you can start interacting with the chatbot, please upload at least one file. This step is necessary to ensure that the chatbot has the information it needs to assist you effectively.</p>
                <p>Here's how you can upload a file:</p>
                <ul>
                  <li>Click the 'Upload' button in the sidebar.</li>
                  <li>Select the file(s) you want to upload from your computer.</li>
                  <li>Once the upload is complete, you will be able to start chatting with the chatbot.</li>
                </ul>
                <p>If you need any help with uploading files or have other questions, please refer to our support documentation or contact our support team.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
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
                  ><AiFillFileAdd  size="21px"/></Button>
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
