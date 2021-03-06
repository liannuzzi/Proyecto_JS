// Declaración Variables

let tipoCarroceria='';
let descripcionCarroceria='';
let cantidadDias=0;
let precioTotal=0;
let chequeoPasajeros=0;
let chequeoCarroceria=0;
let chequeoFechaRet=0;
let chequeoFechaDev=0
let CatalogoAutos='';
const nombreUsuarioStorage = localStorage.getItem('nombreUsuario');


// Arrays
const tiposCarroceria=[];

// Clases

class Carrocerias{
    constructor(id,tipo,imagen){
        this.id=id;
        this.tipo=tipo;
        this.imagen=imagen;
    }
}

tiposCarroceria.push(
    {id:1,tipo:'Hatchback'},
    {id:2,tipo:'Sedan'},
    {id:3,tipo:'Van'},
    {id:4,tipo:'Pick-Up'}
);

// Fetch sobre el json con catalogo de autos
// Recorre capacidades de los autos y devuelve el valor maximo en cuanto a pasajeros.

function fetchCatalogo(){
    fetch('catalogoAutos.json')
    .then(respuesta=>respuesta.json())
    .then(datos=>{
        CatalogoAutos=datos;
        const capacidadAutos = CatalogoAutos.map((el) => el.capacidad)
        mayorCapacidad=Math.max.apply(Math,capacidadAutos);
    })
}

fetchCatalogo();


document.getElementById('formBienvenida').style.display='none';
const btnConfirmar=document.getElementById('btnConfirmar');
btnConfirmar.style.display="none"
const formCarga=document.getElementById('formCarga');
formCarga.style.display='none';

// verifica si ya se ingresó previamente un nombre
informacionNombre();

// Ingresa nombre del usuario, oculta primer form y habilita form de carga. Customiza el legend segun nombre ingresado.

let inputNombre=document.getElementById('inputNombre');
btnConfirmar.disabled=true;
inputNombre.oninput = ()=>{
    inputNombre.value === ""? btnConfirmar.disabled=true:btnConfirmar.disabled=false;
}

// Evento on click sobre botón confirmar del form de bievenida
btnConfirmar.onclick = (e) =>{
    e.preventDefault();
    let inputNombre=document.getElementById('inputNombre');
    localStorage.setItem('nombreUsuario',inputNombre.value);
    btnConfirmar.style.display="none"
    document.getElementById('formBienvenida').style.display='none';
    let formCarga= document.getElementById('formCarga');
    formCarga.style.display='block';

    let legendBienvenida=document.createElement('legend');
    legendBienvenida.innerHTML=`Hola ${inputNombre.value}, alquilá tu auto al mejor precio!`;
    document.getElementById('fieldsetFormCarga').insertAdjacentElement('afterbegin',legendBienvenida);    
}

// Recorre arrays de tipo de carrocería para completar el desplegable
tiposCarroceria.forEach(element => {
    let carroceria=document.createElement('option');
    carroceria.innerHTML=element.tipo;
    document.getElementById('tipoCarroceria').insertAdjacentElement('beforeend',carroceria);  
});

// Inhabilita boton de busqueda hasta que las validaciones esten OK
const btnBuscar=document.getElementById('btnBuscar');
btnBuscar.disabled=true;

// Validación input cantidad de pasajeros. Lanza mensaje debajo del input en caso que haya datos que modificar.

const inputPasajeros=document.getElementById('cantidadPasajeros');
inputPasajeros.oninput = () =>{
    if (inputPasajeros.value==='' || inputPasajeros.value=='0'){
        let containerPasajeros=document.getElementById('containerPasajeros')
        while(containerPasajeros.lastChild.nodeName=='P'){
            containerPasajeros.removeChild(containerPasajeros.lastChild);
        }
        let errorCantidad= document.createElement('p');
        errorCantidad.className='warning';
        errorCantidad.innerHTML='Por favor, ingrese un valor válido';
        document.getElementById('containerPasajeros').insertAdjacentElement('beforeend',errorCantidad);
        chequeoPasajeros=0;
        controlCampos();
    }else if (inputPasajeros.value > mayorCapacidad){
        let containerPasajeros=document.getElementById('containerPasajeros')
        while(containerPasajeros.lastChild.nodeName=='P'){
            containerPasajeros.removeChild(containerPasajeros.lastChild);
        }
        let errorCantidad= document.createElement('p');
        errorCantidad.className='warning';
        errorCantidad.innerHTML=`Lamentablemente no disponemos de vehículos para ${inputPasajeros.value} pasajeros, ingrese una nueva capacidad`;
        document.getElementById('containerPasajeros').insertAdjacentElement('beforeend',errorCantidad);
        chequeoPasajeros=0;
        controlCampos();
    }else{
        let containerPasajeros=document.getElementById('containerPasajeros')
        while(containerPasajeros.lastChild.nodeName=='P'){
            containerPasajeros.removeChild(containerPasajeros.lastChild);
        }
        chequeoPasajeros=1;
        controlCampos();
    }
}


// Validación input tipo de carrocería
const inputTipoCarroceria=document.getElementById('tipoCarroceria');
const carroceriaPorDefecto=document.getElementById('carroceriaPorDefecto');

inputTipoCarroceria.onchange = () => {
    if(inputTipoCarroceria.value == carroceriaPorDefecto.value){
        while(containerCarroceria.lastChild.nodeName =='P'){
            containerCarroceria.removeChild(containerCarroceria.lastChild);
        }
        let errorCarroceria=document.createElement('p');
        errorCarroceria.className='warning';
        errorCarroceria.innerHTML='Por favor, seleccione una carrocería';
        document.getElementById('containerCarroceria').insertAdjacentElement('beforeend',errorCarroceria);
        chequeoCarroceria=0;
        controlCampos();
    }else{
        while(containerCarroceria.lastChild.nodeName =='P'){
            containerCarroceria.removeChild(containerCarroceria.lastChild);
        }
        chequeoCarroceria=1;
        controlCampos();
    }
}


// Validación fechas

const inputFechaRetiro=document.getElementById('fechaRetiro');
let sysdate=new Date();
const inputfechaDevolucion=document.getElementById('fechaDevolucion');
inputFechaRetiro.setAttribute('min',sysdate.toISOString().split('T')[0]);


    // FECHA RETIRO
inputFechaRetiro.oninput = () =>{

    document.getElementById('fechaDevolucion').setAttribute('MIN',inputFechaRetiro.value);
    if((inputFechaRetiro.value>=inputfechaDevolucion.value) && inputfechaDevolucion.value != ''){
        while(containerFechaRetiro.lastChild.nodeName =='P'){
            containerFechaRetiro.removeChild(containerFechaRetiro.lastChild);
        }
        let errorFechaRet=document.createElement('p');
        errorFechaRet.className='warning';
        errorFechaRet.innerHTML='Fecha retiro no puede ser posterior o igual a fecha devolución';
        document.getElementById('containerFechaRetiro').insertAdjacentElement('beforeend',errorFechaRet);
        chequeoFechaRet=0;
        controlCampos();
    }else{
        while(containerFechaRetiro.lastChild.nodeName =='P'){
            containerFechaRetiro.removeChild(containerFechaRetiro.lastChild);
        }
        chequeoFechaRet=1;
        controlCampos();
    }
}

    //  FECHA DEVOLUCIÓN

inputfechaDevolucion.oninput = () =>{
    document.getElementById('fechaRetiro').setAttribute('MAX',inputfechaDevolucion.value);
    if((inputfechaDevolucion.value<=inputFechaRetiro.value) && inputfechaDevolucion.value != ''){
        while(containerFechaDevolucion.lastChild.nodeName =='P'){
            containerFechaDevolucion.removeChild(containerFechaDevolucion.lastChild);
        }
        let errorFechaDev=document.createElement('p');
        errorFechaDev.className='warning';
        errorFechaDev.innerHTML='Fecha devolución no puede ser anterior o igual a fecha de retiro';
        document.getElementById('containerFechaDevolucion').insertAdjacentElement('beforeend',errorFechaDev);
        chequeoFechaDev=0;
        controlCampos();
    }else{
        while(containerFechaDevolucion.lastChild.nodeName =='P'){
            containerFechaDevolucion.removeChild(containerFechaDevolucion.lastChild);
    }
    chequeoFechaDev=1;
    controlCampos();
}

}

// Evento on click sobre botón Buscar vehiculo

btnBuscar.onclick = (e) =>{
    e.preventDefault();

    // Mapeo campos del form contra variables
    let cantidadPasajeros=document.getElementById('cantidadPasajeros');
    cantidadPasajeros=cantidadPasajeros.value;
    tipoCarroceria=document.getElementById('tipoCarroceria');
    tipoCarroceria=tipoCarroceria.value;

    // Calculo de fecha devolución-fecha de retiro  
    let fechaRetiro=document.getElementById('fechaRetiro');
    fechaRetiro=new Date(fechaRetiro.value).getTime();
    let fechaDevolucion=document.getElementById('fechaDevolucion');
    fechaDevolucion=new Date(fechaDevolucion.value).getTime();
    cantidadDias=(fechaDevolucion-fechaRetiro)/(1000*60*60*24);

    // Guardar en local storage datos del form
    localStorage.setItem('pasajeros',inputPasajeros.value);
    localStorage.setItem('tipoCarroceria',inputTipoCarroceria.value);
    localStorage.setItem('fechaRetiro',inputFechaRetiro.value);
    localStorage.setItem('fechaDevolucion',inputfechaDevolucion.value);
    localStorage.setItem('cantidadDias',cantidadDias);
  

// En base a cantidad de pasajeros y tipo carrocería devuelve mejor opcion
const mejorOpcion=(CatalogoAutos.filter(elemento=>elemento.capacidad>=cantidadPasajeros && elemento.carroceria==tipoCarroceria));
localStorage.setItem('resultadosBusqueda',JSON.stringify(mejorOpcion));


    // Redirreción a pagina Catalogo
    location.href='catalogo.html';  
}



//                          FUNCIONES


// En caso que se haya ingresado un nombre previamente, muestra directametne el form de carga. De otro modo, muestra el form de bienvenida
function informacionNombre(){
    if (nombreUsuarioStorage && nombreUsuarioStorage !== 'null'){
        let formCarga= document.getElementById('formCarga');
        formCarga.style.display='block';
        let legendBienvenida=document.createElement('legend');
        legendBienvenida.innerHTML=`Hola ${nombreUsuarioStorage}, alquilá tu auto al mejor precio`;
        document.getElementById('fieldsetFormCarga').insertAdjacentElement('afterbegin',legendBienvenida);
    }else{
        document.getElementById('formBienvenida').style.display='block';
        btnConfirmar.style.display="block";
    }

}

// Controla los campos del formulario para saber que esten OK y habilitar botón de buscar
function controlCampos (){
    if (chequeoPasajeros==1 && chequeoCarroceria==1 && chequeoFechaRet==1 && chequeoFechaDev==1){
    btnBuscar.disabled=false;
    }else{
        btnBuscar.disabled=true;
    }
}