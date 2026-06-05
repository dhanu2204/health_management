import { useState } from "react"
import "./Login.css"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    if(email === "" || password === ""){
      alert("Please enter your email and password")
      return;
    }

    const userCredintial={email:email,password:password}
    try{
      const response = await fetch("https://health-management-e61z.onrender.com/users/login",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          userCredintial
        ),
      });

      if (response.ok) {
        const text = await response.text(); // Read as text first because backend sends empty response on failure
        
        if (text) {
            const user = JSON.parse(text);
            localStorage.setItem("user", JSON.stringify(user));
            alert("Login Successful! Welcome " + user.name);
            navigate("/home");
        } else {
            // Backend returned null (empty text) meaning wrong password
            alert("Invalid Email or Password. Please try again.");
        }
      } else {
        alert("Server error. Please try again later.");
      }
    }
    catch(error){
      console.log("Connection error:"+error);
      alert("Network connection , is the server running");
    }
}

  return (
    <div className="auth-main-wrapper">
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Sign In</h2>

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

          <div className="btn-div">
            <button type="submit" className="auth-btn">Sign In</button>
          </div>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login