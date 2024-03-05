const resultadoPantalla = document.getElementById("mostrarResultado");
const fondoEstadisticas = document.getElementById('fondoStats');
const ventanaEstadisticas = document.getElementById('ventanaEstadisticas');
let selectTipo = document.getElementById('selectTipos');
selectTipo.addEventListener('change', buscarSelectTipo);
let tipoSeleccionado = "";
let tipoBusqueda = "";
let placeholder = document.getElementById('selectBusqueda');
placeholder.addEventListener('change', cambiarPlaceholder);
//---------------------------------------------------------------------
document.getElementById("ventanaEstadisticas").style.display = "none";
let pokemon = "";
let numeroPokedex = "";
const btnBuscar = document.getElementById('btnBuscar');
btnBuscar.addEventListener('click', capturarValor);
let valorInput = "";
let textoRes = "";
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 102; i++) {
    fetch(URL + i)
        .then((res) => res.json())
        .then(data => {
            console.log(data)
            let tipos = "";
            for (let j = 0; j < data.types.length; j++) {
                tipos += "<p class='" + data.types[j].type.name + " tipo'>" + data.types[j].type.name + "</p>";
            }

            if (data.sprites.other['official-artwork'].front_default === undefined) {
                textoRes += "";
            }
            else {
                console.log(data.sprites.other['official-artwork'].front_default);
                resultadoPantalla.innerHTML += ""
                    + "<div id='ventanaPokemon' class='pokemon" + data.id + "'>"
                    +   "<ul>"
                    +       "<li><img src='" + data.sprites.other['official-artwork'].front_default + "' alt='" + data.name + "'></li>"
                    +       "<li id='nombrePokemon'>"
                    +           "<p class='pokemon-id'>" + data.id + "</p>"
                    +           "<h3>" + data.name + "</h3>"
                    +       "</li>"
                    +       "<li id='tiposPokemon'>" + tipos + "</li>"
                    +       "<li><button class='ficha' onclick='mostrarFicha(" + data.id + ", " + data.id + ")'>Ver ficha</button></li>"
                    +   "</ul>"
                    + "</div>"
            }
        })
}



imprimirBusqueda();
function cambiarPlaceholder() {
    if (tipoBusqueda.value == "nombre") {
        document.getElementById('valorBusqueda').placeholder = "¿Qué pokemon estas buscando?"
    }
    else if (tipoBusqueda.value == "tipo") {
        document.getElementById('valorBusqueda').placeholder = "¿Qué tipo de pokemon estas buscando?"
    }
    else if (tipoBusqueda.value == "habilidad") {
        document.getElementById('valorBusqueda').placeholder = "¿Qué habilidad quieres que tenga tu pokemon?"
    }
}

function capturarValor() {
    textoRes = ""
    resultadoPantalla.innerHTML = "";
    tipoBusqueda = document.getElementById('selectBusqueda');
    valorInput = document.getElementById('valorBusqueda').value;
    console.log(valorInput);
    pasarMinusculas(valorInput);
}

function pasarMinusculas(valorMinuscula) {
    valorMinuscula = valorMinuscula.toLowerCase();
    console.log(valorMinuscula);
    ponerTipoBusqueda(valorMinuscula);
}

function ponerTipoBusqueda(valorMinuscula) {
    if (tipoBusqueda.value == "nombre") {
        fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1025")
            .then(res => res.json())
            .then(res => {
                console.log(res)
                pokemon = res.results;
                buscarNombre(valorMinuscula, pokemon);
            })

    }
    else if (tipoBusqueda.value == "tipo") {
        fetch("https://pokeapi.co/api/v2/type?offset=0&limit=18")
            .then(res => res.json())
            .then(res => {
                console.log(res)
                pokemon = res.results;
                buscarTipo(valorMinuscula, pokemon);
            })

    }
    else if (tipoBusqueda.value == "habilidad") {
        fetch("https://pokeapi.co/api/v2/ability?offset=0&limit=200")
            .then(res => res.json())
            .then(res => {
                console.log(res)
                pokemon = res.results;
                buscarHabilidad(valorMinuscula, pokemon);
            })

    }
}

function buscarNombre(busqueda, pokemon) {
    textoRes = "";
    for (let i = 0; i < pokemon.length; i++) {
        if (pokemon[i].name.includes(busqueda)) {
            numeroPokedex = pokemon[i].url
            numeroPokedex = numeroPokedex.substring(34);
            numeroPokedex = numeroPokedex.replace("/", "");
            if (pokemon[i].name.includes("-")) {
                textoRes += "";
            }
            else {
                textoRes += "<div id='ventanaPokemon'><ul><li>"
                    + "<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + numeroPokedex
                    + ".png' alt='" + pokemon[i].name + "'></li>"
                    + "<li id ='nombrePokemon'><h3>" + pokemon[i].name + "</h3></li>"
                    + "<li><button id='ficha' onclick='mostrarFicha(" + (i + 1) + ", " + numeroPokedex + ")'>Ver ficha</button></li></ul></div>";
            }
            console.log(pokemon[i]);
        }

    }
    imprimirBusqueda();
}

function buscarTipo(busqueda, tipo) {
    for (let i = 0; i < tipo.length; i++) {
        if (tipo[i].name.includes(busqueda)) {

            console.log(tipo[i]);
            apiTipo(tipo[i].url);//Pasar url de la habilidad que coincide
        }
    }
    imprimirBusqueda();
}

function apiTipo(tipo) {//Funcion que llama a la API deseada
    fetch(tipo)
        .then(res => res.json())
        .then(res => {
            console.log(res.pokemon)
            pokemon = res.pokemon;
            nombreTipoHabilidad(pokemon);//Pasa el array con la abilidad
        })
}

function buscarHabilidad(busqueda, habilidad) {//Funcion que recorre el array de habilidades 
    for (let i = 0; i < habilidad.length; i++) {
        if (habilidad[i].name.includes(busqueda)) {
            console.log(habilidad[i]);
            console.log(textoRes);
            apiHabilidad(habilidad[i].url)//Pasa la url de la habilidad para examinarla
        }
    }

}

function apiHabilidad(habilidad) {
    fetch(habilidad)
        .then(res => res.json())
        .then(res => {
            console.log(res.pokemon)
            pokemon = res.pokemon;

            nombreTipoHabilidad(pokemon);
        })
}

function nombreTipoHabilidad(pokemon) { //Funcion que imprime los pokemon que presentan una habilidad
    textoRes = "";
    for (let i = 0; i < pokemon.length; i++) {
        numeroPokedex = pokemon[i].pokemon.url
        numeroPokedex = numeroPokedex.substring(34);
        numeroPokedex = numeroPokedex.replace("/", "");
        if (pokemon[i].pokemon.name.includes("-")) {
            textoRes += "";
        }
        else {
            textoRes += "<div id='ventanaPokemon'><ul><li>"
                + "<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + numeroPokedex
                + ".png' alt='" + pokemon[i].name + "'></li>"
                + "<li id ='nombrePokemon'><h3>" + pokemon[i].pokemon.name + "</h3></li>"
                + "<li><button class='ficha' onclick='mostrarFicha(" + (i + 1) + ", " + numeroPokedex + ")'>Ver ficha</button></li></ul></div>";
        }

    }

    imprimirBusqueda()
}

function imprimirBusqueda() {
    resultadoPantalla.innerHTML = textoRes;

}



//Funcion para mostrar la ficha con su contenido y quitarla
function mostrarFicha(id, numeroPokedex) {
    fetch("https://pokeapi.co/api/v2/pokemon/" + id + "/")
        .then(res => res.json())
        .then(res => {
            console.log(res.name)
            stats = res.stats;
            let textoStats = "";
            textoStats += "<table id='stats'><tr><td rowspan='7'>"
                + "<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + numeroPokedex + ".png' "
                + "alt='" + res.name + "'>"
                + "</td></tr>";
            for (let i = 0; i < stats.length; i++) {
                textoStats += "<tr id ='nombreStat'>"
                    + "<td>" + stats[i].stat.name + ":</td>"
                    + "<td> " + stats[i].base_stat + "</td>"
                    + "</tr>";

            }
            textoStats += "</table><button id='cerrarVentana' onclick='cerrarFicha()'>Cerrar ventana</button>";
            ventanaEstadisticas.innerHTML = textoStats;
            ventanaEstadisticas.style.display = "flex";
            fondoEstadisticas.style.display = "flex";
            fondoEstadisticas.style.backdropFilter = "blur(5px)";

        })
    imprimirBusqueda()
}
function cerrarFicha() {
    ventanaEstadisticas.style.display = "none";
    fondoEstadisticas.style.display = "none";
    fondoEstadisticas.style.backdropFilter = "none";
}

function buscarSelectTipo() {
    tipoSeleccionado = selectTipo.value;
    console.log(tipoSeleccionado);
    fetch("https://pokeapi.co/api/v2/type?offset=0&limit=18")
        .then(res => res.json())
        .then(res => {
            console.log(res)
            tipo = res.results;
            buscarTipo(tipoSeleccionado, tipo);
        })

}
