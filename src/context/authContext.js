import { createContext ,useEffect,useState} from "react";
import axios from "axios"

export const AuthContext =createContext()

export const AuthContextProvider=({children})=>{
    const [currentUser,setcurrentUser]=useState(JSON.parse(localStorage.getItem("user"))|| null)

    const login=async(inputs)=>{
        const res = await axios.post("http://localhost:5000/signin", inputs);
        //const res = await axios.post("/auth/login", inputs)
        setcurrentUser(res.data)
    };

    const logout=async(inputs)=>{
        await axios.post("/auth/logout");
        setcurrentUser(null)
    }

    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(currentUser));
    },[currentUser])

    return (
        <AuthContext.Provider value={{currentUser,login,logout}}>{children}</AuthContext.Provider>
    )

}
