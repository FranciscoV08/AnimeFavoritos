
const inputAnime = document.getElementById("inputAnime")
const btn = document.getElementById("inputBtn")
const resultado = document.getElementById("resultado")
const guardados = document.getElementById("favoritos")

let listAnimes = []
let listGuardado = []

// funciones para el buscador
const buscadorName = async () => {
    // Obtenemos el valor del input 
    const animeName = inputAnime.value

    await getAnimes(animeName)
    await mostrarResultados(listAnimes)
}

const mostrarResultados = (lista) => {
    console.log(lista)
    if (lista.length === 0) {
        resultado.innerHTML = "<p>No se encontró ningún anime.</p>";
        return;
    }
    
    resultado.innerHTML = "";

    // Iteramos array de obj
    lista.forEach(anime => {
        const div = document.createElement("div");
        div.classList.add("card")
        div.innerHTML = `
            <img src="${anime.jpg}" alt="${anime.titulo}">
            <h3>${anime.titulo}</h3>
            
        `;
        resultado.appendChild(div)


        div.addEventListener('click', guardarAnime)

    });

}

const getAnimes = async (name) => {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${name}&limit=5`);
    const data = await res.json();
    const animes = data.data

    listAnimes =[]

    //devuelve un nuvo array de obj 
    const datosReduce = animes.map(animes => {

        const data= {
            titulo: animes.title,
            jpg: animes.images.jpg.image_url
        }
        
        listAnimes.push(data)
    })
    console.log(datosReduce)
    // Agregamos el nuevo array 
}

const guardarAnime = (e) => {

    console.log("Guardando anime")

   const fAnime = {
        titulo: e.target.alt,
        jpg: e.target.src
    }
    

    listGuardado.push(fAnime)
    console.log(listGuardado)
    renderFavoritos()
}

const renderFavoritos = ()=> {
    guardados.innerHTML ="";

    listGuardado &&
    listGuardado.forEach(anime => {
        const div = document.createElement("div");
        div.classList.add("af-card")
        div.innerHTML = `
            <img src="${anime.jpg}" alt="${anime.titulo}">
            <h3>${anime.titulo}</h3>
            
        `;
        guardados.appendChild(div)

        div.addEventListener('click', deletFavorito)

    });
}

const deletFavorito = (e) => {
    // console.log(e.target.alt)

    listGuardado = listGuardado.filter( anime => anime.titulo != e.target.alt)
    renderFavoritos()

}

btn.addEventListener('click', () => buscadorName()) 