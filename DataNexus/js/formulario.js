const btnComprobar = document.getElementById('btnComprobar');
btnComprobar.addEventListener('click', validarRespuesta);
let formulario = document.getElementById('formulario');
const resultado = document.getElementById('resultado');
let input1 = "";
let input2 = "";
let input3 = "";
let pokedex = new Array();
let pokemon = "";
let preguntas = "";
let tipos = "";
let pasar = false;
let pregunta2Correcta = false;
let pregunta3Correcta = false;
let puntuacion = "";
document.getElementById('resultado').style.display = "none";
//---------------------------------------------------------
fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1025")
    .then(res => res.json())
    .then(res => {
        pokemons = res.results;
        pasarFetch(pokemons);
    })
fetch("formulario/preguntas.json")
    .then(res => res.json())
    .then(res => {
        preguntas = res;
        pasarFetch(preguntas);
    })


function pasarFetch(array) {
    if (pasar === true) {
        preguntas = array;
        pasar = false

    }
    else {
        pokemon = array;
        pasar = true;

    }
    if (preguntas != "" && pokemon != "") {
        elegirPokemon();
    }

}

function elegirPokemon() {
    console.log(preguntas)
    console.log(pokemon)
    let pregunta = "";
    for (let i = 0; i < 3; i++) {
        
        // da un numero aleatorio
        let pokemonAleatorio = Math.floor(Math.random() * 1025);
        // concatena div con las preguntas del formulario.json y los nombres los coge de la api
        pokedex[i] = pokemonAleatorio + 1;
        pregunta += "<div class='cuestionario'>";
        pregunta += "<div class='pregunta'><h3 id='pre'>" + preguntas[i].pregunta + pokemon[pokemonAleatorio].name + "?</h3></div>";
        pregunta += "<input id='respuesta" + (i + 1) + "' type='text'>";
        pregunta += "</div>";

    }
    console.log(pokedex)

    formulario.innerHTML = pregunta;
}

function validarRespuesta() {
    puntuacion="";
    input1 = document.getElementById('respuesta1').value;
    input2 = document.getElementById('respuesta2').value;
    input3 = document.getElementById('respuesta3').value;

    if (pokedex[0] == input1) {
        console.log("Respuesta 1 correcta");
        puntuacion += "<img src='img/tick.png' alt=''><h2>Respuesta 1 correcta</h2>";
        input1 = document.getElementById('respuesta1').style.display = 'none';
        input2 = document.getElementById('respuesta2').style.display = 'none';
        input3 = document.getElementById('respuesta3').style.display = 'none';
    }
    else {
        console.log("Respuesta 1 incorrecta");
        puntuacion += "<img src='img/cruz.png' alt=''><h2>Respuesta 1 incorrecta</h2>";
        input1 = document.getElementById('respuesta1').style.display = 'none';
        input2 = document.getElementById('respuesta2').style.display = 'none';
        input3 = document.getElementById('respuesta3').style.display = 'none';
    }
    validarTipo(input2,input3);
    

}
function validarTipo(respuesta,input3) {
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokedex[1] + "/")
        .then(res => res.json())
        .then(res => {
            tipos = res.types;
            //console.log(res.types)
            validarPregunta2(respuesta, tipos,input3);
        })
}

function validarPregunta2(respuesta, tipo,input3) {
    for (let i = 0; i < tipo.length; i++) {
        if (tipo[i].type.name == respuesta) {
            pregunta2Correcta = true;
        }
    }
    if (pregunta2Correcta === false) {
        console.log("Respuesta 2 incorrecta");
        puntuacion += "<img src='img/cruz.png' alt=''><h2> Respuesta 2 incorrecta</h2>";
        input1 = document.getElementById('respuesta1').style.display = 'none';
        input2 = document.getElementById('respuesta2').style.display = 'none';
        input3 = document.getElementById('respuesta3').style.display = 'none';
    }
    else {
        console.log("Respuesta 2 correcta");
        puntuacion += "<img src='img/tick.png' alt=''><h2> Respuesta 2 correcta</h2>";
        input1 = document.getElementById('respuesta1').style.display = 'none';
        input2 = document.getElementById('respuesta2').style.display = 'none';
        input3 = document.getElementById('respuesta3').style.display = 'none';
    }
    validarHabilidad(input3);
}

function validarHabilidad(respuesta) {
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokedex[2] + "/")
        .then(res => res.json())
        .then(res => {
            res.abilities;
            //console.log(res.abilities)
            validarPregunta3(respuesta, res.abilities);
        })
}

function validarPregunta3(respuesta, habilidad) {
    for (let i = 0; i < habilidad.length; i++) {
        //console.log(habilidad[i].ability.name)
        if (habilidad[i].ability.name == respuesta) {
            pregunta3Correcta = true;
        }
    }
    if (pregunta3Correcta === false) {
        console.log("Respuesta 3 incorrecta");
        puntuacion += "<img src='img/cruz.png' alt=''><h2> Respuesta 3 incorrecta</h2>";
        input1 = document.getElementById('respuesta1').style.display = 'none';
        input2 = document.getElementById('respuesta2').style.display = 'none';
        input3 = document.getElementById('respuesta3').style.display = 'none';
    }
    else {
        console.log("Respuesta 3 correcta");
        puntuacion += "<img src='img/tick.png' alt=''><h2>Respuesta 3 correcta</h2>";
        input1 = document.getElementById('respuesta1').style.display = 'none';
        input2 = document.getElementById('respuesta2').style.display = 'none';
        input3 = document.getElementById('respuesta3').style.display = 'none';
    }
    imprimirResultados();
}

function imprimirResultados() {
    formulario.innerHTML = puntuacion;
    document.getElementById('resultado').style.display = "block";
}