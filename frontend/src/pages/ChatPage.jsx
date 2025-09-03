import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router'
import { getStreamToken } from '../lib/api'
import useAuthUser from '../hooks/useAuthUser'
import { Channel , ChannelHeader , Chat , MessageInput , MessageList , Thread , Window } from 'stream-chat-react'
import { useEffect } from 'react'
import { StreamChat } from 'stream-chat'
import toast from 'react-hot-toast'
import ChatLoader from '../components/ChatLoader'
import CallButton from '../components/CallButton'


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {

  const { id : targetUserId } = useParams()

  const [chatClient, setchatClient] = useState(null);
  const [channel, setchannel] = useState(null);
  const [loading, setloading] = useState(true);

  const { authUser } = useAuthUser()

  const { data : tokenData } = useQuery({
    queryKey : ['streamToken'],
    queryFn : getStreamToken,
    enabled : !!authUser // this will only run when authUser is available  
  })


useEffect(() => {
  const initChat = async () => {
    if (!tokenData?.token || !authUser) return;

    console.log(`Initializing stream chat client...`);

    try {
      const client = StreamChat.getInstance(STREAM_API_KEY);

      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData?.token
      );

      const customChannelId = [authUser._id, targetUserId].sort().join("-");

      const channel = client.channel("messaging", customChannelId, {
        members: [authUser._id, targetUserId],
      });

      await channel.watch();

      setchatClient(client);
      setchannel(channel);
    } catch (error) {
      console.log(`Error in creating client channel :${error}`);
      toast.error("Could not connect to chat please try again");
    } finally {
      setloading(false);
    }
  };

  initChat();

  // ✅ disconnect when component unmounts or dependencies change
  return () => {
    if (chatClient) {
      chatClient.disconnectUser();
      setchatClient(null);
      setchannel(null);
    }
  };
}, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`

      channel.sendMessage({
        text : `i have started a video. join me here ${callUrl}`
      });

      toast.success(`Video link sent successfully `)
    }
  }

  if(loading || !chatClient || !channel) return <ChatLoader/>;

  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative '>
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
            <ChannelHeader/>
            <MessageList />
            <MessageInput focus />
          </Window>
          </div>
          <Thread/>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage