import axios from "axios";
import { axiosInstance } from "./axios.js";


export const signup = async (signupData) => {
    const res = await axiosInstance.post('/auth/signup',signupData);
    return res.data;
}

//when user get logout he instantly directed to login page  
export const getAuthUser =  async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        console.log(`Error in getAuthUser : ${error}`);
        return null
      }
}

export const completeOnboarding = async (userData) => {
    const res = await axiosInstance.post('/auth/onboarding',userData)
    return res.data
}

export const login = async (loginData) => {
    const res = await axiosInstance.post('/auth/login',loginData)
    return res.data
}

export const logout = async () => {
    const res = await axiosInstance.post('/auth/logout')
    return res.data
}

// ----------------------------------------


export const getRecommendUsers = async () => {
  const res = await axiosInstance.get('/user/')
  return res.data
}

export const getUserFriends = async () => {
  const res = await axiosInstance.get('/user/friends')
  return res.data
}

export const getoutgoingFriendReqs = async () => {
  const res = await axiosInstance.get('/user/out-friend-requests')
  return res.data
}

export const sendfriendreq = async (userId) => {
  const res = await axiosInstance.post(`user/friend-request/${userId}`)
  return res.data
}

export const getFriendRequests = async () => {
  const res = await axiosInstance.get(`user/friend-requests`)
  return res.data
}

export const acceptFriendRequest = async (userId) => {
  const res = await axiosInstance.put(`user/friend-request/${userId}/accept`)
  return res.data
}

export const getStreamToken = async () => {
  const res = await axiosInstance.get('/chat/token')
  return res.data
}