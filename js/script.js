const API_KEY = "ObosYncmrxI6EvLTGsJGVDoZBs1xeVaZ";
const getList = async () => {
  try {
    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/names.json?&api-key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
};

const getListGenero = async (listname) => {
  try {
    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/current/${listname}.json?&api-key=${API_KEY}`
    );
    const data = await response.json();
    console.log(data.results.books);
    return data.results.books;
  } catch (error) {
    console.error(error);
  }
};
const showLoading = () => {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading";
  loadingDiv.innerHTML = `<div class="spinner"></div><p>Cargando...</p>`;
  document.body.appendChild(loadingDiv);
};

const hideLoading = () => {
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) {
    loadingDiv.remove();
  }
};
const filter = (data) => {
  //pintar haciendo el filtro
  document.getElementById("filtro").addEventListener("change", async () => {
    document.getElementById("NYT").innerHTML = ""; // Limpiar todo
    showLoading(); // Muestra la animación de carga
    setTimeout(() => {
    //lectura de filtro
    const select = document.getElementById("filtro");
    const textoSeleccionado =
      select.options[select.selectedIndex].text.toUpperCase();

    //vaciar arrays y filtros
    let datosFiltrados = [];
    //filtros
    switch (textoSeleccionado) {
      case "WEEKLY":
        datosFiltrados = data.filter((element) => element.updated == "WEEKLY");
        break;
      case "MONTHLY":
        datosFiltrados = data.filter((element) => element.updated == "MONTHLY");
        break;
      case "A-Z":
        datosFiltrados = data.sort((a, b) =>
          a.list_name.localeCompare(b.list_name)
        );
        break;
      case "Z-A":
        datosFiltrados = data.sort((a, b) =>
          b.list_name.localeCompare(a.list_name)
        );
        break;
      case "OLDEST MAS NUEVO":
        datosFiltrados = data.sort(
          (a, b) =>
            Date.parse(b.oldest_published_date) -
            Date.parse(a.oldest_published_date)
        );
        break;
      case "OLDEST MAS ANTIGUO":
        datosFiltrados = data.sort(
          (a, b) =>
            Date.parse(a.oldest_published_date) -
            Date.parse(b.oldest_published_date)
        );
        break;
      case "NEWEST MAS NUEVO":
        datosFiltrados = data.sort(
          (a, b) =>
            Date.parse(b.newest_published_date) -
            Date.parse(a.newest_published_date)
        );
        break;
      case "NEWEST MAS ANTIGUO":
        datosFiltrados = data.sort(
          (a, b) =>
            Date.parse(a.newest_published_date) -
            Date.parse(b.newest_published_date)
        );
        break;
      default:
        // Si no es filtro, mostrar todos los datos
        datosFiltrados = data;
        break;
    }
    // Generar HTML con los datos filtrados
    datosFiltrados.forEach((element) => {
      document.getElementById("NYT").innerHTML += `<section id="tarjetasLista"> 
      <h1>${element.list_name}</h1> 
      <p>Oldest: ${element.oldest_published_date}</p>
      <p>Newest: ${element.newest_published_date}</p>        
      <p>Updated: ${element.updated}</p>       
      <button id='readMore' data-list-name='${element.list_name_encoded}'>READ MORE!</button>    
      </section>`;
      readMore();
    });
    hideLoading(); // Oculta la animación de carga
    }, 1000);
  });
};

// Modifica tu función de filtro para incluir la animación
const filterBooks = (data) => {
  document.getElementById("filtro").addEventListener("change", async () => {
    showLoading(); // Muestra la animación de carga
    setTimeout(() => {
      document.getElementById("NYT").innerHTML = ""; // Limpiar todo
      const select = document.getElementById("filtro");
      const textoSeleccionado =
        select.options[select.selectedIndex].text.toUpperCase();

      let datosFiltrados = [];
      switch (textoSeleccionado) {
        case "AUTOR ASCENDENTE":
          datosFiltrados = data.sort((a, b) => a.author.localeCompare(b.author));
          break;
        case "AUTOR DESCENDENTE":
          datosFiltrados = data.sort((a, b) => b.author.localeCompare(a.author));
          break;
        case "TITULO ASCENDENTE":
          datosFiltrados = data.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "TITULO DESCENDENTE":
          datosFiltrados = data.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          datosFiltrados = data;
          break;
      }

      datosFiltrados.forEach((element) => {
        document.getElementById("NYT").innerHTML += `<section id="tarjetasBooks"> 
          <h2>#${element.rank} ${element.title}</h2> 
          <img src="${element.book_image}" alt="">
          <p>Author: ${element.author}</p>
          <p>Weeks on list: ${element.weeks_on_list}</p>
          <p>${element.description}</p>        
          <button type="button" id="readMore"><a href="${element.amazon_product_url}">BUY ON AMAZON</a></button>      
          </section>`;
      });

      hideLoading(); // Oculta la animación de carga
    }, 1000); // Simula un retraso de 1 segundo
  });
};

const searchGenre = (data) => {
  document.getElementById("buscarBtn").addEventListener("click", async () => {
    showLoading(); // Muestra la animación de carga
    setTimeout(() => {
    document.getElementById("NYT").innerHTML = "";
    const searchTerm = document.getElementById("buscar").value;
    let searchData = [];
    searchData = data.filter((element) =>
      element.list_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (searchData.length > 0) {
      searchData.forEach((element) => {
        document.getElementById(
          "NYT"
        ).innerHTML += `<section id="tarjetasLista"> 
        <h1>${element.list_name}</h1> 
        <p>Oldest: ${element.oldest_published_date}</p>
        <p>Newest: ${element.newest_published_date}</p>        
        <p>Updated: ${element.updated}</p>       
        <button id='readMore' data-list-name='${element.list_name_encoded}'>READ MORE!</button>    
        </section>`;
        readMore();
      });
    } else {
      document.getElementById("NYT").innerHTML = `<h2>No results found</h2>`;
    }
    hideLoading(); // Oculta la animación de carga
  }, 1000);
  });
  
};

const searchTiltleAuthor = (data) => {
  document.getElementById("buscarBtn").addEventListener("click", async () => {
    showLoading(); // Muestra la animación de carga
    setTimeout(() => {
    document.getElementById("NYT").innerHTML = "";
    const searchTerm = document.getElementById("buscar").value;
    let searchBookTitle = [];
    searchBookTitle = data.filter((element) =>
      element.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    let searchBookAuthor = [];
    searchBookAuthor = data.filter((element) =>
      element.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (searchBookTitle.length > 0) {
      searchBookTitle.forEach((element) => {
        document.getElementById(
          "NYT"
        ).innerHTML += `<section id="tarjetasBooks"> 
          <h2>#${element.rank} ${element.title}</h2> 
          <img src="${element.book_image}" alt="">
          <p>Author: ${element.author}</p>
          <p>Weeks on list: ${element.weeks_on_list}</p>
          <p>${element.description}</p>        
          <button type="button" id="readMore"><a href="${element.amazon_product_url}">BUY ON AMAZON</a></button>      
          </section>`;
      });
    } else if (searchBookAuthor.length > 0) {
      searchBookAuthor.forEach((element) => {
        document.getElementById(
          "NYT"
        ).innerHTML += `<section id="tarjetasBooks"> 
          <h2>#${element.rank} ${element.title}</h2> 
          <img src="${element.book_image}" alt="">
          <p>Author: ${element.author}</p>
          <p>Weeks on list: ${element.weeks_on_list}</p>
          <p>${element.description}</p>        
          <button type="button" id="readMore"><a href="${element.amazon_product_url}">BUY ON AMAZON</a></button>      
          </section>`;
      });
    } else {
      document.getElementById("NYT").innerHTML = `<h2>No results found</h2>`;
    } hideLoading(); // Oculta la animación de carga
  }, 1000);
  });
};

const printGenre = async () => {
  const data = await getList();
  //generar opciones de filtro en generos
  document.getElementById("buscar").placeholder = "Fashion Manners and Customs";
  document.getElementById("filtro").innerHTML = `
      <option value="" selected>Select option</option> 
      <option value="Weekly">Weekly</option>
      <option value="Monthly">Monthly</option>
      <option value="A-Z">A-Z</option>
      <option value="Z-A">Z-A</option>
      <option value="OldestNuevo">Oldest mas nuevo</option>
      <option value="OldestAntiguo">Oldest mas antiguo</option>
      <option value="NewestNuevo">Newest mas nuevo</option>
      <option value="NewestAntiguo">Newest mas antiguo</option>`;

  const article = document.createElement("article");
  article.id = "NYT";
  document.getElementById("contenedor").appendChild(article);
  data.forEach((element) => {
    article.innerHTML += `<section id="tarjetasLista"> 
      <h1>${element.list_name}</h1> 
      <p>Oldest: ${element.oldest_published_date}</p>
      <p>Newest: ${element.newest_published_date}</p>        
      <p>Updated: ${element.updated}</p>       
      <button id='readMore' data-list-name='${element.list_name_encoded}'>READ MORE!</button>    
      </section>`;
    readMore();
  });
  filter(data);
  searchGenre(data);
};

const readMore = () => {
  document.querySelectorAll("#readMore").forEach((button) => {
    button.addEventListener("click", async () => {
      document.getElementById("buscar").placeholder = "Author or Title";
      const listName = button.getAttribute("data-list-name");
      document.getElementById("NYT").innerHTML = "";
      document.getElementById("volverAtras").innerHTML = `
        <div id='divBack'><button id='back'>< VOLVER A LISTAS DE LIBROS</button></div>        
        `;
      //generar opciones de filtro en generos
      document.getElementById("filtro").innerHTML = "";
      document.getElementById("filtro").innerHTML = `
      <option value="" selected>Select option</option> 
      <option value="AutorASC">Autor ascendente</option>
      <option value="AutorDSC">Autor descendente</option>
      <option value="TitleASC">Titulo ascendente</option>
      <option value="TitleDSC">Titulo descendente</option>
      `;
      const data = await getListGenero(listName);
      data.forEach((element) => {
        document.getElementById(
          "NYT"
        ).innerHTML += `<section id="tarjetasBooks"> 
          <h2>#${element.rank} ${element.title}</h2> 
          <img src="${element.book_image}" alt="">
          <p>Author: ${element.author}</p>
          <p>Weeks on list: ${element.weeks_on_list}</p>
          <p>${element.description}</p>        
          <button type="button" id="readMore"><a href="${element.amazon_product_url}">BUY ON AMAZON</a></button>      
          </section>`;
      });
      filterBooks(data);
      searchTiltleAuthor(data);
      // Event listener | Botón volver atrás
      document.querySelector("#back").addEventListener("click", async () => {
        document.getElementById("contenedor").innerHTML = "";
        await printGenre();
      });
    });
  });
};

// Iniciar la aplicación
document.addEventListener("DOMContentLoaded", async () => {
  await printGenre();
});
