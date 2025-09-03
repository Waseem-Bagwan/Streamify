import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import OnBoarding from './pages/OnBoarding'
import { Toaster } from 'react-hot-toast'
import Notification from './pages/Noticafication.jsx'
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.jsx'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'



const App = () => {

  const { isLoading , authUser } = useAuthUser();
  const { theme } = useThemeStore()

  const isAuthenticated = Boolean(authUser);
  console.log(isAuthenticated)
  const isOnboarded = authUser?.isOnboarding;
  console.log(isOnboarded)

  if(isLoading) return <PageLoader/>
  return (
    <div className='min-h-screen' data-theme={theme}>

      <Routes>
      
        <Route path='/' element={ isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            {/*HomePage is children or whatever you put inside the layout */}
            <HomePage/>
          </Layout>
        ) : 
          (<Navigate to={ !isAuthenticated ? '/login' : '/onboarding'}/>)  
        }/>
        
        <Route path='/signup' element={!isAuthenticated? <SignUpPage/> : <Navigate to='/'/> }/>
        
        <Route path='/login' element={!isAuthenticated ? <LoginPage/> : <Navigate to={isOnboarded ? "/" : "/onboarding"} /> }/>
        
        <Route path='/chat/:id' element={isAuthenticated && isOnboarded ? (
        <Layout showSidebar={false}>
          <ChatPage/>
        </Layout>
        ) : <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} /> }/>
        
        <Route path='/notification' element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true} >
            <Notification/>
          </Layout>
        ) : (!isAuthenticated ? '/login' : '/onboarding') }/>
        
        <Route path='/call/:id' element={isAuthenticated && isOnboarded ? (
          <CallPage/>
        ) : (
          <Navigate to={!isAuthenticated ? '/login' : '/onboarding'}/>
        )}/>
        
        <Route path='/onboarding' element={isAuthenticated ?  
          (!isOnboarded ? <OnBoarding/> : <Navigate to="/"/> ):
          <Navigate to='/login'/>}/>
      
      </Routes>
      <Toaster />
    </div>
  )
}

export default App