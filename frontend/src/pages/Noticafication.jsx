import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useState } from 'react'
import { acceptFriendRequest, getFriendRequests } from '../lib/api.js'
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react'
import NoNotificationFound from '../components/NoNotificationFound.jsx'


const Noticafication = () => {

  const queryClient = useQueryClient()  

  const {data : friendRequests, isLoading} = useQuery({
    queryKey : ['friendRequests'],
    queryFn : getFriendRequests,
  })


  const { mutate : acccepRequestMutation , isPending , error } = useMutation({
    mutationFn : acceptFriendRequest,
    onSuccess : () => {
      queryClient.invalidateQueries({ queryKey : ['friendRequests']})
      queryClient.invalidateQueries({ queryKey : ['friends']})
    }
  })

  const incomingRequests = friendRequests?.incomingRequest || [];
  const acceptRequests =friendRequests?.acceptedRequest || [];



  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto max-w-4xl space-y-6'>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-6'>
          Notification
        </h1>

        {isLoading ? (
          <div className='flex items-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className='space-y-4'>

                <h2 className='text-xl flex font-semibold items-center gap-2 '>
                  <UserCheckIcon className='w-5 h-5 text-primary'/>
                  Friend Requests
                  <span className='badge badge-primary brn-xs'>{incomingRequests.length}</span>
                </h2>

                <div className='space-y-3'>
                  {incomingRequests.map((req) => (

                    <div key={req._id} className='card bg-base-200 hover:shadow-md transition-shadow '>

                      <div className='card-body p-4 '>
                      
                        <div className='flex items-center justify-between '>
                          <div className='flex items-center gap-3 '>
                            <div className='avatar w-14 h-14 rounded-full bg-base-300'>
                              <img src={req.sender.profilePic} alt={req.sender.fullName} />
                            </div>

                            <div>
                              <h3 className='font-semibold'>{req.sender.fullName}</h3>
                              <div className='flex flex-wrap gap-1.5 mt-1'>
                                <span className='badge badge-secondary badge-sm'>
                                  Native: {req.sender.nativeLangauge}
                                </span>
                                <span className='badge badge-outline badge-sm'>
                                  Learning: {req.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                            <button 
                              className='btn btn-primary btn-sm'
                              onClick={() => acccepRequestMutation(req._id)}
                              disabled={isPending}
                            >
                              Accept
                            </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>  
              </section>


            )}

            {acceptRequests.length > 0 && (
              <section className='space-y-4'>

                <h2 className='flex items-center gap-2 text-xl font-semibold'>
                  <BellIcon className='size-5  text-success'/>
                  New Connection
                </h2>

                <div className='space-y-3'>
                  {acceptRequests.map((notification) => (
                    <div key={notification._id} className='card bg-base-200 shadow-sm'>
                      <div className='card-body p-4'>
                        <div className='flex items-start gap-3'>
                          
                          <div className='avatar mt-1 size-10 rounded-full'>
                            <img src={notification.recipient.profilePic} alt={notification.recipient.fullName} />
                          </div>

                          <div className='flex-1'>
                            <h2 className='font-semibold'>{notification.recipient.fullName}</h2>
                            <p className='text-sm my-1'>{notification.recipient.fullName} accepted your friend request</p>
                            <p className='flex items-center text-xs opacity-70'>
                            <ClockIcon className='size-3 mr-1'/>
                            Recently
                            </p>
                          </div>
                          
                          <div className='badge badge-success'>
                            <MessageSquareIcon className='size-3 mr-1'/>
                            New Friend
                          </div>

                        </div>

                        
                      </div>
                    </div>
                  ))}
                </div>

              </section>
            )}


            {incomingRequests.length === 0 && acceptRequests.length === 0 && <NoNotificationFound/>}
          </>
        )}
      </div> 
    </div>
  )
}

export default Noticafication