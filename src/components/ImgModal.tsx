import { FaCamera } from 'react-icons/fa'
import '../style/imgmodal.css'
import { useEffect, useRef, useState } from 'react';
import { useConversationStore } from '../stores/store';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import toast from 'react-hot-toast';

const ChatModal = () => {
  const [isImage, setIsImage] = useState<File | null>(null)
  const [renderedImage, setRenderedImage] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const { selectedConversation } = useConversationStore()
  const sendImage = useMutation(api.messages.sendImage);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const me = useQuery(api.users.getMe);
  console.log(isLoading)

  const handleImg = async () => {
    setIsLoading(true);
    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": isImage!.type },
        body: isImage,
      });

      const { storageId } = await result.json();
      // Step 3: Save the newly allocated storage id to the database
      await sendImage({
        conversation: selectedConversation!._id,
        imgId: storageId,
        sender: me!._id,
      });
      setRenderedImage('')
      setIsImage(null);

    } catch (err) {
      toast.error("Failed to send image");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isImage) return setRenderedImage("");
    const reader = new FileReader();
    reader.onload = (e) => setRenderedImage(e.target?.result as string);
    reader.readAsDataURL(isImage);
  }, [isImage]);
  return (
    <div className="chat_modal">
      <h5>Add Photo</h5>
      <FaCamera size={50} className='chat_modal_icon' onClick={() => imageInput.current!.click()} />
      {renderedImage ? <img src={renderedImage} alt="ava" /> : null}
      <input type="file" hidden onChange={(e) => setIsImage(e.target.files![0])} ref={imageInput} />
      <button onClick={handleImg}>отправить</button>
    </div>
  )
}

export default ChatModal
