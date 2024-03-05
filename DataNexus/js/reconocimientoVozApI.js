const busquedaVoz = document.getElementById('busquedaVoz');
const inputBusqueda = document.getElementById('valorBusqueda'); //Boton del microfono

//Booleano igualado a true desde el principio para trabajar con el
let vozActivada = true;

//Método para activar la capacidad para el reconocimiento de voz
const recognition = new webkitSpeechRecognition();

//Especificar que el reconocimineto sea continuo igualando a true
recognition.continuous = true;

//Se especifican los idiomas en los que se quiere el reconocimineto por voz
recognition.lang = 'es-ES', 'en-EN';

//Especificar que lo que se registre por voz se imprima en html
recognition.interimResult = true;

//Si se hace click en el boton se llama a la funcion empezarBusqueda()
busquedaVoz.addEventListener('click', empezarBusqueda);

function empezarBusqueda(){
    //Al principio, como ya esta el boolean a true, entra en el primer condicional
    if(vozActivada == true){
        //Método para activar el reconocimiento de voz
        startVoz();
        //Igualar la funcion a false
        vozActivada = false;
    }
    //Si se pulsa el boton y el boolean está en false
    else{
        //Parar el reconocimiento
        stopVoz();
        //Igualar el boolean a true
        vozActivada = true;
    }
}
//Función que empieza el reconocimiento de voz
function startVoz(){
    console.log("start");
    //Método en específico que da la capacidad de empezar reconocer la voz
    recognition.start();
}

function stopVoz(){
    console.log("stop");
    //Método en específico que da la capacidad de terminar reconocer la voz
    recognition.stop();
}

recognition.onresult = (event) => {
    //Combierte lo que ha recogido el reconocimiento por voz a texto
    let texto = event.results[event.results.length - 1][0].transcript;
    //Replazar espacios en blanco por guiones
    texto = texto.replace(" ", "-");
    //Conbertir los caracteres raros como la 'ñ' en codigo entendible
    texto = texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
    inputBusqueda.value = texto;
    //Llamar la funcion leerTexto() y le pasamos el atributo texto
    leerTexto(texto);
}

function leerTexto(text) {
    //Hacemos una constante que se iguala a una funcion de lectura
    const speech = new SpeechSynthesisUtterance(text);
    //Se especifica los atributos del audio
    speech.volume = 1;
    speech.rate = 0.5;
    speech.pitch = 0.4;
    speech.lang = 'es-ES'
    //Mediante este método, la API pasa el texto escrito a voz
    //La primera parte permite el acceso a la interfaz
    //El '.speak()' inicia el proceso de lectura
    window.speechSynthesis.speak(speech);
}