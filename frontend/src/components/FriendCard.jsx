import React, { useState } from 'react'
import { LANGUAGE_TO_FLAG } from '../constants'
import { Link } from 'react-router'

const FriendCard = ({friend}) => {
  
  return (
    <div className='card bg-base-200 rounded-xl hover:shadow-md transition-shadow '>
      <div className='card-body p-4 '>
        
        <div className='flex items-center gap-3 mb-3'>
          <div className='avatar size-12'>
            <img src={friend.profilePic} />
          </div>
          <h3 className='font-semibold truncate'>{capitalize(friend.fullName)}</h3>
        </div>

        <div className='flex flex-wrap gap-1.5 mb-3'>
          <span className='badge badge-secondary text-sm'>
            {getFlagLang(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className='badge badge-outline text-xs'>
            {getFlagLang(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div> 


        <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
          Message
        </Link>
      </div>
    </div>
  )
}

export default FriendCard

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