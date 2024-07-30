import { useQuery } from "convex/react";
import { api } from '../../convex/_generated/api'
import { useConvexAuth } from "convex/react"
import Header from "../components/Header"
import User from "../components/User"
import { useState } from "react";
import Modal from "../components/Modal";


const Home = () => {

  const [mod, setMod] = useState(false)
  const { isAuthenticated } = useConvexAuth()
  const users = useQuery(api.conversations?.getMyConversation, isAuthenticated ? undefined : "skip")

  // console.log(users)

  const onModal = () => {
    setMod(pre => !pre)
  }
  return (

    <>
      <div className="home">

        <Header onModal={onModal} />
        {users?.map((elem) => (
          <User conversation={elem} key={elem._id} />
        ))}
        <div className={mod ? "home_container" : "home_container_none"}>
          <Modal onCancel={onModal} />
        </div>
      </div>

    </>
  )
}

export default Home
