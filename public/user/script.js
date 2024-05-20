const usersHTML = document.getElementById("users")
const usernameHTML = document.getElementById("user-name")
const userstatus = document.getElementById("user-status")
const deletepopupHTML = document.getElementById("delete-popup")
const delbtnHTML = document.getElementById("del-btn")
const admbtnHTML = document.getElementById("adm-btn")
const delCancel = document.getElementById('del-cancel')
const delConfirm = document.getElementById('del-confirm')
const popupText = document.getElementById("popup-text")
let slider = document.getElementById("myrange")
let output = document.getElementById("value")

let actual = {}
let actualAction;
let users = {}

socket.emit("users.get")
socket.on("users.update", (newUsers) => {
    users = newUsers
    usersHTML.innerHTML = ""
    showUsers()
    document.getElementById("load").classList.add("hidden")
})

function showUsers() {
    for (const user in users) {
        let usrDiv = document.createElement("div")
        usrDiv.classList.add("btn")
        usrDiv.innerHTML = `<span>${users[user].name}</span>`
        usrDiv.addEventListener('click', () => {
            actual["dom"] && actual["dom"].classList.remove("active")
            actual["dom"] = usrDiv
            actual["id"] = user
            usrDiv.classList.add("active")
            console.log(users[user])
            showUser(user)
        })
        usersHTML.appendChild(usrDiv)
    }

    usersHTML.firstChild.click()
}

function showUser(userid) {
    let user = users[userid]
    usernameHTML.innerText = user.name
    userstatus.innerText = (user.online ? "En ligne" : "Hors ligne")
    console.log(`Cet utilisateur est: ${(user.admin ? "Admin" : "Rien")}`)
    
    admbtnHTML.innerHTML = `<span>${user.admin ? "Révoquer admin" : "Proumouvoir admin"}</span>`
}

deletepopupHTML.addEventListener("click", (ME) => {
    if (ME.srcElement === deletepopupHTML) {
        deletepopupHTML.classList.add("hidden")
    }
})

delbtnHTML.addEventListener("click", () => {
    if (actual.id) {
        deletepopupHTML.classList.remove("hidden")
        popupText.innerText = `Voulez-vous vraiment supprimer ${users[actual.id].name} ?`
        actualAction = "delete"
    }
})
admbtnHTML.addEventListener("click", () => {
    if (actual.id) {
        deletepopupHTML.classList.remove("hidden")
        popupText.innerText = `Voulez-vous vraiment ${users[actual.id].admin ? "révoquer les droits d'admin à" : "proumouvoir"} ${users[actual.id].name} ${users[actual.id].admin ? "?" : "administrateur ?"}`
        actualAction = "admin.change"
    }
})
delCancel.addEventListener("click", () => {
    deletepopupHTML.classList.add("hidden")
    actualAction = undefined
})

delConfirm.addEventListener("click", () => {
    let user = users[actual.id]
    socket.emit(`user.${actualAction}`, actual.id, (success) => {
        console.log(`${actualAction} success: ${success}`);
        deletepopupHTML.classList.add("hidden")
    })
})
