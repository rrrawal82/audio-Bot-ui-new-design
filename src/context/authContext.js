import { createContext ,useEffect,useState} from "react";
import axios from "axios"

export const AuthContext =createContext()

export const AuthContextProvider=({children})=>{
    const apiUrl = process.env.REACT_APP_URL;
    console.log(apiUrl + '/api/auth/login')
    const [currentUser,setcurrentUser]=useState(JSON.parse(localStorage.getItem("user"))|| null)

    const login=async(credentials)=>{
        //const res = await axios.post("/auth/login", inputs)
        try{
            const res = await axios.post(apiUrl + '/api/auth/login', credentials);
            if(res.data)
            {
                setcurrentUser(res.data) 
                return res.data;
            }
        }catch(err){
            console.log(err)
            if(err) return err
        }
    }

    const register=async(inputs)=>{
        //const res = await axios.post("/auth/login", inputs)
        try{
            
            const res = await axios.post(apiUrl + '/api/auth/register', inputs);
            if(res.data)
            {
                //setcurrentUser(res.data) 
                return res.data;
            }
        }catch(err){
            console.log(err)
            if(err) return err
        }
    }

    const logout=async(inputs)=>{
        await axios.post(apiUrl + "/api/auth/logout");
        setcurrentUser(null)
    }

   
    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(currentUser));
    },[currentUser])

    return (
        <AuthContext.Provider value={{currentUser,login,logout,register}}>{children}</AuthContext.Provider>
    )

}
