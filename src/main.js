import "./style.css"

let rawUsers = []

const app = document.querySelector("#app")

const render = renderContent => {
  app.innerHTML = renderContent
}

const getUsers = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users")
  const users = await response.json()
  console.log(users)
  return users
}

const initApp = async () => {
  const users = await getUsers()
  rawUsers = [...users]

  const usersHTML = users.map(user => createUserCard(user))
  const reducedUsersHTML = usersHTML.reduce((acc, user) => acc + user, "")

  render(reducedUsersHTML)

  setDeleteListeners(users)
}

function setDeleteListeners(users) {
  const buttons = document.querySelectorAll("button")

  buttons.forEach(button => {
    button.addEventListener("click", () => {

      console.log("deletes")

      rawUsers.pop()

      const usersHTML = rawUsers.map(user => createUserCard(user))
      const reducedUsersHTML = usersHTML.reduce((acc, user) => acc + user, "")
      
      render(reducedUsersHTML)
      setDeleteListeners(rawUsers)
    })
  })
}

initApp()
function createUserCard(user) {
  const userCardHTML = `
    <div class="user-card">
      <h2>${user.name}</h2>
      <p>${user.email}</p>
      <button>delete</button>
    </div>
  `
  return userCardHTML
}

const users = getUsers()

// app.innerHTML = `

// `
