import React, { useState } from 'react'
import { login } from '../lib/api.js'
import { Eye, EyeClosedIcon, Lock, Mail, ShipWheelIcon } from 'lucide-react'
import { Link } from 'react-router'
import useLogin from '../hooks/useLogin.jsx'
import { useThemeStore } from '../store/useThemeStore.js'

const LoginPage = () => {

  const { theme } = useThemeStore();

  const [showPassword, setshowPassword] = useState(false)
  const [loginData, setloginData] = useState({
    email: "",
    password : ""
  })

  //i have wrapped this mutation into hooks 
  // const queryClient = useQueryClient()

  // const {mutate : loginMutation , isPending , error } = useMutation({
  //   mutationFn:login,

  //   onSuccess: () => {
  //     toast.success(`login successfully`);
  //     queryClient.invalidateQueries({queryKey : ['authUser']});
  //   }
  // })

  const { isPending , error , loginMutation } = useLogin()

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData)
  }
  
  return (
    <div className='min-h-screen flex items-center justify-center p-4' data-theme={theme}>

      <div className='flex flex-col w-full max-w-5xl lg:flex-row mx-auto border border-primary/25 bg-base-100 rounded-xl shadow-lg overflow-hidden'>

        {/* left panel */}
        <div className='flex flex-col w-full lg:w-1/2 p-4 sm:p-8'>

        {/* logo */}

        <div className='flex items-center justify-start gap-3 mb-4'>
            <ShipWheelIcon className='size-10 text-primary ' />
            <span className='text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              Streamify
            </span>
        </div>

        {error && (
            <p className='text-red-600 pl-4'> 
              {error.response?.data?.message || error.message}
            </p>
        )}

        {/* form */}
        <div className='w-full'>
          <form onSubmit={handleLogin}>

            <div className='space-y-4'>

              <div className='text-xl font-semibold'>
                <h2>Welcome Back</h2>
                <p className='text-sm opacity-70'>
                  Sign in to your account to continue the langauge journey
                </p>
              </div>



              {/* login Data */}

              <div className='space-y-3'>

                {/* email */}
                  <div className='form-control'>
                      <label className='label'>
                        <span className='label-text'>
                          Email
                        </span>
                      </label>

                      <div className='relative'>
                        <div className='absolute inset-y-6 left-0 pl-3 pointer-events-none flex items-center '>
                           <Mail className='size-5 text-base-content/40 '/> 
                        </div>
                      </div>

                      <input 
                        type="email" 
                        placeholder='hello@gmail.com'
                        className='input input-bordered w-full pl-10'
                        value={loginData.email}
                        onChange={(e) => setloginData({...loginData,email : e.target.value})}

                      />
                  </div>
                  
                  

                  {/* password */}
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text'>
                          Password
                      </span>
                    </label>

                    <div className='relative'>
                      <div className='absolute inset-y-6 left-0 pl-3 pointer-events-none flex items-center'>
                          <Lock className='size-5 text-base-content/40'/>
                      </div>
                    </div>

                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder='********'
                      className='input input-bordered w-full pl-10'
                      value={loginData.password}
                      onChange={(e) => setloginData({...loginData,password : e.target.value})}
                    />

                    {/* <button 
                      className='absolute '
                      onClick={() => setshowPassword(!showPassword)}  
                    >
                      {showPassword ? (
                        <EyeClosedIcon/>
                      ) : (<Eye/> )}
                    </button> */}

                  </div>

                  
              </div>
                
                <button 
                  type='submite'
                  className='btn btn-primary mt-4 w-full'
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className='loading loading-spinner loading-xs'></span>
                      loading...
                    </>
                  ): (
                    "Sign in"
                  )}
                </button>

                <div className='text-center mt-4'>
                    Don't have an account?{" "}
                    <Link to='/signup' className='text-primary hover:underline'>
                     Create one 
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
                <p className='opacity-65'>
                  Practice conversations, make friends, and improve your language together 
                </p>
              </div>
          </div>              
        </div>

        
      </div>
    </div>
  )
}

export default LoginPage