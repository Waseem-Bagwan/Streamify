import React from 'react'

export const UserCard = ({user}) => {
  return (
    <div className='card bg-base-200 rounded-xl transition-shadow'>
        <div className='card-body p-4'>
            <div className='flex items-center gap-3 mb-3'>
                <div className='avatar size-12'>
                    <img src={user.profilePic} alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}
