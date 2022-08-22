import Link from 'next/link';
import { useState, useRef } from "react"

function Entry() {

  const [usersList, setUsersList] = useState([])
  const [usersListCheck, setUsersListCheck] = useState([])

  const searchInput = useRef(null)
  /*
    <div className="entry-searchDiv">
      <img className="entry-userPic"/>
      <Link to="list-o/john"
        className="entry-userSearch" >Johan
      </Link>
    </div>
  */

  const handleSearch = (e) => {
    setUsersList([])

    const searchKey = searchInput.current.value || e.target.value

    if(searchInput.current.value.length < 1) {
      setUsersList([])
      setUsersListCheck([])
    } 

    fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        searchKey
      })
    })
    .then((res) => res.json(res))
    .then((users) => {

      if (users[0]) {
        if (searchInput.current.value == users[0].username) {

          const userModel = (user, link) => (
            <div className="entry-searchDiv" key={user._id}>
              <img className="entry-userPic"/>
              <Link href={link}>
                <a className="entry-userSearch">{user.username}</a>
              </Link>
            </div>
          )
    
          users.map((user) => {
    
              const linkTo =`/list/${user.username}`
              setUsersList((prev) => [...prev, userModel(user, linkTo)])
              setUsersListCheck((prev) => [...prev, user.username])
          })
        } 
      } 

    })
    .catch((err) => console.log("Error :" + err))
  }
  
  return (
    <div className="entry-table">
      <div className="entry-glass">
      <div className="entry-header">
        <div className="entry-logo">
          W U N S C H E R
        </div>
        <div className="entry-btns">

        </div>
        <div className="entry-inBtns">
          <Link href="sign-up"> 
            <a className="entry-signUp">Sign up</a>
          </Link>
          <Link href="sign-in">
            <a className="entry-signIn">Log in</a>
          </Link>
        </div>
      </div>
      <div className="entry-description">
        Discover your friends wishlists and bring a smile on someone's face
      </div>
      <div className="entry-searchSec">
        <div className='entry-searchBar'>
          <input className="entry-search"
                placeholder="Search in people"
                onChange={handleSearch}
                ref={searchInput}/>
          <button type="submit" 
                  className="searchButton"
                  onClick={handleSearch}>
          </button>
        </div>
        <div className="entry-resultsContainer">

          {usersList}
        </div>
      </div>
      <div className="entry-footer">

      </div>
      </div>
      <div className="ball-1"></div>
      <div className="ball-2"></div>
      <div className="ball-3"></div>
    </div>
  )
}

export default Entry

    /**/