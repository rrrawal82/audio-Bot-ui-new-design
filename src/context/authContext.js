import { createContext ,useEffect,useState} from "react";
import axios from "axios"

export const AuthContext =createContext()

export const AuthContextProvider=({children})=>{
    const [currentUser,setcurrentUser]=useState(JSON.parse(localStorage.getItem("user"))|| null)

    const login=async(inputs)=>{
        //const res = await axios.post("/auth/login", inputs)
        try{
            const res = await axios.post("http://localhost:8080/api/auth/login", inputs);
            if(res.data)
            {
                setcurrentUser(res.data) 
                return res.data;
            }
        }catch(err){
            console.log(err)
            if(err) return err
        }
    };

    const logout=async(inputs)=>{
        await axios.post("http://localhost:8080/api/auth/logout");
        setcurrentUser(null)
    }

    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(currentUser));
    },[currentUser])

    return (
        <AuthContext.Provider value={{currentUser,login,logout}}>{children}</AuthContext.Provider>
    )

}
