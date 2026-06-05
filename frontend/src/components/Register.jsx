import './Register.css';
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate();
    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phonenumber, setPhonenumber] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(name == "" || email == "" || password == "" || phonenumber == ""){
            alert("Wait! Please fill in all the details before signing up.");
            return;
        }

        const userdata = {
            name:name,
            email:email,
            password:password,
            phonenumber:phonenumber,
        }

        try{
            const response = await fetch("http://localhost:8080/users/register",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userdata),
            });

            if(response.ok){
                const message = await response.text();
                alert("Sucess:"+ message);
                navigate("/login");
            }else{
                alert("Error:"+ response.statusText);
            }
        }catch(error){
            console.error("Registration error:", error);
            alert("Connection Error: Could not connect to the backend server. Please check if the backend is awake at Render.");
        }
    }
    
    return (
        <div className="auth-main-wrapper">
            <div className="auth-container">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Sign Up</h2>

                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name"
                            placeholder="Enter your name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="phonenumber">Phone Number</label>
                        <input 
                            type="tel" 
                            id="phonenumber"
                            placeholder="Enter your phone number" 
                            value={phonenumber} 
                            onChange={(e) => setPhonenumber(e.target.value)} 
                        />
                    </div>

                    <div className="btn-div">
                        <button type="submit" className="auth-btn">Sign Up</button>
                    </div>

                    <p className="auth-footer-text">
                        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                    </p>
                </form>
            </div>

        </div>
    )
}

export default Register
