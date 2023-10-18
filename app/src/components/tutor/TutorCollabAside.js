import { useEffect, useState } from 'react';
import screenLarge from '../../images/screen-full-svgrepo-com.svg';
import screenNormal from '../../images/screen-normal-svgrepo-com.svg'
import DiableVideoImage from '../../images/video-recorder-off-svgrepo-com.svg'; 
import { useLocation } from 'react-router-dom';
import { socket } from '../../socket';
import {Peer} from 'peerjs';

const TutorAside = () => {

    let [mssg, setMssg] = useState('hi');
    let [mssgList, setMssgList] = useState([]);

    let location = useLocation(); 
    let [authorization, setAuthorization] = useState(false);
    let [peerId, setPeerId] = useState('')
    let [conn, setConn] = useState('');
    let [videoLoader, setVideoLoader] = useState('');
    let [largeScreen, setLargeSreccn] = useState(false);
    let [screenType, setScreenType] = useState(screenLarge);
    let [isVisuals, setIsVisuals] = useState(true)

    let [visuals, setVisuals ]= useState(true)
    let [uname, setUname] = useState('')

    let handleChat = e => {
        if(mssg !== null){
            let mssg_cnt = 

            <div className="TutorMessageCnt">
                <div className='TutorMessageCntContent'>
                    {mssg}
                </div>
            </div>

            setMssgList(item => [...item, mssg_cnt])
            document.querySelector('#TutorChatTextarea').value = '';

        }
        
    }

    

    



    let handleVidActions = e => {
       
    }

   
    
    useEffect(() => {
 

        let myVideo = document.querySelector('.tutor-video-tab');
        let room_id = '1234567890asdfghjkl';

        let peer = new Peer(undefined, {});
        peer.on('open', id => {
            socket.emit('join-room', room_id, id)
            console.log(id);
        })

        const peers = {}

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        .then(stream => { 

            addVideoStream(myVideo, stream);
            peer.on('call', call => {
                let file = visuals ? stream : '';

                setVideoLoader('Connecting...')
                call.answer(file);
                call.on('stream', userVideoStream => {
                    setVideoLoader('')
                    addVideoStream(myVideo, userVideoStream)
                })
            })

            socket.on('user-connected', user_id => {
                connectToNewUser(user_id, stream)
                peer.on('call', call => {
                    let file = visuals ? stream : '';
                    setVideoLoader('Connecting...')
                    call.answer(file)
                    call.on('stream', userVideoStream => {
                        addVideoStream(myVideo, userVideoStream)
                    })
                })
            })
        })
        .catch(e => console.log(e));

        socket.on('user-disconnected', user_id => {
            if (peers[user_id]) peers[user_id].close()
        })
          
        peer.on('open', id => {
            socket.emit('join-room', room_id, id)
        })

        function connectToNewUser(userId, stream) {
            
            const call = peer.call(userId, stream);
            setVideoLoader('Connecting...')
            call.on('stream', userVideoStream => {
                addVideoStream(myVideo, userVideoStream)
            })

            call.on('close', () => {
              myVideo.src = ''
            })
          
            peers[userId] = call
        }
          
        function addVideoStream(video, stream) {
            console.log(stream)
            video.srcObject = stream
            setVideoLoader('Connecting...')
            video.addEventListener('loadedmetadata', () => {
              video.play()
              setVideoLoader('')
            })
        }

        
    }, [location, peerId])


    return ( 
        <>
            <div className="TutorAside">

                <div className="TutorAsideVideoCnt">
                    <video className='tutor-video-tab'>
                    </video>
                    <ul>
                        <li  className="video-size" style={{background: '#fff', opacity: '.4'}} onClick={e => handleVidActions(e)}>
                            <img src={screenType} style={{height: '25px', width: '30px'}} alt="..." />
                        </li>
                        <li className="disable-visuals" onClick={e => visuals ?  setVisuals(false) : setIsVisuals(true)}>
                            <img src={DiableVideoImage} style={{height: '25px', width: '30px'}} alt="..." />

                        </li>
                    </ul>
                </div>


                <div className="TutorAsideChatCnt">
                    <div className="TutorAsideChatBox">

                        {
                            mssgList
                        }

                    </div>
                    <div className="TutorAsideChatControl" style={{background: '#fff'}}>
                        <span style={{width: '80%',height: '80%', float: 'left', background: '#fff'}}>
                            
                            <textarea type="text" id='TutorChatTextarea'  style={{width: '100%', borderRadius: '5px', border: 'none', display: 'flex', alignItems: 'center', background: '#f9f9f9', height: '40px', padding: '10px 5px 5px 5px', fontFamily: 'serif', fontSize: 'medium', outline: 'none', resize: 'none'}} onInput={e => setMssg(e.target.value)} placeholder='Type Your Message Here'></textarea>

                        </span>
                        <span style={{width: '20%', height: '70%', float: 'right', background: '#fff'}}>
                            <button style={{height: '40px', width: '90%'}} onClick={handleChat}>
                                send
                            </button>
                        </span>
                    </div>
                </div>

            </div>
        </>
     );
}
 
export default TutorAside;