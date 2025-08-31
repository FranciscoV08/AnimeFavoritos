// Obtenemos referencias a elementos del DOM
const inputAnime = document.getElementById("inputAnime")   // Input donde el usuario escribe el nombre del anime
const btn = document.getElementById("inputBtn")           // Botón para ejecutar la búsqueda
const resultado = document.getElementById("resultado")    // Contenedor donde se mostrarán los resultados de búsqueda
const guardados = document.getElementById("favoritos")    // Contenedor donde se mostrarán los animes guardados en favoritos

// Arrays para manejar datos
let listAnimes = []      // Guardará la lista de animes que devuelve la API al buscar
let listGuardado = []    // Guardará los animes que el usuario selecciona como favoritos


// =============================
// FUNCIÓN PRINCIPAL DEL BUSCADOR
// =============================
const buscadorName = async () => {
    // Obtenemos el valor escrito en el input
    const animeName = inputAnime.value

    // Llamamos a la API para traer los animes que coincidan con el nombre
    await getAnimes(animeName)

    // Mostramos los resultados obtenidos en el DOM
    await mostrarResultados(listAnimes)
}


// ======================================
// FUNCIÓN PARA MOSTRAR RESULTADOS EN HTML
// ======================================
const mostrarResultados = (lista) => {
    console.log(lista)

    // Si no hay resultados, mostramos un mensaje
    if (lista.length === 0) {
        resultado.innerHTML = "<p>No se encontró ningún anime.</p>";
        return;
    }

    // Limpiamos el contenedor antes de renderizar nuevos resultados
    resultado.innerHTML = "";

    // Recorremos la lista de animes
    lista.forEach(anime => {
        // Creamos un div por cada anime
        const div = document.createElement("div");
        div.classList.add("card")   // Le damos la clase card para estilos

        // Le añadimos la imagen y el título
        div.innerHTML = `
            <img src="${anime.jpg}" alt="${anime.titulo}">
            <h3>${anime.titulo}</h3>
        `;

        // Agregamos el div al contenedor de resultados
        resultado.appendChild(div)

        // Hacemos que al hacer click en un anime, se guarde en favoritos
        div.addEventListener('click', guardarAnime)
    });
}


// ===============================
// FUNCIÓN PARA LLAMAR A LA API JIKAN
// ===============================
const getAnimes = async (name) => {
    // Petición a la API con el nombre escrito
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${name}&limit=5`);
    const data = await res.json();
    const animes = data.data

    // Reiniciamos la lista de animes
    listAnimes = []

    // Extraemos solo los datos que necesitamos (titulo e imagen)
    const datosReduce = animes.map(animes => {
        const data = {
            titulo: animes.title,              // Guardamos el título
            jpg: animes.images.jpg.image_url   // Guardamos la URL de la imagen
        }
        listAnimes.push(data)  // Agregamos el objeto a la lista
    })
    console.log(datosReduce)
}


// ==========================================
// FUNCIÓN PARA GUARDAR UN ANIME EN FAVORITOS
// ==========================================
const guardarAnime = (e) => {
    console.log("Guardando anime")

    // Creamos un objeto con la info del anime clickeado
    const fAnime = {
        titulo: e.target.alt,   // Tomamos el título desde el atributo alt de la imagen
        jpg: e.target.src       // Tomamos la imagen desde el src
    }

    // Lo agregamos al array de favoritos
    // Necesitamos Arreglar el duplicado al guardar
    const existe = listGuardado.some(anime => anime.titulo === fAnime.titulo)
    if (!existe) {
        listGuardado.push(fAnime)
        // Volvemos a renderizar los favoritos actualizados
        renderFavoritos()
    }else{
        alert("Ya existe en favoritos")
    }
}


// ===========================================
// FUNCIÓN PARA RENDERIZAR LOS FAVORITOS GUARDADOS
// ===========================================
const renderFavoritos = () => {
    // Limpiamos el contenedor antes de renderizar
    guardados.innerHTML = "";

    // Recorremos los favoritos guardados
    listGuardado &&
        listGuardado.forEach(anime => {
            const div = document.createElement("div");
            div.classList.add("af-card")   // Clase para estilos

            div.innerHTML = `
            <img src="${anime.jpg}" alt="${anime.titulo}">
            <h3>${anime.titulo}</h3>
        `;

            // Lo agregamos al contenedor de favoritos
            guardados.appendChild(div)

            // Evento para poder eliminarlo con un click
            div.addEventListener('click', deletFavorito)
        });
}


// ===============================
// FUNCIÓN PARA ELIMINAR UN FAVORITO
// ===============================
const deletFavorito = (e) => {
    // Filtramos la lista de favoritos y eliminamos el clickeado
    listGuardado = listGuardado.filter(anime => anime.titulo != e.target.alt)

    // Volvemos a renderizar la lista de favoritos actualizada
    renderFavoritos()
}


// ======================================
// EVENTO PARA EL BOTÓN DE BÚSQUEDA
// ======================================
btn.addEventListener('click', () => buscadorName())
