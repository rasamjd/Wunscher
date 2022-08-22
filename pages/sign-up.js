import Link from 'next/link';
import axios from "axios"
import { useState } from "react"

function SignUp() {

  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    email: ""
  })

  const [dataCheck, setDataCheck] = useState(1)

  const handleChange = (e) => {
    setUserInfo((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value
      }
    })
  }

  const handleSubmit = () => {
    setDataCheck(2)

    if(userInfo.username.length > 1 && userInfo.password.length > 1) {
      axios.get("http://localhost:5000/sign-up", {
        params: {
          username: userInfo.username 
        }
      })
        .then((data) => {
          if (data.data.length == 0) {
            
            const userSignUpData = {
              username: userInfo.username,
              password: userInfo.password,
              email: userInfo.email
            }

            axios.post("http://localhost:5000/sign-up", userSignUpData)
              .then(setDataCheck(4))
          }

          else {
            setDataCheck(3)
          }
        })
    }
    else {
      alert("Pleasre insert username and password with at least 2 characters!")
    }
  }

  const handleErrReturn = () => {
    setDataCheck(1)
  }

  if(dataCheck == 1) {
    return (
      <div className="up-table">
        <div className="up-table-second">
          <div className="up-container">
            <div className="up-title">Sign Up</div>
            <div className="up-usernameSec up-sec">
            <div className="up-p">Username *</div>
              <input type="text"
                    className="up-email-in up-in"
                    onChange={handleChange}
                    name="username" />                   
              <div className="up-usernameInfo up-info" >Must be unique</div>
            </div>
            <div className="up-passwordSec up-sec">
            <div className="up-p">Password *</div>
              <input type="text"
                    className="up-password-in up-in"
                    onChange={handleChange}
                    name="password" />
            </div>
            <div className="up-emailSec up-sec">
              <div className="up-p">Email Address</div>
              <input type="text"
                    className="up-email-in up-in"
                    onChange={handleChange}
                    name="email" />
              <div className="up-emailInfo up-info" >Optional, but can be helpful</div>
            </div>
            <Link href="/"> 
              <a className="up-home-btn">Cancel</a>
            </Link>
            <button className="up-btn"
                    onClick={handleSubmit}>
                      Sign Up
            </button>
            <Link href="/sign-in">
              <a className="up-already">Already have an account?</a>
            </Link>
          </div>
  
          <div className="up-ball-1"></div>
          <div className="up-ball-2"></div>
        </div>
      </div>
    )
  }

  if(dataCheck == 2) {
    return (
      <div className="up-table">
        <div className="up-after-container-1">
          <div className="up-after-loading">
            loading...
          </div>

          <div className="up-ball-1-loading"></div>
          <div className="up-ball-2-loading"></div>
        </div>
      </div> 
    )
  }
  
  if(dataCheck == 3) {
    return (
      <div className="up-table">
        <div className="up-after-container-2">
          <div className="up-after-err">
            <p className="up-after-err-p">
              Please choose another username, it looks like 
              <code className="up-username-err"> {userInfo.username} </code> 
               is already taken
            </p>

            <button className="up-after-return" 
                    onClick={handleErrReturn}>
                      Back
            </button>
          </div>

          <div className="up-ball-1-err"></div>
          <div className="up-ball-2-err"></div>
        </div>
      </div>
    )
  }
  
  if(dataCheck == 4) {
    return (
      <div className="up-table">
        <div className="up-after-container-2">
          <div className="up-after-err">
            <p className="up-after-res-p">
            Wellcome { userInfo.username }!
            </p>

            <Link href={`/user/${userInfo.username}`}>
                <a className="up-after-res-link">Go to account</a>
            </Link>
          </div>

          <div className="up-ball-1-err"></div>
          <div className="up-ball-2-err"></div>
        </div>
      </div>
    )
  }
}

export default SignUp