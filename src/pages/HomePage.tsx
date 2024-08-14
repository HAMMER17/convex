import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5"
import DateIndicator from "../components/DateIndicator"
import Time from "../lib/time"


const HomePage = ({ elem, me, previousMessage }: any) => {
  // console.log(elem)
  return (
    <>
      <DateIndicator message={elem} previousMessage={previousMessage} />
      <div key={elem._id} className={me?._id === elem.sender?._id ? "chat_text left" : "chat_text right"}>
        {/* <DateIndicator message={elem} previousMessage={previousMessage} /> */}
        <img src={elem.sender?.image} alt="ava" className='chat_ava' />
        <div>
          {elem.messageType === 'image' && <img src={elem.content} alt="ava" className='chat_pic' />}
          <div className='p'>{elem.messageType === 'text' && elem.content}
            <div className='chat_icon'> <span style={{ fontSize: '12px' }}>{Time(elem._creationTime)}</span>
              {!me ? <IoCheckmark /> :
                <IoCheckmarkDone style={{ color: 'black' }} />}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default HomePage
