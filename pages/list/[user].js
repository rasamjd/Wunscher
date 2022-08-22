import Link from 'next/link';
import { useEffect, useState } from "react"

function ListO({ username }) {

  const [wishes, setWishes] = useState([])
  
  const [styleChecker, setStyleChecker] = useState({
    tableH: 800,
    containerH: 200
  })

  useEffect(() => {
    
    console.log("checking...")

    fetch("http://localhost:5000/user/wishes", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: username
      })
    })
    .then((res) => res.json(res))
    .then((wishlist) => {

      console.log(wishlist)

      const wishModel = (wish) => ( 
          
        <div className="o-list" key={wish.wishCode}>
          <div className="o-img-div">
            <img className="o-list-image" />
          </div>
          <div className="o-info-div">
            {wish.title.length > 0 ? <p className="o-list-title"> { wish.title } </p> : null }
            {wish.description.length > 0 ? <p className="o-list-description"> { wish.description } </p> : null }
            {wish.link.length > 0 ? <a className="o-list-link"href={ wish.link }> { wish.link } </a> : null }
          </div>
        </div>
      )

      setStyleChecker((prev) => {
        return {
          tableH : prev.tableH + (wishlist.length * 100) ,
          containerH : prev.containerH + (wishlist.length * 100)
        }
      })

      wishlist.map((wish) => setWishes((prev) => [...prev, wishModel(wish)]));   
    })

  }, [])

  return (
    <div className="o-table" style={{height: `${styleChecker.tableH}px`}}>
      <div className="o-header">
        <Link href='/'>
          <a className="o-logo">
            W U N S C H E R
          </a>
        </Link>
        <div className="o-btns">

        </div>
        <div className="o-inBtns">
          <Link href="/sign-up" >
            <a className="o-signUp">Sign up</a>
          </Link>
          <Link href="/sign-in" >
            <a className="o-signIn">Log in</a>
          </Link>        
        </div>
      </div>
      <div className="o-list-container" style={{height: `${styleChecker.containerH}px`}}>
        <div className="o-info">
          <img className="o-user-img" />
          <span className="o-username">{username}</span>
        </div>
        <div className="o-list-bar">
          {wishes}
        </div>
      </div>

      <div className="ball-1"></div>
      <div className="ball-2"></div>
    </div>
  )
}

export default ListO

export async function getServerSideProps(context) {
  const { params } = context
  const { user } = params

  return {
    props: {
      username: user,
    },
  }
}