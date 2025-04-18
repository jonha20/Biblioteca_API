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

const filterWM = async () => {
  const data = await getList();

  //pintar haciendo el filtro
  document.getElementById("filtro").addEventListener("change", async () => {
    document.getElementById("NYT").innerHTML = ""; // Limpiar todo
    //vaciar los arrays
    
    // //Filtro Weekly / Monthly
    // let weeklyData =
    // let monthlyData = 
    // //Filtro A-Z / Z-A
    // let az =
    // let za = 
    // //Filtro fecha oldest
    // let oldestNuevo = 
    // let oldestAntiguo = 
    const select = document.getElementById("filtro");
    const textoSeleccionado =
      select.options[select.selectedIndex].text.toUpperCase();

    // Crear un NUEVO article en cada filtrado
    // const article = document.createElement("article");
    // article.id = "NYT";
    // document.getElementById("contenedor").appendChild(article);

    let datosFiltrados = [];
    if (textoSeleccionado == "WEEKLY") {
      datosFiltrados =  data.filter((element) => element.updated == "WEEKLY");
    } else if (textoSeleccionado == "MONTHLY") {
      datosFiltrados = data.filter((element) => element.updated == "MONTHLY");
    }else if (textoSeleccionado == "A-Z") {
      datosFiltrados =  data.sort((a, b) => a.list_name.localeCompare(b.list_name));
    }else if (textoSeleccionado == "Z-A") {
      datosFiltrados = data.sort((a, b) => b.list_name.localeCompare(a.list_name));
    }else if (textoSeleccionado == "OLDEST MAS NUEVO") {
      datosFiltrados = data.sort((a, b) => Date.parse(b.oldest_published_date) - Date.parse(a.oldest_published_date));
    }else if (textoSeleccionado == "OLDEST MAS ANTIGUO") {
      datosFiltrados = data.sort((a, b) => Date.parse(a.oldest_published_date) - Date.parse(b.oldest_published_date));
    }else if (textoSeleccionado == "NEWEST MAS NUEVO") {
      datosFiltrados = data.sort((a, b) => Date.parse(b.newest_published_date) - Date.parse(a.newest_published_date));
    }else if (textoSeleccionado == "NEWEST MAS ANTIGUO") {
      datosFiltrados = data.sort((a, b) => Date.parse(a.newest_published_date) - Date.parse(b.newest_published_date));
    } else {
      // Si no es filtro, mostrar todos los datos
      datosFiltrados = data;
    }

    // Generar HTML (usando clases en lugar de IDs)
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
  });
};
const printBestSellers = async () => {
  const data = await getList();
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
};

const readMore = () => {
  document.querySelectorAll("#readMore").forEach((button) => {
    button.addEventListener("click", async () => {
      const listName = button.getAttribute("data-list-name");
      document.getElementById("NYT").innerHTML = "";
      document.getElementById("volverAtras").innerHTML = `
        <div id='divBack'><button id='back'>< VOLVER A LISTAS DE LIBROS</button></div>        
        `;
      const data = await getListGenero(listName);
      data.forEach((element) => {
        document.getElementById(
          "NYT"
        ).innerHTML += `<section id="tarjetasBooks"> 
          <h2>#${element.rank} ${element.title}</h2> 
          <img src="${element.book_image}" alt="">
          <p>Weeks on list: ${element.weeks_on_list}</p>
          <p>${element.description}</p>        
          <button type="button" id="readMore"><a href="${element.amazon_product_url}">BUY ON AMAZON</a></button>      
          </section>`;
      });
      // Event listener | Botón volver atrás
      document.querySelector("#back").addEventListener("click", async () => {
        document.getElementById("contenedor").innerHTML = "";
        await printBestSellers();
      });
    });
  });
};

// Iniciar la aplicación
document.addEventListener("DOMContentLoaded", async () => {
  await printBestSellers();
  await filterWM();
});
