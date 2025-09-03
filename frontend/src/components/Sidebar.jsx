import React, { createRef } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router'
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon} from 'lucide-react'

const Sidebar = () => {

  const { authUser } = useAuthUser() 
  const location = useLocation()
  const currentPath = location.pathname

  function capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return str; // Handle non-string input or empty strings
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const username = capitalizeFirstLetter(authUser?.fullName)

  return (
    <aside className='w-64 bg-base-200 border-r border-base-300 lg:flex flex-col hidden h-screen sticky top-0'>
      
      <div className='p-4 border-b border-base-300'>

        <Link to={'/'} className='flex items-center justify-center gap-3'>
            <ShipWheelIcon className='size-10 text-primary'/>
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider'>
              Streamify
            </span>
        </Link>
      
      </div>
      
      <nav className='flex-1 space-y-1 p-4'>

        <Link 
          to={'/'}
          className= {`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === '/' ? "btn-active" : ""
          }`}>
            <HomeIcon className='size-5 text-base-content opacity-70'/>
            <span className='text-lg'>Home</span>
        </Link>

        <Link 
          to={'/friends'}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            //highlight the btn when  
            currentPath === "/friends" ? "btn-active" : ""
          }`}>
             <UsersIcon className='size-5 text-base-content placeholder-opacity-70'/>
             <span className='text-lg'>Friends</span>
        </Link>

        <Link 
          to={'/notification'}
          className={`flex justify-start items-center btn btn-ghost w-full gap-3 normal-case ${
            currentPath === '/notification' ? "btn-active" : ""
          }`}
        >
          <BellIcon className='size-5 text-base-content opacity-70'/>
          <span className='text-lg'>Notification</span> 
        </Link>
      </nav>

      {/* user profile */}

      <div className='p-4 border-t border-base-300 mt-auto'>
          <div className='flex items-center gap-3'>
            
            <div className='avatar'>
              <div className='w-10 rounded-full'>
                 <img src={authUser?.profilePic} alt="user avatar"/>   
              </div>
            </div>
            
            <div className='flex-1'>
              <p className='font-semibold text-base'>{username}</p>
              <p className='text-sm text-success flex items-center gap-1'>
                <span className='size-2 rounded-full bg-success inline-block'>
                  Online
                </span>
              </p>
               
            </div>
          </div>

      </div>

    </aside>
  )
}

export default Sidebar