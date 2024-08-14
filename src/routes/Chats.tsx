// import React from 'react'
// import { IoCheckmark, IoCheckmarkDone, IoClose } from 'react-icons/io5'
import { useConversationStore } from '../stores/store'
import '../style/chat.css'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import toast from 'react-hot-toast'
import { BsEmojiSunglassesFill } from 'react-icons/bs'
import useComponentVisible from '../hooks/UseComponent'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { FaCamera } from 'react-icons/fa'
// import Time from '../lib/time'
// import DateIndicator from '../components/DateIndicator'
import HomePage from '../pages/HomePage'
import { IoClose } from 'react-icons/io5'
import ChatModal from '../components/ImgModal'
// import DateIndicator from '../components/DateIndicator'


const Chats = () => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)
  const [text, setText] = React.useState('')
  const [show, setShow] = React.useState(false)

  const setSendMessage = useMutation(api.messages?.setTextMessages)
  const me = useQuery(api.users?.getMe)
  const { selectedConversation, setSelectedConversation } = useConversationStore()
  const messages = useQuery(api.messages?.getMessages, {
    conversation: selectedConversation!?._id,
  });

  const navigate = useNavigate()
  const onClose = () => {
    setSelectedConversation(null)
    navigate('/')
  }
  const handleSendMessage = async (e: any) => {
    e.preventDefault()

    try {
      await setSendMessage({ conversation: selectedConversation!?._id, content: text, sender: me!?._id })
      setText('')
    } catch (error) {
      toast.error('error messages')
      console.log(error)
    }

  }
  React.useEffect(() => {

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);
  return (
    <div className='chat'>
      <div className='chat_top'>
        <div className='chat_icon'>
          <img src={selectedConversation?.groupImage || selectedConversation?.image} alt="ava" />
          <p>{selectedConversation?.groupName || selectedConversation?.name}</p>
        </div>
        <div>
          <IoClose size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
      </div >
      <div className='chat_container'>
        {messages?.map((elem, idx) => (
          <HomePage me={me} elem={elem} key={elem._id}
            previousMessage={idx > 0 ? messages[idx - 1] : undefined} />

        ))}
        {show && <ChatModal />}
      </div>

      <form className='chat_input' onSubmit={handleSendMessage}>

        <span ref={ref} onClick={() => setIsComponentVisible(true)}>
          {isComponentVisible && (
            <EmojiPicker

              theme={Theme.DARK}
              onEmojiClick={(emojiObject) => {
                setText((prev) => prev + emojiObject.emoji);
              }}

              style={{ width: "50%", position: "absolute", bottom: "5rem", left: "1rem", zIndex: 50 }}
            />
          )}
          <BsEmojiSunglassesFill
            size={25} style={{ color: 'yellow', margin: '5px', cursor: 'pointer' }} />
        </span>

        <input type="text" placeholder='Messages...' value={text} onChange={(e) => setText(e.target.value)} />
        <button>SMS</button>
        <span>
          <FaCamera size={25} onClick={() => { setShow((pre) => !pre) }}
            style={{ color: 'white', margin: '5px', cursor: 'pointer' }} />

        </span>
        {/* <span>
          <FaVideo size={20} onClick={() => videoInput.current!.click()}
            style={{ color: 'white', margin: '5px', cursor: 'pointer' }} />
          <input type="file" hidden onChange={(e) => setIsVideo(e.target.files![0])} ref={videoInput} />
        </span> */}
      </form>

    </div >
  )
}

export default Chats
