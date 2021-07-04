document.body.style.backgroundColor = "rgba(147,127,114,0.2)";

  const BASE_URL = "https://lighthouse-user-api.herokuapp.com/"
  const Index_URL = BASE_URL + "api/v1/users/"

  const dataPanel = document.querySelector("#data-panel")
  const searchForm = document.querySelector("#search")
  const searchInput = document.querySelector("#search-input")
  const icons = document.querySelector("#icons")
  const home= document.querySelector(".navbar-brand")
  const data = []
  const pagination = document.querySelector("#pagination")
  const filter = document.querySelector("#filter")
  const ITEM_PER_PAGE = 20
  let paginationData = []

  
  const cardView = 1
  const listView = 2

  let currentView = 1
  let currentPage = 1
  
  
  axios
    .get(Index_URL)
    .then((response) => {
      data.push(...response.data.results);
       getTotalPages(data)
      //displayData(data)
      getPageData(currentPage, data)
    })
    .catch((err) => {
      console.log(err)
    })


  // listen to data panel
dataPanel.addEventListener("click", (event) => {
    if (event.target.matches(".users-avatar") || event.target.matches(".btn-more")) {
      showUser(event.target.dataset.id);
    } else if (event.target.matches('.btn-add-favorite')|| event.target.matches("#heartstyle")) {
    
      addFavoriteItem(event.target.dataset.id)
    } 
  })

  // listen to search form submit event
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = data.filter((user) =>
      user.name.toLowerCase().includes(input) ||user.surname.toLowerCase().includes(input)
    )
    console.log(results)
    // displayData(results)
    filter.addEventListener("click", (event) => {
    let genderResult = []
    if (event.target.matches(".btn-male")) {
      genderResult = results.filter(user => user.gender === 'male')
    } else if (event.target.matches(".btn-female")) {
      genderResult = results.filter(user => user.gender === 'female')
    } else {
      genderResult = results
    }
   getPageData(currentPage, genderResult)
   getTotalPages(genderResult)
  })
    
    getTotalPages(results)
    getPageData(currentPage, results)
  })

  // listen to pagination click event
  pagination.addEventListener("click", (event) => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === "A") {
      currentPage = event.target.dataset.page
      getPageData(currentPage)
    }
  })
  
    // list to icons click event
  icons.addEventListener("click", (event) => {
    if (event.target.matches(".fa-th")) {
      currentView = cardView
    } else if (event.target.matches(".fa-bars")) {
      currentView = listView
    }
    getPageData(currentPage)
  })

// list to filter
  filter.addEventListener("click", (event) => {
    let genderResult = []
    if (event.target.matches(".btn-male")) {
      genderResult = data.filter(user => user.gender === 'male')
    } else if (event.target.matches(".btn-female")) {
      genderResult = data.filter(user => user.gender === 'female')
    } else {
      genderResult = data
    }
   getPageData(currentPage, genderResult)
   getTotalPages(genderResult)
  })
  
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ""
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${
        i + 1
      }</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
  
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayData(pageData)
    
  }


  
 function displayData(data) {
    let htmlContent = ""
    data.forEach(function (item, index) {
      if (currentView === cardView) {
      htmlContent += `
<div class="col-sm-3" id="cards">
          <div class="card mb-2">
            <img class="users-avatar" id="photo" data-id="${item.id}" data-toggle="modal" data-target="#show-info" src="${item.avatar}">

          <a class="card-footer" id="footer" style="font-family:monospace;">${item.name}</a>
<i class="fa fa-heart fa-1x" id="heartstyle" data-id="${item.id}" aria-hidden="true"></i>
</i>

        </div></div>
`}else if (currentView === listView) {
        htmlContent += `
          <table class="table">
            <tbody>
              <tr>
                <td class="d-flex justify-content-between">
<span><img src="${item.avatar}" style="width:80px;">
                  ${item.name} ${item.surname}</span>

                  <div class="cardButton">
                    <button class="btn btn-dark btn-more" data-toggle="modal" data-target="#show-info" data-id="${item.id}">More</button>
                    <!-- favorite button -->

                    <button class="btn btn-secondary btn-add-favorite" data-id="${item.id}">+Add to favorite </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>  
        `
      }
    })
    dataPanel.innerHTML = htmlContent;
  }

  function showUser(id) {
    const userimage = document.querySelector("#user-image")
    const username = document.querySelector("#user-name")
    const modalContent = document.querySelector("#content")

    const url = Index_URL + id
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        userimage.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`
        
        username.textContent = `${data.name} ${data.surname}`

        modalContent.innerHTML = `
      <li>Gender: ${data.gender}</li>
      <li>Region: ${data.region}</li>      
      <li>Age: ${data.age}</li>
      <li>Birthday: ${data.birthday}</li>
      <li>${data.email}</li>`;
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
 
 function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem("favoriteFriends")) || []
    const user = data.find((item) => item.id === Number(id))

    if (list.some((item) => item.id === Number(id))) {
      alert(`${user.name} is already in your favorite list.`)
    } else  {
      list.push(user);
      alert(`Added ${user.name} to your favorite list!`)
    }
    localStorage.setItem("favoriteFriends", JSON.stringify(list))
  }
  





  

