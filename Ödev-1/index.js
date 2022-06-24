// Postları Yükle butonuna basınca ilgili verileri yükleme
document.querySelector("#loadPost").addEventListener("click", () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json()).then(response => {
        const posts = response.slice(0,20)
        renderPost(posts)
  })
})
// renderPost methoduyla postları renderlama 
const renderPost = (data = []) => {
  data.forEach((item) => {
    const li = document.createElement("li")
    li.innerHTML = `Post Id: ${item.id} Title : ${item.title}`
    document.querySelector("#ul-1").appendChild(li)
  }) 
}
// Loader methodları
let myTime;
function loaderTime() {
  myTime = setTimeout(showLoader, 500)
}

function showLoader() {
  document.getElementById("loader").style.display = "none"
}
// Kullanıcıları Yükle butonuna ilgili verileri yükleme

const loadUserButton = document.querySelector("#loadUsers")
let users = []
const loadUsers = () => {
  fetch("https://jsonplaceholder.typicode.com/users").then(response => {
    return response.json()
  }).then(response => {
    users = response.map((x, index) => {
       x.orderNo = index + 1
      return x
    })
    renderUsers(users)
  }).catch(err => {
    console.error(err)
  })
}
loadUserButton.addEventListener("click", () => {
  // loaderı cagırma
  document.getElementById("loader").style.display = "block"
  loadUsers()
  // loaderTime fonksiyonunu çağırarak loaderı display none yaptık
  loaderTime()
})

const userDom = document.querySelector("#user")

let user = {}
const renderUsers = (users = []) => {
  userDom.innerHTML = ""
  const table = document.createElement("table")

  table.classList.add("table")

  const thead = document.createElement("thead")
  thead.innerHTML = `
  <tr class="table-active">
    <th scope="col"id="userId">Id</th>
    <th scope="col" id="userNo">Sıra No</th>
    <th scope="col" id="userName">Name</th>
    <th scope="col" id="userEmail">Email</th>
    <th scope="col" id="userPhone">Phone</th>
    <th scope="col" id="userWebsite">Website</th>
    <th scope="col">Actions</th>
  </tr>`
  table.appendChild(thead)

  const tbody = document.createElement("tbody")

  tbody.innerHTML = users.map((user, index) => {
    return `<tr>
      <th scope="row">${user.id}</th>
      <th scope="row">${(index + 1)}</th>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.website}</td>
      <td>
      <button type="button" class="btn btn-danger btn-sm remove" data-id="${user.id}">Sil</button>
      <button type="button" class="btn btn-warning btn-sm update" data-id="${user.id}">Düzenle</button>
      </td>
    </tr>`
  }).join(" ")
  table.appendChild(tbody)

  userDom.appendChild(table)
  // Reverse işlemiyle sıralama
  document.querySelector("#userId").addEventListener("click", () =>{
    renderUsers(users.reverse())
  })
  // Sort ile sıralama fakat index numarası tersine sıralanmıyor
  // document.querySelector("#userNo").addEventListener("click", () =>{
  //   const userOrder = users.sort((a,b) => {return b.orderNo - a.orderNo});
  //   users.map((item, index) => {
  //       item.orderNo = index + 1;
  //       return item;
  //   });
  //   renderUsers(userOrder);
  // })
  document.querySelector("#userNo").addEventListener("click", reverseUsers)
  // Click değişkeniyle birlikte ilk tıklamada reverse eder ikinci tıklamada ilk haline getirir
  let click = false
  function reverseUsers() {
    if (click == false){
      tbody.innerHTML = users.map((user, index) => {
        return `<tr>
    <th scope="row">${user.id}</th>
    <th>${index + 1}</th>
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.phone}</td>
    <td>${user.website}</td>
    <td>
    <button type="button" class="btn btn-danger btn-sm remove" data-id="${user.id}">Sil</button>
    <button type="button" data-bs-toggle="collapse" data-bs-target="#userNone" aria-expanded="false" aria-controls="userNone" class="btn btn-warning btn-sm update" data-id="${user.id}">Düzenle</button>
    </td>
  </tr>`}).reverse().join(" ")
  click = true
  
      table.appendChild(tbody)
      userDom.appendChild(table)

    } else {
      
      renderUsers(users)
      click = false
    }

  };
  // Sort ile Alfabetik sıralama
  document.querySelector("#userName").addEventListener("click", () => {
    const userName = users.sort(function(a, b){
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
    renderUsers(userName)
  })
  
  


  
  

 
  document.querySelectorAll(".remove").forEach(button => {
    button.addEventListener("click", function () {
      const status = confirm("Kaydı silmek üzeresiniz emin misiniz?")
      if (status) {
        const id = this.getAttribute("data-id")
        renderUsers(users.filter(x => x.id != id))
      }
    })
  })

  document.querySelectorAll(".update").forEach(button => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id")
      const _user = users.find(user => user.id == id)
      fillUser(_user)
      toggleUser()
      toggleTable("none")
    })
  })
}

const toggleTable = (display = "none") => {
  document.querySelector("#user").style.display = display
}

const toggleUser = (display = "block") => {
  document.querySelector("#user-form").style.display = display
}

const fillUser = (user) => {
  document.querySelector("#labelName").value = user.name
  document.querySelector("#labelPhone").value = user.phone
  document.querySelector("#labelWebSite").value = user.website
  document.querySelector("#labelEmail").value = user.email
  document.querySelector("#userId").value = user.id
}

const updateUser = () => {
  try {
    const name = document.querySelector("#labelName").value
    const phone = document.querySelector("#labelPhone").value
    const webSite = document.querySelector("#labelWebSite").value
    const email = document.querySelector("#labelEmail").value
    const userId = document.querySelector("#userId").value
    const index = users.findIndex(user => user.id == userId)
    fetch("http://localhost:3000/update", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Token": window.localStorage.getItem("token")
      }
    })
      .then(response => response.json())
      .then(response => {
        const { status } = response
        if (status == true) {
          users[index] = { name, phone, website: webSite, email, id: userId, orderNo: index+1 }
          renderUsers(users)
          toggleTable("block");
          toggleUser("none");
          alert("Güncelleme işlemi başarıyla gerçekleşti")
        } else {
          alert("Güncelleme işlemi sırasında bir hata oluştu")
        }
    })


    
   
  } catch (error) {
    console.error(error)
    alert("Bizden kaynaklı bir hata oluştu özür dileriz")
    toggleTable("block");
    toggleUser("none");
  }
  
}
document.querySelector("#cancel").addEventListener("click", () => {
  toggleTable("block");
  toggleUser("none");
})


document.querySelector("#save").addEventListener("click", updateUser)


document.querySelector("#user").addEventListener("click", () => {
 
  })






