// Declaración Variables

let usuario = prompt(`Ingrese su nombre por favor`);
let tipoCarroceria='';
let descripcionCarroceria='';
let cantidadDias=0;
let precioTotal=0;

// Array
const CatalogoAutos=[];

// Declaración Clases

class Autos{
    constructor(id,marca,modelo,puertas,capacidad,carroceria,precioMercado,segmento){
        this.id=id;
        this.marca=marca;
        this.modelo=modelo;
        this.puertas=puertas;
        this.capacidad=capacidad;
        this.carroceria=carroceria,
        this.precioMercado=precioMercado;
        this.segmento=segmento;
    }
}

// Carga de array
CatalogoAutos.push(
    {id:1,marca:'Volkswagen',modelo:'Up!',puertas:5,capacidad:5,carroceria:'Hatchback',precioMercado:1600000,segmento:'A'},
    {id:2,marca:'Toyota',modelo:'Etios',puertas:4,capacidad:5,carroceria:'Sedan',precioMercado:1900000,segmento:'B'},
    {id:3,marca:'Chevrolet',modelo:'Spin',puertas:5,capacidad:7,carroceria:'Van',precioMercado:2400000,segmento:'C'},
    );

//Funciones

// Controla tipo de carrocería ingresado

function controlCarroceria(carroceria){
switch(carroceria){
    case 1:
        descripcionCarroceria='Hatchback';
        alert(`La carrocería seleccionada es baúl pequeño`);
        break;
    case 2:
        descripcionCarroceria='Sedan';
        alert(`La carrocería seleccionada es baúl grande`);
        break;
    case 3:
        descripcionCarroceria='Van';
        alert(`La carrocería seleccionada es van`);
        break;
    default:
        alert(`Por favor, ingrese una carrocería valida`);
    }
}

// Calcula el precio correspondiente al alquiler segun tipo de segmento y días de alquiler

function preciosSegmento(opcion,diasAlquiler){
if(opcion[0].segmento=='A'){
    for(let i=1; i<=diasAlquiler;i++){
        precioTotal += (opcion[0].precioMercado*0.002) ;
    }
}else if(opcion[0].segmento=='B'){
    for(let i=1; i<=diasAlquiler;i++){
        precioTotal += (opcion[0].precioMercado*0.002);
    }
}else if(opcion[0].segmento=='C'){
    for(let i=1; i<=diasAlquiler;i++){
        precioTotal += (opcion[0].precioMercado*0.002);
    }
}
alert(`El valor total por ${diasAlquiler} días de alquiler de un vehículo segmento ${opcion[0].segmento} es de $${precioTotal}`);
}


// Recorre capacidades de los autos y devuelve el valor maximo.
const capacidadAutos = CatalogoAutos.map((el) => el.capacidad)
const mayorCapacidad=Math.max.apply(Math,capacidadAutos);

// Pregunta cantidad de pasajeros

let cantidadPasajeros=parseInt(prompt(`Hola ${usuario} por favor, indique el número de pasajeros que viajaran en el vehiculo`));


do{
    if(cantidadPasajeros == 0 || cantidadPasajeros==''){
        cantidadPasajeros=parseInt(prompt(`Por favor, ingrese una cantidad valida de pasajeros`));
    }else if (cantidadPasajeros>mayorCapacidad){
        cantidadPasajeros=parseInt(prompt(`Lamentablemente no disponemos de vehículos para ${cantidadPasajeros} pasajeros, ingrese una nueva capacidad`));
    }
    }while(cantidadPasajeros == 0 || cantidadPasajeros=='' || cantidadPasajeros >mayorCapacidad);

tipoCarroceria=parseInt(prompt(`La cantidad de pasajeros ingresada es ${cantidadPasajeros}. Ahora ingrese el número correspondiente al tipo de carrocería que desea: 1 - Baul pequeño, 2 - Baul Grande , 3 - Van`));
controlCarroceria(tipoCarroceria);


// En base a cantidad de pasajeros y tipo carrocería devuelve mejor opcion
const mejorOpcion=(CatalogoAutos.filter(elemento=>elemento.capacidad>=cantidadPasajeros && elemento.carroceria==descripcionCarroceria));

// Chequea si el array viene vacío para indicar que no existen resultados para los parametros ingresados, sino avanza al calculo del precio.

if (mejorOpcion.length==0){
    alert(`Disculpe, no disponemos de vehículos para ${cantidadPasajeros} pasajeros con carrocería ${descripcionCarroceria} `)
}else{
    cantidadDias=parseInt(prompt(`La mejor opción que tenemos disponible para ${cantidadPasajeros} pasajeros y un tipo de carrocería ${descripcionCarroceria} es un ${mejorOpcion[0].marca} ${mejorOpcion[0].modelo}. Por favor, ingrese la cantidad de días que alquilaría para que podamos armar un presupuesto`));
    preciosSegmento(mejorOpcion,cantidadDias);
}





