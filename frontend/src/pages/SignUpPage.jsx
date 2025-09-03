import React, { useState } from 'react'
import { Eye, EyeClosed, Lock, Mail, ShipWheelIcon, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/api.js'
import toast from 'react-hot-toast'
import { useThemeStore } from '../store/useThemeStore.js'

  const SignUpPage = () => {

    const { theme } = useThemeStore()

    const [showPassword, setshowPassword] = useState(false)
    const [signupData, setsignupData] = useState({
      fullName : "",
      email : "",
      password : ""
  })
  const navigate = useNavigate()
  const queryClient = useQueryClient();

  // changed name mutate to signupMutation    
  const { mutate : signupMutation , isPending , error } = useMutation({

    mutationFn : signup,

    //Refresh the user list after adding
    onSuccess : () => queryClient.invalidateQueries({ queryKey : ["authUser"]}),
    
  });

  const handleSignup = (e) => {
    e.preventDefault();
    //here we are calling it with new name 
    signupMutation(signupData);
  }
  


  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 ' data-theme={theme}>

      <div className='flex flex-col w-full max-w-5xl lg:flex-row mx-auto border border-primary/25  bg-base-100 rounded-xl shadow-lg overflow-hidden'>

        {/* left-Panel */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col '>
          {/* Logo */}
          <div className='mb-4 flex items-center gap-2 justify-start '>
            <ShipWheelIcon className='size-9 text-primary '/>
            <span className='text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>Streamify</span>
          </div>

          {/* Error  */}
          
          {error && (
            <div className='alert alert-error mt-2'>
              {error.response?.data?.message || error.message}
            </div>
          )}


          {/* form */}
          <div className='w-full'>

            <form onSubmit={handleSignup}>
            
              <div className='space-y-4'>

                <div className='text-xl font-semibold '>

                  <h2>Create an Account</h2>
                  <p className='text-sm opacity-70'>
                    Join Streamify and start your language learning adventure
                  </p>

                </div>

                <div className='space-y-3'>

                  {/* input field */}
                  <div className='form-control w-full'>

                    <label className='label'>
                        <span className='label-text'>Full Name</span>
                    </label>

                    <div className='relative'> 

                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <User className='size-5 text-base-content/40'/>
                      </div>

                      <input 
                        type="text"
                        value={signupData.fullName}
                        placeholder='John Doe'
                        className='input input-bordered w-full pl-10'
                        onChange={(e) => setsignupData({...signupData,fullName: e.target.value})}
                        required
                        />

                    </div>
                  </div>

                  {/* email input */}

                  <div className='form-control w-full'>

                    <label className='label'>
                      <span className='label-text'>
                        Email
                      </span>
                    </label>

                    <div className='relative'>
                      
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Mail className='size-5 text-base-content/40'/>
                      </div>

                       <input 
                        type="email"
                        value={signupData.email}
                        placeholder='john@gmail.com'
                        className='input input-bordered w-full pl-10'
                        onChange={(e) => setsignupData({...signupData,email: e.target.value})}
                        required
                        />

                    </div>
                    
                  </div>

                  {/* password */}

                  <div className='form-controll'>

                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>

                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 pointer-events-none flex items-center '>
                        <Lock className='size-5 text-base-content/40'/>
                      </div>

                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder='********'
                        className='input input-bordered w-full pl-10'
                        value={signupData.password}
                        onChange={(e) => setsignupData({...signupData,password : e.target.value})}
                        required
                      />
                     

                      <button 
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={() => setshowPassword(!showPassword)}
                      >
                        { 
                          showPassword ? 
                          <EyeClosed className='size-5 text-base-content/40'/> : 
                          <Eye className='size-5 text-base-content/40'/>
                        }
                      
                      </button>
                      
                    </div>
                  </div>
                  <p className='text-xs text-base-content/40 pl-2'>password must be at least 6 character</p>

                  <div className="form-control">
                    <label className='label cursor-pointer justify-start gap-2'>
                      <input
                        type="checkbox"
                        className='checkbox checkbox-sm'
                        required
                      />
                      <span className='text-sm leading-tight'>
                        I agree to the{" "} 
                        <span className='text-primary hover:underline'>Terms of service</span> and{" "}
                        <span className='text-primary hover:underline'>privacy policy</span>

                      </span>
                    </label>
                  </div>
                </div>

                <button className='btn btn-primary w-full' type='submit' disabled={isPending}>
                  {isPending ? (
                    <>
                    <span className='loading loading-spinner loading-xs'></span>
                    loading...
                    </>
                  ) : 'Create Account'}
                </button>

                <div className='text-center mt-4'>
                        Already hava an account{" "}
                        <Link to='/login' className='text-primary hover:underline'>
                          Sign in
                        </Link>
                </div>
              </div>


            </form>

          </div>
        </div>

        {/* right-panel */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img src="/up.png" className='size-full'/>
            </div>

            <div className='text-center space-y-3 mt-3'>
              <h2 className='text-xl font-semibold'>Connect with language partner worldwide</h2>
              <p className='opacity'>
                Practice conversations, make friends, and improve your language together 
              </p>
            </div>
          </div>              
        </div>
      </div>  
    </div>
  )
}

export default SignUpPage