
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import '../style/modal.css'
import { useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { GenericId } from 'convex/values'
import { FaCamera } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useConversationStore } from '../stores/store'
import { Id } from '../../convex/_generated/dataModel'

const Modal = ({ onCancel }: any) => {
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [renderedImage, setRenderedImage] = useState("");


  const imgRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useConvexAuth()

  const users = useQuery(api.users?.getUsers, isAuthenticated ? undefined : "skip")
  const me = useQuery(api.users?.getMe, isAuthenticated ? undefined : "skip");

  const createConversation = useMutation(api.conversations.createConversation);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const { setSelectedConversation } = useConversationStore();

  const onClickUser = async () => {
    if (selectedUsers.length === 0) return;
    setIsLoading(true);
    try {
      const isGroup = selectedUsers.length > 1;
      let conversationId;
      if (!isGroup) {
        conversationId = await createConversation({
          participants: [...selectedUsers, me?._id!],
          isGroup: false,
        })
      } else {
        const postUrl = await generateUploadUrl();

        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage?.type! },
          body: selectedImage,
        });

        const { storageId } = await result.json();

        conversationId = await createConversation({
          participants: [...selectedUsers, me?._id!],
          isGroup: true,
          admin: me?._id!,
          groupName,
          groupImage: storageId,
        });
      }
      setSelectedUsers([]);
      setGroupName("");
      setSelectedImage(null);

      const conversationName = isGroup ? groupName : users?.find((user) => user._id === selectedUsers[0])?.name;

      setSelectedConversation({
        _id: conversationId,
        participants: selectedUsers,
        isGroup,
        image: isGroup ? renderedImage : users?.find((user) => user._id === selectedUsers[0])?.image,
        name: conversationName,
        admin: me?._id!,
      });
    } catch (error) {
      toast.error('Error something wrong')
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (!selectedImage) return setRenderedImage("");
    const reader = new FileReader();
    reader.onload = (e) => setRenderedImage(e.target?.result as string);
    reader.readAsDataURL(selectedImage);
  }, [selectedImage]);

  return (
    <div className="modal">
      <h1>Welcome my chat</h1>
      {/* <input type="text" placeholder='Group Name...' /> */}
      {renderedImage ? <img src={renderedImage} alt="selectedImage" /> : <img src="images.jpeg" alt="selectedImage" />}
      <FaCamera size={40} onClick={() => imgRef.current?.click()} style={{ cursor: 'pointer' }} />
      <input type="file" hidden onChange={(e) => setSelectedImage(e.target.files![0])} ref={imgRef} />
      <input type="text" placeholder='Create chat...' value={groupName} onChange={(e) => setGroupName(e.target.value)} />
      {users?.map((el) => (
        <div className={`modal_user ${selectedUsers.includes(el._id) ? 'modal_user green' : ''}`} key={el._id} onClick={() => {
          if (selectedUsers.includes(el._id)) {
            setSelectedUsers(selectedUsers.filter((id: GenericId<"users">) => id !== el._id));
          } else {
            setSelectedUsers([...selectedUsers, el._id]);
          }
        }}>
          <img src={el.image || "smile.jpg"} alt="selectedImage" />
          <p>{el.name}</p>
        </div>
      ))}
      <div className='modal_create'>
        <button style={{ background: 'blue', color: 'white' }} onClick={onCancel}>cancel</button>
        <button style={{ background: 'green', color: 'white' }} onClick={onClickUser}>
          {isLoading ? <ClipLoader size={20} color='white' /> : "Create"}
        </button>
      </div>
    </div>
  )
}

export default Modal
