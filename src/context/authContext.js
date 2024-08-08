import { createContext ,useEffect,useState} from "react";
import axios from "axios"

export const AuthContext =createContext()

export const AuthContextProvider=({children})=>{
    const [currentUser,setcurrentUser]=useState(JSON.parse(localStorage.getItem("user"))|| null)

    const login=async(inputs)=>{
        //const res = await axios.post("/auth/login", inputs)
        try{
            //const res=await axios.post("/auth/login",inputs);
            const res = await axios.post("http://localhost:5000/signin", inputs);
            console.log(res)
            if(res.status=="200")
            {
                return res.data;
                setcurrentUser(res.data)  
            }
        }catch(err){
            if(err) return err
        }
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
