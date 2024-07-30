// import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/user.css'
import { useConversationStore } from '../stores/store';


const User = ({ conversation }: { conversation: any }) => {
  const navigate = useNavigate()
  const { setSelectedConversation } = useConversationStore()
  const onClickLink = () => {
    setSelectedConversation(conversation)
    navigate(`/${conversation.userId}`)
  }

  return (
    <div className='user' key={conversation?.userId} onClick={() => onClickLink()}>

      <img src={conversation?.groupImage || conversation?.image} alt="user" />
      <div className="user_container">

        <h3>{conversation?.groupName || conversation?.name}</h3>
        <p>{conversation?.lastMessages?.content || 'Hi'}</p>
      </div>


    </div>
  )
}

export default User
