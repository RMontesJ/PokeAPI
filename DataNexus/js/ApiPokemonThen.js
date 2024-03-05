const resultadoPantalla = document.getElementById("mostrarResultado");
const fondoEstadisticas = document.getElementById('fondoStats');
const ventanaEstadisticas = document.getElementById('ventanaEstadisticas');
const btnMas = document.getElementById('mostrarMas');
let selectTipo = document.getElementById('selectTipos');
const tipoBusqueda = document.getElementById('selectBusqueda');
//---------------------------------------------------------------------
let tipoSeleccionado = "";
let valorTipoBusqueda = "";
let offset = 0;
let limit = 50;
//---------------------------------------------------------------------
selectTipo.addEventListener('change', buscarSelectTipo);
tipoBusqueda.addEventListener('change', cambiarPlaceholder);
//---------------------------------------------------------------------
document.getElementById("ventanaEstadisticas").style.display = "none";
let pokemon = "";
let numeroPokedex = "";
const btnBuscar = document.getElementById('btnBuscar');
btnBuscar.addEventListener('click', capturarValor);
let valorInput = "";
let textoRes = "";
let valorI = 0;


// Hace un fetch de todos los pokemon
async function fetchAllPokemon(offset = 0, limit = 50) {
    //Funcion asincrona que pausa su ejecucion 'await' hasta la resolucion del 'promise'
    console.log(offset)
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?offset=" + offset + "&limit=" + limit)
    const data = await res.json();
    const pokemonBasicInfo = data.results;

    //Crear un nuevo array(allPokemons) con .map llamando a una nueva funcion asincrona que espera al promise
    const allPokemons = await Promise.all(pokemonBasicInfo.map(async (pokemon) => {
        if (pokemon.name.includes("-")) {
            return undefined;
        }
        else {
            //Si el nombre esta correcto(sin guiones) se retorna la funcion fetchEachPokemon,con el parametro del Pokemon
            return await fetchEachPokemon(pokemon)

        }
    }));
    //La función retorna una parte del array (todos los pokemons que esta definidos '!==undefined')
    return allPokemons.filter((pokemon) => pokemon !== undefined);
}

// Guarda la informacion detallada de cada pokemon
async function fetchEachPokemon(pokemon) {
    //Crear constante que almacena la informacion que nos de la peticion que hacemos(fetch)
    const res = await fetch(pokemon.url);
    //Pasar la respuesta a formato json con otra variable
    const data = res.json();
    //Retornar dicha variable
    return data;
}

// Recoge la informacion de todos los pokemon y luego llama a la funcion que los imprima
// Esta funcion es para que se impriman los pokemons en orden segun su id
fetchAllPokemon().then(function (allPokemons) {
    impAllPokemons(allPokemons);
})

// Imprime 50 pokemon adicionales cada vez que se hace click en el boton "btnMas"
btnMas.addEventListener('click', function () {
    //Sumar 50 a la variable
    limit += 50;
    //Buscar los pokemons desde el principio hasta el nuevo límite
    fetchAllPokemon(offset, limit).then(function (allPokemons) {
        impAllPokemons(allPokemons);
    })
})


// Imprime los pokemon cuando se carga la pagina
function impAllPokemons(allPokemons) {
    //Se pasa el parametro que contiene los pokemons correctos
    console.log(allPokemons);
    textoRes = "";
    //Recorrer todo el array
    for (let i = valorI; i < allPokemons.length; i++) {
        let tipos = "";
        console.log("entra")
        //Para mostrar en la ventana Pokemon el tipo, hacemos otro bucle
        for (let j = 0; j < allPokemons[i].types.length; j++) {
            //Especificamos que coja solo el nombre de los typos que tenga
            tipos += "<p class='" + allPokemons[i].types[j].type.name + " tipo'>" + allPokemons[i].types[j].type.name + "</p>";
        }
        //Sumar toda las variable recogidas en una variable que se imprimirá en el html
        //Esta ventana se reproducira para cada pokemon del array
        textoRes += "<div id='ventanaPokemon'><ul><li>"
            + "<img src='" + allPokemons[i].sprites.other['official-artwork'].front_default + "' alt='" + allPokemons[i].name + "'></li>"
            + "<li id ='nombrePokemon'><h3>" + allPokemons[i].name + "</h3></li>"
            + "<li id='pokemon-tipos'>" + tipos + "</li>"
            //Ademas creamos un boton vinculado a la id del pokemon y una funcion(onclick='mostrarFicha')
            + "<li><button id='ficha' onclick='mostrarFicha(" + allPokemons[i].id + ")'>Ver ficha</button></li></ul></div>";
    }
    valorI = allPokemons.length;
    //Imprimir textoRes en el html después de reocger a todos los pokemons
    resultadoPantalla.innerHTML += textoRes;
}

// Cambia el texto del placeholder
function cambiarPlaceholder() {
    //Dependiento de la opcion que pongemos para buscar, se pondra en el placeholder un texto u otro
    //Variable que recoja el valor de la opcion
    valorTipoBusqueda = document.getElementById('selectBusqueda').value;
    if (valorTipoBusqueda == "nombre") {
        document.getElementById('valorBusqueda').placeholder = "¿Qué pokemon estas buscando?"
    }
    else if (valorTipoBusqueda == "tipo") {
        document.getElementById('valorBusqueda').placeholder = "¿De qué tipo es tu pokemon?"
    }
    else if (valorTipoBusqueda == "habilidad") {
        document.getElementById('valorBusqueda').placeholder = "¿Qué habilidad tiene tu pokemon?"
    }
}

// Captura el valor del tipo de busqueda
function capturarValor() {
    //Se iguala la variable donde se imprimen los resultados para que no salgan los anteriores
    textoRes = "";
    //Forma de reiniciar todos los resutados generados en el HTML anteriormente
    resultadoPantalla.innerHTML = "";
    valorTipoBusqueda = document.getElementById('selectBusqueda').value;
    valorInput = document.getElementById('valorBusqueda').value;
    console.log(valorInput);
    pasarMinusculas(valorInput);
}

// Pasa el valor introducido en la barra de busqueda a minuscula
function pasarMinusculas(valorMinuscula) {
    //Pasar el valor introducido en el input a minuscula
    valorMinuscula = valorMinuscula.toLowerCase();
    console.log(valorMinuscula);
    ponerTipoBusqueda(valorMinuscula);
}

// Manda a una funcion de impresion diferente segun el tipo de busqueda seleccionado
function ponerTipoBusqueda(valorMinuscula) {
    //Para las busquedas de este tipo, hacemos una busqueda de todos los pokemons disponibles
    //Hace que tarde un poco debido a toda la labor de la CPU
    limit = 1025;
    //Recordemos que la variable allPokemons consiste en un array con todos los pokemons aceptados
    //Con lo cual, en cada condicional se hace una busqueda dentro de ese array del nombre deseado
    if (valorTipoBusqueda == "nombre") {
        fetchAllPokemon(offset, limit).then(function (allPokemons) {
            buscarNombre(valorMinuscula, allPokemons);
        })

    }
    else if (valorTipoBusqueda == "tipo") {
        fetchAllPokemon(offset, limit).then(function (allPokemons) {
            buscarTipo(valorMinuscula, allPokemons);
        })

    }
    else if (valorTipoBusqueda == "habilidad") {
        fetchAllPokemon(offset, limit).then(function (allPokemons) {
            buscarHabilidad(valorMinuscula, allPokemons);
        })

    }
}
// Imprime los resultados de la busqueda
function imprimirBusqueda() {
    resultadoPantalla.innerHTML = textoRes;
    btnMas.style.display = "none";
}

// Imprime los resultados de la busqueda por nombre
function buscarNombre(busqueda, allPokemons) {  //busqueda es el valor del input pasado a minusculas
    textoRes = "";

    for (let i = 0; i < allPokemons.length; i++) {
        //Recorre todo el array
        console.log("entra");
        let tipos = "";//Crear variable tipos para mostrarlo más adelante
        //La funcion nativa '.include' devuelve un valor boolean,dependiendo de si en el array.name encuentra algun campo igual a la busqueda
        if (allPokemons[i].name.includes(busqueda)) {
            //Si lo encuentra se hace un bucle para recoger sus tipos i guardarlos en una variable
            for (let j = 0; j < allPokemons[i].types.length; j++) {
                tipos += "<p class='" + allPokemons[i].types[j].type.name + " tipo'>" + allPokemons[i].types[j].type.name + "</p>";
            }
            //Despues se recoje su nombre los tipos guardados antes , la imagen y un boton vinculado a su id
            textoRes += "<div id='ventanaPokemon'><ul><li>"
                + "<img src='" + allPokemons[i].sprites.other['official-artwork'].front_default + "' alt='" + allPokemons[i].name + "'></li>"
                + "<li id ='nombrePokemon'><h3>" + allPokemons[i].name + "</h3></li>"
                + "<li id='pokemon-tipos'>" + tipos + "</li>"
                + "<li><button id='ficha' onclick='mostrarFicha(" + allPokemons[i].id + ")'>Ver ficha</button></li></ul></div>";
        }
    }
    valorI = allPokemons.length;
    imprimirBusqueda();
}

// Imprime los resultados de la busqueda por tipo
function buscarTipo(busqueda, allPokemons) {
    textoRes = "";
    //Se usa el primer bucle para recorrer todos lo pokemons
    for (let i = 0; i < allPokemons.length; i++) {
        //El segundo es para recorrer el campo de tipos de cada uno
        for (let j = 0; j < allPokemons[i].types.length; j++) {
            if (allPokemons[i].types[j].type.name.includes(busqueda)) {
                //Si el valor introducido en el input coincide de ejecuta este codigo dependiendo del numero de tipos
                if (allPokemons[i].types.length == 1) {
                    //Si solo tiene un tipo
                    textoRes += ""
                        + "<div id='ventanaPokemon'><ul>"
                        + "<li><img src='" + allPokemons[i].sprites.other['official-artwork'].front_default + "' alt='" + allPokemons[i].name + "'></li>"
                        + "<li id ='nombrePokemon'><h3>" + allPokemons[i].name + "</h3></li>"
                        + "<li id='pokemon-tipos'>"
                        + "<p class='" + allPokemons[i].types[0].type.name + " tipo'>" + allPokemons[i].types[0].type.name + "</p>"
                        + "</li>"
                        + "<li><button id='ficha' onclick='mostrarFicha(" + allPokemons[i].id + ")'>Ver ficha</button></li>"
                        + "</ul></div>";
                }
                else {
                    textoRes += "<div id='ventanaPokemon'><ul><li>"
                        + "<img src='" + allPokemons[i].sprites.other['official-artwork'].front_default + "' alt='" + allPokemons[i].name + "'></li>"
                        + "<li id ='nombrePokemon'><h3>" + allPokemons[i].name + "</h3></li>"
                        + "<li id='pokemon-tipos'>"
                        + "<p class='" + allPokemons[i].types[0].type.name + " tipo'>" + allPokemons[i].types[0].type.name + "</p>"
                        + "<p class='" + allPokemons[i].types[1].type.name + " tipo'>" + allPokemons[i].types[1].type.name + "</p>"
                        + "</li>"
                        + "<li><button id='ficha' onclick='mostrarFicha(" + allPokemons[i].id + ")'>Ver ficha</button></li></ul></div>";
                }
            }
        }
    }
    imprimirBusqueda();
}

// Imprime los resultados de la busqueda por habilidad
function buscarHabilidad(busqueda, allPokemons) {//Funcion que recorre el array de habilidades
    textoRes = "";
    //Ente método hace una busqueda en el string, y si encuentra un espacio lo remplaza por un guión
    busqueda = busqueda.replace(" ", "-");

    for (let i = 0; i < allPokemons.length; i++) {
        //Recorrer el array con todos los pokemon
        for (let j = 0; j < allPokemons[i].abilities.length; j++) {
            //Recorrer las abilidaddes de cada pokemon
            if (allPokemons[i].abilities[j].ability.name.includes(busqueda)) {
                //Si el pokemon tiene una abilidad que coincide con la abilidad que se busca'.includes()'
                //Con estos condicionales mostramos el pokemon dependiendo de los tipos que tenga(fuego,dragon,etc...)
                if (allPokemons[i].types.length == 1) {
                    textoRes += ""
                        + "<div id='ventanaPokemon'><ul>"
                        + "<li><img src='" + allPokemons[i].sprites.other['official-artwork'].front_default + "' alt='" + allPokemons[i].name + "'></li>"
                        + "<li id ='nombrePokemon'><h3>" + allPokemons[i].name + "</h3></li>"
                        + "<li id='pokemon-tipos'>"
                        + "<p class='" + allPokemons[i].types[0].type.name + " tipo'>" + allPokemons[i].types[0].type.name + "</p>"
                        + "</li>"
                        + "<li><button id='ficha' onclick='mostrarFicha(" + allPokemons[i].id + ")'>Ver ficha</button></li>"
                        + "</ul></div>";
                }
                else {
                    textoRes += "<div id='ventanaPokemon'><ul><li>"
                        + "<img src='" + allPokemons[i].sprites.other['official-artwork'].front_default + "' alt='" + allPokemons[i].name + "'></li>"
                        + "<li id ='nombrePokemon'><h3>" + allPokemons[i].name + "</h3></li>"
                        + "<li id='pokemon-tipos'>"
                        + "<p class='" + allPokemons[i].types[0].type.name + " tipo'>" + allPokemons[i].types[0].type.name + "</p>"
                        + "<p class='" + allPokemons[i].types[1].type.name + " tipo'>" + allPokemons[i].types[1].type.name + "</p>"
                        + "</li>"
                        + "<li><button id='ficha' onclick='mostrarFicha(" + allPokemons[i].id + ")'>Ver ficha</button></li></ul></div>";
                }
            }
        }
    }
    imprimirBusqueda();

}

// Funcion para mostrar la informacion detallada de cada pokemon
function mostrarFicha(id) {
    //Le pasamos el parametro de la id del pokemon cada vez que creamos una ventana pokemon en html
    //Con esa id, hacemos un fetch al hacer click en el boton de ver ficha
    fetch("https://pokeapi.co/api/v2/pokemon/" + id + "/")
        .then(res => res.json())
        .then(res => {
            console.log(res.name)
            //En la api del pokemon vamos al campo de estadisticas(stats),y creamos una variable
            stats = res.stats;
            //En la api del pokemon vamos al campo de tipos(types),y creamos una variable
            tipos = res.types;
            let textoStats = ""; //Variable donde mostraremos la informacion de las estadisticas y tipos
            //La informacion la almacenaremos en formato de tabla con la imagen y los campos
            textoStats += "<table id='stats'><tr><td rowspan='7'>"
                + "<img src='" + res.sprites.other['official-artwork'].front_default + "' alt='" + res.name + "'>"
                + "</td></tr>";
            //Mediante un bucle vamos mostrando el nombre del campo y el contenido(depende de la longitud del for)
            for (let i = 0; i < stats.length; i++) {
                textoStats += "<tr id ='nombreStat'>"
                    + "<td>" + stats[i].stat.name + ":</td>"
                    + "<td> " + stats[i].base_stat + "</td>"
                    + "</tr>";
            }
            //Cerramos la table y creamos un elemento de lista donde pondremos los tipos
            textoStats += "</table><ul class='tipoFicha'><li id='pokemon-tipos'>";
            //Mediante otro for almacenamos los tipos para mostrarlos en esa posicion de la lista
            for (let i = 0; i < tipos.length; i++) {
                textoStats += "<p class='" + tipos[i].type.name + " tipo'>" + tipos[i].type.name + "</p>"
            }
            //Además añadimos un boton enlazado a la funcion de cerrar la ficha tecnica del pokemon
            textoStats += "</li></ul><button id='cerrarVentana' onclick='cerrarFicha()'>Cerrar ventana</button>";

            ventanaEstadisticas.innerHTML = textoStats;//Imprimir en el html la info almacenada en la variable
            //Se añaden algunos estilos en el propio js
            ventanaEstadisticas.style.display = "flex";
            //fondoEstadisticas es una section en el html donde se pondra el div con la tabla y demás
            fondoEstadisticas.style.display = "flex";
            fondoEstadisticas.style.backdropFilter = "blur(5px)";

        })
    imprimirBusqueda()
}
//Funcion para ocultar la ficha tecnica una vez se haya abierto
function cerrarFicha() {
    //Mediante (.display = "none") podemos ocultar el elemento que queramos además de un fondo o capa
    ventanaEstadisticas.style.display = "none";
    fondoEstadisticas.style.display = "none";
    fondoEstadisticas.style.backdropFilter = "none";
}

// Funcion para buscar segun el tipo seleccionado en el elemento HTML (selectTipos)
function buscarSelectTipo() {
    //Variable que almacena el valor del select
    tipoSeleccionado = selectTipo.value;
    console.log(tipoSeleccionado);
    //  Si se deja el select en predeterminado(con el campo en tipo) de recarga la página
    if (tipoSeleccionado == "tipo") {
        location.reload();
    }
    else {
        //Si se ha seleccionado algun tipo de pokemon se hace una fech de todos los pokemons(limit)
        limit = 1025;

        fetchAllPokemon(offset, limit).then(function (allPokemons) {
            //Además, se llama a la funcion de buscarTipo pasando el tipo seleccionado como parametro
            buscarTipo(tipoSeleccionado, allPokemons);
        })
    }

}
