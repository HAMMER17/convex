// import React from 'react'
import { FaUserPlus } from "react-icons/fa";
import '../style/header.css'
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
// import { useConversationStore } from "../stores/store";
// import { useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";

const Header = ({ onModal }: any) => {
  // const me = useQuery(api.users?.getMe)
  const user = useUser()
  // const { setSelectedConversation }: any = useConversationStore()
  // console.log(me?._id)
  const navigate = useNavigate()

  const handleLink = () => {
    // setSelectedConversation(me?._id)
    navigate(`/chat/${user.user?.id}`)
  }
  return (
    <div className="header">
      <SignedOut >

        <SignInButton>
          <button style={{ padding: '10px', background: 'white', borderRadius: '10px', cursor: 'pointer' }}>
            войти
          </button>
        </SignInButton>


      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <p>{user.user?.firstName || user.user?.username}</p>
      <p onClick={() => handleLink()} style={{ cursor: 'pointer' }}>ChatGPT</p>
      <FaUserPlus size={20} style={{ cursor: 'pointer' }} onClick={onModal} />
    </div>
  )
}

export default Header
