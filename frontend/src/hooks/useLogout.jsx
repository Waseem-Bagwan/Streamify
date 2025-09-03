import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { logout } from '../lib/api'
import { toast } from 'react-hot-toast' 

const useLogout = () => {
    const queryClient =  useQueryClient()
    const { mutate , isPending , error } = useMutation({
        
        mutationFn:logout,

        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ['authUser']})
            toast.success(`logout success`)
        } 
    })

    return { isPending, error , logoutMutation : mutate }
}

export default useLogout