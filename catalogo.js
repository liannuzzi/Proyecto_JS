const resultadosBusqueda=JSON.parse(localStorage.getItem('resultadosBusqueda'));
let cantidadPasajeros=localStorage.getItem('pasajeros');
let tipoCarroceria=localStorage.getItem('tipoCarroceria');
let fechaRetiro=localStorage.getItem('fechaRetiro');
let fechaDevolucion=localStorage.getItem('fechaDevolucion');
let totalDias=localStorage.getItem('cantidadDias');
let precioTotal=0;
let chequeoPasajeros=1;
let chequeoCarroceria=1;
let chequeoFechaRet=1;
let chequeoFechaDev=1;
let CatalogoAutos='';

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
    {id:1,tipo:'Hatchback',imagen:'images\carrocerias\hatchback.png'},
    {id:2,tipo:'Sedan',imagen:'images\carrocerias\sedan.png'},
    {id:3,tipo:'Van',imagen:'images\carrocerias\van.png'},
    {id:4,tipo:'Pick-Up',imagen:'images\carrocerias\pickup.png'}
);

// Recorre arrays de tipo de carrocería para completar el desplegable
tiposCarroceria.forEach(element => {
    let carroceria=document.createElement('option');
    carroceria.innerHTML=element.tipo;
    document.getElementById('tipoCarroceria').insertAdjacentElement('beforeend',carroceria);  
});

// Completa form con los valores ingresados anteriormente

document.getElementById('cantidadPasajeros').setAttribute('value',cantidadPasajeros);
document.getElementById('fechaRetiro').setAttribute('value',fechaRetiro)
document.getElementById('fechaDevolucion').setAttribute('value',fechaDevolucion)

let select=document.getElementById('tipoCarroceria')
let option;

for (var i=0; i<select.options.length; i++) {
    option = select.options[i];
  
    if (option.value == tipoCarroceria) {
       option.setAttribute('selected', true); 
    } 
  }


// Chequea si el array viene vacío para indicar que no existen resultados para los parametros ingresados, sino avanza al calculo del precio.

if (resultadosBusqueda.length==0){
    Swal.fire({
        title: '<strong>Oopss...</strong>',
        icon: 'error',
        html:
        `Disculpe, no disponemos de vehículos para ${cantidadPasajeros} pasajeros con carrocería ${tipoCarroceria} `,
        showCloseButton: true
      }).then((result)=>{
        if(result.isConfirmed){
          location.href='index.html';  
        }
    })
}else{
    // Muestra en pantalla el modelo sugerido, los días de alquiler y el precio. 
    const listado=document.getElementById('listado');
    while(listado.lastChild.nodeName=='li'){
        listado.removeChild(listado.lastChild);
    }

    for(const resultado of resultadosBusqueda){

    preciosSegmento(resultado,totalDias);

    let elemento=document.createElement('li');
    elemento.className='car-option';
    elemento.innerHTML=`
    <div class="col-md-4">
    <div class="imagen-producto">
        <img src="images/autos/${resultado.imagen}" alt="">
    </div>
    </div>
    <div class="col-md-4 car-info">
    <p class="car-name">${resultado.marca} ${resultado.modelo}</p>
    <p><strong>Capacidad:</strong> ${resultado.capacidad} personas</p>
    <p><strong>Carrocería:</strong> ${resultado.carroceria}
    <img src="images/carrocerias/${resultado.carroceria}.png" alt="">
    </p>
    </div>
    <div class='containerReserva col-md-4'>
        <p>Alquiler por <strong>${totalDias} días</strong></p>
        <p class="car-price">Total <strong>$${precioTotal}</strong></p>
        <button class='reservarAuto'>Quiero Reservar!</button>
    </div>`;
    listado.appendChild(elemento);
    }
    reservar();
}

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



const btnBuscar=document.getElementById('btnBuscarCatalogo');

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
    armarCatalogo(mejorOpcion);
    
}


// FUNCIONES

// Calcula el precio correspondiente al alquiler segun tipo de segmento y días de alquiler

function preciosSegmento(opcion,diasAlquiler){
    precioTotal = (opcion.precioMercado*0.002)*diasAlquiler ;
}



// Controla los campos del formulario para saber que esten OK y habilitar botón de buscar
function controlCampos (){
    if (chequeoPasajeros==1 && chequeoCarroceria==1 && chequeoFechaRet==1 && chequeoFechaDev==1){
    btnBuscar.disabled=false;
    }else{
        btnBuscar.disabled=true;
    }
}


function armarCatalogo(resultados){
    if (resultados.length==0){
        Swal.fire({
            title: '<strong>Oopss...</strong>',
            icon: 'error',
            html:
            `Disculpe, no disponemos de vehículos para ${inputPasajeros.value} pasajeros con carrocería ${tipoCarroceria} `,
            showCloseButton: true
          }).then((result)=>{
            if(result.isConfirmed){
              location.href='index.html';  
            }
        })
    }else{
        
        const listado=document.getElementById('listado');

        // elimina resultados en caso que haya
        while(listado.lastChild.nodeName=='LI'){
            listado.removeChild(listado.lastChild);
        }
        // Muestra en pantalla el modelo sugerido, los días de alquiler y el precio.
        for(const resultado of resultados){
    
        preciosSegmento(resultado,totalDias);
    
        let elemento=document.createElement('li');
        elemento.className='car-option';
        elemento.innerHTML=`
        <div class="col-md-4">
        <div class="imagen-producto">
            <img src="images/autos/${resultado.imagen}" alt="">
        </div>
        </div>
        <div class="col-md-4 car-info">
        <p class="car-name">${resultado.marca} ${resultado.modelo}</p>
        <p><strong>Capacidad:</strong> ${resultado.capacidad} personas</p>
        <p><strong>Carrocería:</strong> ${resultado.carroceria}
        <img src="images/carrocerias/${resultado.carroceria}.png" alt="">
        </p>
        </div>
        <div class='containerReserva col-md-4'>
            <p>Alquiler por <strong>${totalDias} días</strong></p>
            <p class="car-price">Total <strong>$${precioTotal}</strong></p>
            <button class='reservarAuto'>Quiero Reservar!</button>
        </div>`;
        listado.appendChild(elemento);
        }
        reservar();
    }
    
    }

function reservar(){
    const btnReserva=document.getElementsByClassName('reservarAuto');
    for (var i = 0; i < btnReserva.length; i++) {
        btnReserva[i].addEventListener("click", function (e) {
        e.preventDefault();
        ingresarMail(true);
    });
    }
}

    // Alerta solicitando el mail al usuario.

async function ingresarMail(result){
    if(result===true){
        const { value: email } = await Swal.fire({
            icon:'success',
            title: 'Reserva confirmada!',
            input: 'email',
            inputLabel: 'Le enviaremos la información de la reserva y los datos para avanzar con el pago.',
            inputPlaceholder: 'Ingrese su correo electrónico'
        })
        
        if (email) {
            Swal.fire({
                html:`Muchas gracias por su reserva! Enviamos el correo a la casilla: ${email}`
            }).then((result)=>{
                if(result.isConfirmed){
                    location.href='index.html';  
                }
            })
            
        }
        
    }
    
} 