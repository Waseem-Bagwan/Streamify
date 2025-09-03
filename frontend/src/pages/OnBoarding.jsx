import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { completeOnboarding } from '../lib/api.js'
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, User } from 'lucide-react'
import { LANGUAGES } from '../constants/index.js'


const OnBoarding = () => {

  const { authUser } = useAuthUser()

  const queryClient = useQueryClient();

  const [formState, setformState] = useState({
    fullName : authUser?.fullName || '',
    profilePic : authUser?.profilePic || '',
    bio : authUser?.bio || '',
    nativeLanguage : authUser?.nativeLanguage || '',
    learningLanguage : authUser?.learningLanguage || '',
    location : authUser?.location || ''
  })



  const { mutate : onboardingMutation , isPending , error } = useMutation({
    mutationFn : completeOnboarding,

    onSuccess : () => {
      toast.success(`profile onboarded successfully`)
      queryClient.invalidateQueries({queryKey : ["authUser"]})
    },

    onError : (error) => {
      toast.error(error.response?.data?.message);
    }

  });

  const handleOnboard = (e) => {
    e.preventDefault();
    onboardingMutation(formState)
  }

  const handleRandomAvatar = () => {
    const index = Math.floor(Math.random() * 100) + 1;
    const avatar = `https://avatar.iran.liara.run/public/${index}`;
    setformState({ ...formState,profilePic : avatar});
    toast.success(`Avatar changed successfuly`)
  }

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>

        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>

          <form onSubmit={handleOnboard} className='space-y-6'>

            {/* profile container */}
            <div className='flex flex-col items-center justify-center space-y-4'>

              {/* image-preview */}
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                { formState.profilePic ? (
                  <img 
                    src={formState.profilePic}
                    className='w-full h-full object-cover'
                  />
                ): (
                  <div className='flex items-center justify-center h-full'>
                    <CameraIcon className='size-12 text-base-content opacity-40'/>
                  </div>
                )}
              </div>

                {/* random avatar btn */}
              <div className='flex items-center'>
                <button onClick={handleRandomAvatar} className='btn btn-primary'>
                  <ShuffleIcon className='size-5 mr-2'/>
                  Generate Random Avatar
                </button>
              </div>
      
            </div>

              {/* full name */}
              <div className='form-control'>
                
                <label className='label'>
                  <span className='label-text'>Full Name</span>
                </label>

                {/* <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 items-center pointer-events-none'>
                    <User className='size-5 text-base-content/40'/>
                  </div>
                </div> */}

                <input
                  type="text"
                  name='fullName'
                  placeholder='Your full name'
                  value={formState.fullName}
                  className='input input-bordered w-full'
                  onChange={(e) => setformState({...formState,fullName : e.target.value})}
                />


              </div>

              {/* Bio */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>
                    Bio
                  </span>
                </label>

                <textarea 
                  type="text"
                  className='textarea textarea-bordered h-32 rounded-3xl'
                  placeholder='Tell other about yourself and learning language goals'
                  value={formState.bio}
                  onChange={(e) => setformState({...formState,bio : e.target.value})}
                  name='bio'
                  
                />


              </div>

              {/* Language */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='form-control'>

                      <label className='label'>
                        <span className='label-text'>Native Language</span>
                      </label>

                      <select 
                        name="nativeLanguage"
                        className='select select-bordered w-full'
                        value={formState.nativeLanguage}
                        onChange={(e) => setformState({...formState , nativeLanguage : e.target.value })}
                      > 
                        <option>Select your native langauge</option>
                        {LANGUAGES.map((lang) => (
                          <option key={`native-${lang}`} value={lang.toLowerCase()}>
                            {lang}
                          </option>
                        ))}
                      </select>

                  </div>

                  <div className='form-control'>
                        <label className='label'>
                          <span className='label-text'>
                            Learning Language
                          </span>
                        </label>

                        <select
                          name="learningLanguage"
                          className='select select-bordered w-full'
                          value={formState.learningLanguage}
                          onChange={(e) => setformState({...formState,learningLanguage : e.target.value})}
                        >

                          <option value="">Select learning you're language</option>
                          {LANGUAGES.map((lang) => (
                            <option key={`learning${lang}`} value={lang.toLowerCase()}>
                              {lang}
                            </option>
                          ))}

                        </select>
                  </div>
              </div>
              
              {/* Location */}
              <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>
                      Location
                    </span>
                  </label>
                  
                  <div className='relative'>
                      <MapPinIcon className='absolute size-5 top-6 transform -translate-y-1/2 left-3 text-base-content/40 opacity-70' />
                  </div>

                  <input 
                    type="text"
                    value={formState.location}
                    className='input input-bordered w-full pl-10'
                    name='location'
                    placeholder='City, Country'
                    onChange={(e) => setformState({...formState,location : e.target.value})}
                  />
              </div>

              <button className='btn btn-primary w-full' type='submite' disabled={isPending}>
                  {isPending ? (
                    <>
                      <LoaderIcon className='animate-spin size-5 mr-2'/>
                      Onboarding
                    </>
                  ) : 
                  <>
                    <ShipWheelIcon className='size-5 mr-2'/> 
                    Complete Onboarding 
                  </>}
              </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default OnBoarding