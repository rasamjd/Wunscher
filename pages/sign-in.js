import Link from 'next/link';
import { useState, useEffect } from "react"

function SignIn() {

  const [user, setUser] = useState({
    username: "",
    password: ""
  })

  const [dataCheck, setDataCheck] = useState(1)
  const [loginRes, setLoginRes] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/login/checkpoint", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "wishlist-access-token": localStorage.getItem("wishlist-token")
      },
    })
      .then((res) => res.json())
      .then((validToken) => {
        if (validToken.bool) {
          console.log("Okey!")
          window.location.href= `/user/${validToken.tokenUsername}`        }
        else {
          console.log("Not okey!")
        }
      })

      .catch((err) => {
        console.log("Error:" + err)
      })
  }, [])

  const handleChange = (e) => {
    setUser((prev) => {
      return {
        ...prev, 
        [e.target.name]: e.target.value
      }
    })
  }

  const handleSubmit = () => {
    setDataCheck(2)

    fetch("http://localhost:5000/sign-in", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password
      })
    })
        .then((res) => res.json())
        .then((data) => {
          setDataCheck(3)

          if (data.message === "Success!") {
            console.log(data)
            localStorage.setItem("wishlist-token", data.token)
            setDataCheck(4)
          } 
          
          else if (data.message === "User not found!") {
            setLoginRes(data.message + " Please try again.")
          } 
          else if (data.message === "Wrong Password!") {
            setLoginRes(data.message + " Please try again.")
          } 
          else {
            const res = "Ooops! it looks like there was a problem" + 
                        "with your login. Please try again!"
            setLoginRes(res)
          }
        })

        .catch((err) => console.error("Error :" + err))
  }

  if(dataCheck == 1) {
    return (
      <div className="in-table">
            <div className="in-table-second">
              <div className="in-container">
                <div className="in-title">Log In</div>
                <div className="in-usernameSec in-sec">
                  <div className="in-p">Username </div>
                  <input type="text"
                        className="in-email-in in-in"
                        onChange={handleChange}
                        name="username" />
                  <div className="in-usernameInfo in-info" ></div>
                </div>
                <div className="in-passwordSec in-sec">
                  <div className="in-p">Password </div>
                  <input type="text"
                        className="in-email-in in-in"
                        onChange={handleChange}
                        name="password" />
                  <div className="in-passwordInfo in-info" ></div>
                </div>
                <Link href="/">
                  <a  className="in-home-btn">Cancel</a>
                </Link>
                <button className="in-btn"
                    onClick={handleSubmit}>
                      Sign in
                </button>
                <Link href="/sign-up">
                  <a  className="in-dont">Don't have an account?</a>
                </Link>
              </div>
      
              <div className="in-ball-1"></div>
              <div className="in-ball-2"></div>
              <div className="in-ball-3"></div>
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
              {loginRes}
            </p>

            <button className="up-after-return" 
                    onClick={(e) => setDataCheck(1)}>
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
            Wellcome { user.username }!
            </p>

            <Link href={`/user/${user.username}`}>
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

export default SignIn