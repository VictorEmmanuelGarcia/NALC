import React , {useState , useEffect} from 'react';
import axios from 'axios';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane , faPlus , faRightFromBracket} from '@fortawesome/free-solid-svg-icons'

function Home() {
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [chatName , setChatName] = useState('');    
    const [chats , setChats] = useState([]);
    const reversedChats = chats.slice().reverse();

    const handleInputChange = (identifier) => (e) => {
      if (identifier === "input") {
        setInput(e.target.value);
      } else if (identifier === "chat") {
        setChatName(e.target.value);
      }
      // Add more conditions for additional inputs
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/threads/');
      setChats(response.data);
      console.log(chats);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateChat = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/threads/', {
        thread_name: chatName,
      });

      alert("Chat Created!");
      setChatName('');
      fetchChats(); // Refresh the chat list after creating a new chat
    } catch (error) {
      alert("Something Went Wrong, Try Again!");
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchChats(); // Fetch chats on component mount
  }, []);

    const handleSendMessage = () => {
      if (input.trim() === '') {
        // Display error or handle accordingly
      } else {
        axios.post('http://127.0.0.1:8000/langchain/', {
          key1: input,
        })
          .then(function (response) {
            // Handle success
            const responseData = response.data.response; // responseData is already an object
            // Add the user's message and the response data to the conversation
            setConversation([
              ...conversation,
              { text: input, user: true },
              { text: responseData.result, user: false }, 
            ]);
            setInput('');
          })
          .catch(function (error) {
            // Handle error
            console.log(error);
          });
      }
    };

  return (
    <div className="container-fluid gx-0">
      {/* Modal */}
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">New Chat</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col">
                  <input type="text" class="form-control" id="validationCustom03" value={chatName} placeholder='Chat Name'required onChange={handleInputChange("chat")}/>
                </div>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleCreateChat}>Create</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Side Bar */}
      <div className="chat-history">
        <button type="button" class="btn btn-outline-light newChatBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff" }} />
            <span style={{ marginLeft: "5px" }}>New Chat</span>
        </button>
        <button class="btn  logoutBtn" type="button">
            <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#ffffff",}} />
            <span style={{ marginLeft: "5px" , color: "white"}}>Log Out</span>
        </button>
        <br/>
        <br/>
        <div style={{ overflowY: 'scroll', height: '600px' }}>
          {reversedChats.map(chat => (
            <div key={chat.thread_id}>
              <a
                className="btn btn-warning"
                role="button"
                aria-disabled="true"
                style={{ width: '100%', display: 'block', marginBottom: '10px' }}
              >
                {chat.thread_name}
              </a>
            </div>
          ))}
        </div>
      </div>
      {/* Convo Page */}
      <div className="chat-input">
        <div className='convo'>
          <div>
            {conversation.map((message, index) => (
              <div key={index}>
                {message.user ? 'User: ' : 'Bot: '}
                {message.text}
              </div>
            ))}
          </div>
        </div>
        <div className='inputForm'>
            <div className="input-group mb-1">
                <input type="text" className="form-control" aria-label="Recipient's username" aria-describedby="button-addon2" value={input} onChange={handleInputChange("input1")}/>
                <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSendMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} style={{color: "#841818",}} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Home;