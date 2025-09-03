import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getRecommendUsers , getUserFriends , getoutgoingFriendReqs , sendfriendreq } from '../lib/api.js';
import { Link } from 'react-router';
import { CheckCircleIcon, MapIcon, MapPinIcon, UserIcon, UserPlusIcon } from 'lucide-react';
import FriendCard from '../components/FriendCard.jsx'
import NoFriendsFound from '../components/NoFriendsFound.jsx'
import { LANGUAGE_TO_FLAG } from '../constants/index.js';



const HomePage = () => {

  const queryClient = useQueryClient();

  //to disabled btn for out going request
  const [outgoingRequestsIds, setoutgoingRequestsIds] = useState(new Set())

  //getting friends
  const { data: friends = [] , isLoading : loadingFriends } = useQuery({
    queryKey : ['friends'],
    queryFn : getUserFriends
  })

  // getting all recommended user
  const { data : recommendUser = [], isLoading : loadingUser } = useQuery({
    queryKey : ['users'],
    queryFn : getRecommendUsers
  })

  //sender, who have sent req
  const { data : outgoingFriendReqs } = useQuery({
    queryKey : ['outgoingFriendReqs'],
    queryFn : getoutgoingFriendReqs
  })

  //sending friends req
  const { mutate : sendReqMutation , isPending , error } = useMutation({
    mutationFn : sendfriendreq,
    onSuccess : () => {
      // once i send friend-req , update the out-going req ui 
      queryClient.invalidateQueries({ queryKey : ['outgoingFriendReqs']})
    }
  })

  useEffect(() => {
    //creating a set which store unique ids
    const outgoingIds = new Set()
    
    //if it has more than one req 
    if(outgoingFriendReqs && outgoingFriendReqs.length > 0){
        outgoingFriendReqs.forEach((req) => {
          outgoingIds.add(req.recipient._id)
      })
      setoutgoingRequestsIds(outgoingIds)
    }
    //wheneve it new value it run that many times
  },[outgoingFriendReqs])

  
  return (
    <div className='p-3 '>
      <div className='container space-y-10 mx-auto'>

        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to={'/notification'} className='btn btn-outline btn-sm'>
              <UserIcon className='size-5 mr-2'/>
              Friends Request
          </Link>
        </div>

        {loadingFriends ? (

          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'/>
          </div>
          
        ) : friends.length === 0 ? (

          <NoFriendsFound/>
        
        ) : (

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {friends.map((friend) => (
                <FriendCard key={friend._id || friend.id} friend={friend}/>
            ))}
          </div>

        )}

        <section className='mb-6 sm:mb-8'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl sm:text-2xl font-bold tracking-tight'>Meet New Learners</h2>
              <p className='opacity-70'>
                Discover perfect language exchange partner based on your profile
              </p>
            </div>
          </div>

          {loadingUser ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg'/>
            </div>
          ) : recommendUser.length === 0 ?  (
                <div className='card bg-base-200 p-6 text-center'>
                  <h3 className='font-semibold text-lg mb-2'> No recommended available</h3>
                  <p className='text-base-content opacity-70'>
                    check back later for new language learners
                  </p>
                </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mt-3 gap-4'>
              {recommendUser.map((user) => {
                                          //if true we update the btn
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div 
                    key={user._id} 
                    className='card bg-base-200 hover:shadow-lg transition-all duration-300'>

                    <div className='card-body p-5 space-y-4'>

                      <div className='flex items-center gap-3'>
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-full">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>


                        <div>
                          <h3 className='font-semibold text-lg'>{capitalize(user.fullName)}</h3>
                          {user.location && (
                            <div className='flex items-center gap-1.5 text-xs opacity-70'>
                              <MapPinIcon className='size-3 mr-1'/>
                              {user.location} 
                            </div>
                          )}
                        </div>
                      </div>
                        
                      <span className="badge badge-secondary flex items-center gap-1">
                        <span className="w-4 h-4 mb-1.5 ">{getFlagLang(user.nativeLanguage)}</span>
                        Native: {capitalize(user.nativeLanguage)}
                      </span>

                      <span className="badge badge-outline flex items-center gap-1">
                        <span className="w-4 h-4 mb-1.5">{getFlagLang(user.learningLanguage)}</span>
                        Learning: {capitalize(user.learningLanguage)}
                      </span>

                      
                      {user.bio && <p className='text-sm opacity-70' >{user.bio}</p>}

                      <button 
                        className={`btn w-full rounded-full mt-2 ${hasRequestBeenSent ? 'btn-disabled' : 'btn-primary'}`} 
                        onClick={() => sendReqMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className='size-4 mr-2'/>
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className='size-4 mr-2'/>
                            Send Friend Request
                          </>
                        )}
                        
                      </button>

                    </div>
                  </div>
                );
               
              })}
            </div>
          )}
        </section>  

      </div>
      
    </div>
  )
}

export default HomePage

function capitalize(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return str; // Handle non-string input or empty strings
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

function getFlagLang(language){
  if(!language) return null;

  const lowerLang = language.toLowerCase();

  const countryCode = LANGUAGE_TO_FLAG[lowerLang]

  if(countryCode){
    return (
      <img 
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={lowerLang} flag
        className='h-3 mr-1 inline-block'  
      />
    )
  }
}