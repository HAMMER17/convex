import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import '../style/gpt.css'
import React from "react";
import gpt from '../assets/gpt.webp'
import robot from '../assets/robot.jpg'
import toast from "react-hot-toast";
// import { useConversationStore } from "../stores/store";

const ChatGPT = () => {
  // const { selectedConversation } = useConversationStore()
  const navigate = useNavigate()
  const messages = useQuery(api.messages?.list);
  const sendMessage = useMutation(api.messages?.send);
  const [text, setText] = React.useState<any>('')

  const user = useUser()
  // console.log(selectedConversation)
  const onClose = () => {
    navigate('/')
  }
  const handleSendMessage = async (e: any) => {
    e.preventDefault()
    try {
      await sendMessage({
        author: user.user?.firstName! || user.user?.username!,
        body: `@ai ${text}`
      })
      setText('')
    } catch (error) {
      toast.error('Wrong something')
      console.log(error)
    }
  }
  return (
    <div className="home_chat">
      <div className='chat_top'>
        <div className='chat_icon'>
          <img src={user.user?.imageUrl} alt="ava" />
          <p>{user.user?.firstName || user.user?.username}</p>

        </div>
        <div>
          <IoClose size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
      </div >
      <div className="container">
        {messages?.map((elem) => (
          <div className={elem.author === "ChatGPT" ? "container_ai blue" : "container_ai green"}
            key={elem._id}>
            <img src={elem.author === "ChatGPT" ? gpt : robot} alt="gpt" />
            <p>{elem.body}</p>
          </div>

        ))}
      </div>
      <form className='chat_input' onSubmit={handleSendMessage}>
        <input type="text" placeholder='Messages...' value={text} onChange={(e) => setText(e.target.value)} />
        <button>SMS</button>
      </form>
    </div>
  )
}

export default ChatGPT
