import "./style.css";

let rawUsers = [];

const app = document.querySelector("#app");

const render = (renderContent) => {
  app.innerHTML = `<dialog class="dialog">
  <form class="dialog-content">
  <label for="name">Имя:</label>
  <input
  type="text"
  id="name"
  name="name"
  required
  placeholder="Name"
  size="15"
><label for="email">Email:</label>
<input
  type="email"
  id="email"
  name="email"
  required
  placeholder="@mail"
  size="15"
><button  name="submit" type='submit' >Добавить</button></form>
  </dialog>`;
  app.innerHTML += `<button class="appUser">Add User :D</button>`;
  app.innerHTML += renderContent;
  appendUserCard();
  handleHoveringOverCard();
};

// Получаем пользователей
const getUsers = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();
  // console.log(users);
  return users;
};

const initApp = async () => {
  const users = await getUsers();
  rawUsers = [...users];
  console.log(rawUsers);
  const usersHTML = users.map((user) => createUserCard(user));
  const reducedUsersHTML = usersHTML.reduce((acc, user) => acc + user, "");

  render(reducedUsersHTML);

  setDeleteListeners(users);
};

initApp();
function createUserCard(user) {
  const userCardHTML = `
    <div class="user-card" data-id = "${user.id}">
      <h2>${user.name}</h2>
      <p>${user.email}</p>
      <button class="delete">delete</button>
    </div>
  `;
  return userCardHTML;
}

function setDeleteListeners(users) {
  const buttonsDelete = document.querySelectorAll(".delete");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", (evt) => {
      console.log("deletes");
      console.log(evt.target.parentElement.getAttribute("data-id"));
      rawUsers = rawUsers.filter(
        (user) =>
          // user.name !== evt.target.parentElement.querySelector("h2").innerText
          user.id !== Number(evt.target.parentElement.getAttribute("data-id"))
      );
      // console.log(rawUsers);
      const usersHTML = rawUsers.map((user) => createUserCard(user));
      const reducedUsersHTML = usersHTML.reduce((acc, user) => acc + user, "");

      render(reducedUsersHTML);
      setDeleteListeners(rawUsers);
    });
  });
}

function appendUserCard() {
  const dialog = document.querySelector("dialog");
  const showButton = document.querySelector("dialog + button");
  const closeButton = document.querySelector("dialog button");

  showButton.addEventListener("click", () => {
    dialog.showModal();
  });

  dialog.addEventListener("click", (evt) => {
    if (evt.target === dialog) {
      dialog.close();
    }
  });

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  handleSubmit();
}

// Обработчик сабмита формы (Вынести в отдельную функцию)
function handleSubmit() {
  const form = document.querySelector("dialog form");
  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const submitButton = document.querySelector("button[name='submit']");
  submitButton.disabled = true;

  function checkInputs() {
    if (nameInput.value.trim() !== "" && emailInput.value.trim() !== "") {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

  nameInput.addEventListener("input", checkInputs);
  emailInput.addEventListener("input", checkInputs);

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const user = {};
    user.id = rawUsers.length + 1;
    user.name = nameInput.value;
    user.email = emailInput.value;

    console.log(user.name, user.email);
    rawUsers.unshift({ id: user.id, name: user.name, email: user.email });

    const usersHTML = rawUsers.map((user) => createUserCard(user));
    const reducedUsersHTML = usersHTML.reduce((acc, user) => acc + user, "");

    render(reducedUsersHTML);
    setDeleteListeners(rawUsers);
  });
}

function handleHoveringOverCard() {
  const userCards = document.querySelectorAll(".user-card");

  userCards.forEach((card) => {
    card.addEventListener("mouseover", () => {
      card.classList.add("hovered");
    });
    card.addEventListener("mouseout", () => {
      card.classList.remove("hovered");
    });
  });
}

// const users = getUsers();
