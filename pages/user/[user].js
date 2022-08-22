import Link from "next/link"
import { useState, useEffect} from "react"

function ListU({ username }) {

  const [appStatus, setAppStatus] = useState("initial")

  const [adding, setAdding] = useState({
    titleInput: "",
    descInput: "",
    linkInput: ""
  })

  const [wishes, setWishes] = useState([])

  const [renderCheck, setRenderCheck] = useState(0)

  const [styleChecker, setStyleChecker] = useState({
    tableH: 800,
    containerH: 200
  })

  useEffect(() => {
    fetch("http://localhost:5000/checkpoint", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "wishlist-access-token": localStorage.getItem("wishlist-token")
      },
      body: JSON.stringify({
        user: username
      })
    })
      .then((res) => res.json())
      .then((validToken) => {

        if (validToken.bool && validToken.decodedToken) {
          console.log("Okey!")
        }
        else {
          console.log("Not okey!")
          window.location.href= "/sign-in"
        }
      })

      .catch((err) => {
        console.log("Error:" + err)
        window.location.href= "/sign-in"
      })

    fetch("http://localhost:5000/user/wishes", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "wishlist-access-token": localStorage.getItem("wishlist-token")
      },
      body: JSON.stringify({
        user: username
      })
    })
      .then((res) => res.json(res))
      .then((wishes) => {
        console.log(wishes)

        const wishModel = (wish) => ( 
          <div className="u-list" key={wish.wishCode} wishcode={wish.wishCode}>
            <div className="u-img-div">
              <img className="u-list-image" />
            </div>
            <div className="u-info-div">
              <p className="u-list-title"> { wish.title } </p>
              <p className="u-list-description"> { wish.description } </p>
              <a className="u-list-link" href={ wish.link }> { wish.link } </a>
            </div>
            <div className="u-del"
                 onClick={deleteHandler} ></div>
          </div>
        )

        setStyleChecker((prev) => {
          return {
            tableH : prev.tableH + (wishes.length * 120) ,
            containerH : prev.containerH + (wishes.length * 120)
          }
        })

        wishes.map((wish) => {
          setWishes((prev) => [...prev, wishModel(wish)])
        });
      })
      .catch((err) => console.log("Error :" + err))

  }, [adding, renderCheck])

  const handleWishAdding = (e) => {
    setAdding((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const deleteHandler = (e) => {
    const parentKey = e.target.parentNode.getAttribute("wishcode");

    fetch("http://localhost:5000/user/wishes", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        wishCode: parentKey
      })
    })  
      .then(() => {
        setRenderCheck((prev) => prev === 1 ? 0 : 1)
        window.location.reload(false)
      })
  }

  const handleAddingSubmit = () => {
    fetch("http://localhost:5000/user", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user,
        title: adding.titleInput,
        description: adding.descInput,
        link: adding.linkInput,
      })
    })
      .then(() => {
        setAppStatus("initial")
        setRenderCheck((prev) => prev === 1 ? 0 : 1)
        setStyleChecker((prev) => {
          return {
            tableH : prev.tableH + 150,
            containerH : prev.containerH + 150
          }
        })

        window.location.reload(false)
      })
      .catch((err) => console.log("Error: " + err))
  }

  if (appStatus === "initial") {
    return (
      <div className="u-table" style={{height: `${styleChecker.tableH}px`}}>
        <div className="u-header">
          <Link href='/'>
            <a className="u-logo">
              W U N S C H E R
            </a>
          </Link>
          <div className="u-btns"></div>
          <div className="u-user">
            <div className="u-user-img"></div>
            <span className="u-username" >{username}</span>
          </div>
        </div>
        <div className="u-list-container" style={{height: `${styleChecker.containerH}px`}}>
          <button className="u-add" 
                  title="Add a wish"
                  onClick={() => setAppStatus("addWish")} ></button>
          <div className="u-list-bar">
            {wishes}
          </div>
        </div>
  
        <div className="ball-1"></div>
        <div className="ball-2"></div>
      </div>
    )
  }

  if (appStatus === "addWish") {
    return (
      <div className="user-table-add">
        <div className="user-container-add">
          
          <div className="user-title-add">
            <span className="user-title-add-name">What do you wish for?</span>
            <input className="user-title-add-input"
                   name="titleInput"
                   onChange={handleWishAdding} />
          </div>

          <div className="user-desc-add">
            <span className="user-desc-add-name">Describe or maybe add a link to it</span>
            <input className="user-desc-add-input"
                   name="descInput"
                   onChange={handleWishAdding} />
            <input className="user-link-add-input"
                   placeholder="Add your link here"
                   name="linkInput"
                   onChange={handleWishAdding}/>
          </div>
          
          <button className="user-add-add-btn"
                  onClick={handleAddingSubmit}>Add</button>
          <button className="user-add-cancel-btn"
                  onClick={() => setAppStatus("initial")}>Cancel</button>
        </div>
        <div className="user-ball-1-add"></div>
        <div className="user-ball-2-add"></div>
      </div>
    )
  }
}

export default ListU

export async function getServerSideProps(context) {
  const { params } = context
  const { user } = params

  return {
    props: {
      username: user,
    },
  }
}