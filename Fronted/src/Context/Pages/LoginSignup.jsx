import React, { useState } from 'react'
import './CSS/LoginSignup.css'


const LoginSignup = () => {

  const [state,setState] = useState('login');
   const [formData,setFormData] = useState({
    username:"",
    password:"",
    email:""
   })

    const changeHandler = (e) => {
      setFormData({...formData,[e.target.name]:e.target.value})
    }
   const login = async () => {
     console.log("login function executed",formData);
     let responseData;
     await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'content-type':'application/json'
      },
      body: JSON.stringify(formData),

     }).then((response)=> response.json()).then((data)=>responseData=data)
     if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
     }
     else{
      alert(responseData.errors)
     }
   
     
   }
   const signup = async () => {
  console.log("sign up function  executed ",formData);
     let responseData;
     await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'content-type':'application/json'
      },
      body: JSON.stringify(formData),

     }).then((response)=> response.json()).then((data)=>responseData=data)
     if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
     }
     else{
      alert(responseData.errors)
     }
   }

  return (
    <div className='login-signup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==='Sign Up'?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Name' />:<></>}
          <input  name='email' value={formData.email}  onChange={changeHandler} type="email" placeholder='Email' />
          <input type="password" placeholder='Password' />
        </div>
        <button onClick={()=>{state==="login"?login():signup()}}>continue</button>
        {state==='Sign Up'? <p className="loginsignup-login">Already  have an account? <spann onClick={()=>{setState("login")}}>Login here</spann></p>
        :<p className="loginsignup-login">create an account? <spann onClick={()=>{setState("Sign Up")}}>Click here</spann></p>}
       
         
        
         <div className="loginsignup-agree">
          <input type ='checkbox'/>
          <p>by continuing, i agree to the terms of use & privacy policy</p>
         </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
