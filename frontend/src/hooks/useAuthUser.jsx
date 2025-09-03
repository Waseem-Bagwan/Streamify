import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../lib/api.js'

const useAuthUser = () => {

    //first check, is user authenticated , if not based on it navigate him to different page
  const authUser = useQuery({
    
    //name of cache which store data temporily
    queryKey : ["authUser"],

    queryFn :getAuthUser, 

    //it just try once if we make it false
    retry:false

  })
    return {isLoading : authUser.isLoading , authUser : authUser.data?.user}
}


export default useAuthUser