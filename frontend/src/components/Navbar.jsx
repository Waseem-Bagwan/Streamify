import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { BellIcon , LogOutIcon , ShipWheelIcon } from 'lucide-react'
import useLogout from '../hooks/useLogout'
import { Link, useLocation } from 'react-router'
import ThemeSelector from './ThemeSelector'

const Navbar = () => {

  const { authUser } = useAuthUser()

  const location = useLocation()
  const isChatPage = location.pathname?.startsWith('/chat')

  const { logoutMutation } = useLogout()
  
  
  return (
    <nav className='flex border-b items-center w-full p-4 px-8 bg-base-200 border-base-300 sticky top-0 z-30 h-16'>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className= {`flex  items-center gap-3 w-full justify-end`} >

        {/* logo, only if chat page */}
        {isChatPage && (
          <div className='pl-5'>
            <Link to={'/'} className='flex items-center justify-center gap-3'>
              <ShipWheelIcon className='size-9 text-primary'/>
              <div className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              <span>Streamify</span>
            </div>
            </Link>
          </div>
        )}
        
        <div className='flex items-center gap-3 ml-auto sm:gap-4'>
          <Link to={'/notification'}>
            <button className='btn btn-ghost btn-circle'>
              <BellIcon className='size-6 text-base-content opacity-70'/> 
            </button>
          </Link>
        </div>

        <ThemeSelector/>

        {/* user-profile */}
        <div className='avatar'>
          <div className='w-10 rounded-full '>
            <img src={authUser?.profilePic} alt="User avatar" />
          </div>
        </div>

        </div>
      </div>

      {/* logout btn */}
      <button onClick={logoutMutation} className='btn btn-ghost btn-circle'>
        <LogOutIcon className='size-6 text-base-content opacity-70'/>
      </button>

    </nav>
  )
}

export default Navbar