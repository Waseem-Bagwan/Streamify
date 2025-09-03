import { LoaderIcon } from 'lucide-react'
import React from 'react'

const ChatLoader = () => {
  return (
    <div className='h-screen flex items-center justify-center flex-col'>
        <LoaderIcon className='animate-spin size-10 text-primary'/>
        <p className='text-center mt-4 font-mono text-lg'>
            Connecting to chat...    
        </p>    
    </div>
  )
}

export default ChatLoader