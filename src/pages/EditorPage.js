import React ,{useEffect, useRef, useState} from 'react'
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { Navigate, useLocation , useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';


const EditorPage = () => {

  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const {roomId} = useParams();
  useEffect(() =>{
    const init = async () =>{
      socketRef.current = await initSocket();

      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
    }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
    }
    init();
  },[]);

  const [clients , setClients] = useState([
    {socketId:1 , username:'Duo'},
    {socketId:2 , username:'John'},
    {socketId:3 , username:'Emma'},
   
  ]);


  if(!location.state){
    return  <Navigate to= '/' />
  }
 


  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img className='logoImage' src="/code-sync.png" alt="" />
          </div>
        <h3 className=''>Connected</h3>
        <div className='clientsList'>
          {
            clients.map(client => <Client key={client.socketId} username = {client.username} /> )
          }
        </div>
        </div>

        <button className='btn copyBtn' >Copy ROOM ID</button>
        <button className='btn leaveBtn' >Leave</button>

      </div>
      <div className='editorWrap'>
          <Editor />
      </div>
    </div>
  )
}

export default EditorPage



