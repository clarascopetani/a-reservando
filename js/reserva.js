var Reserva = function(horarioReserva, cantPersonas, precio, codigoDescuento) {
    this.horarioReserva = horarioReserva;
    this.cantPersonas = cantPersonas;
    this.precio = precio;
    this.codigoDescuento = codigoDescuento;
}

Reserva.prototype.precioBase = function() {
    const precioBase = this.precio * this.cantPersonas
    return precioBase
}

Reserva.prototype.precioTotal = function() {
    const precioBase = this.precioBase()
    let precioFinal = precioBase + adicionales(this.precio, this.horarioReserva) - (descuentoPersonas(this.precio, this.cantPersonas) + descuentoCodigo(this.precio, this.codigoDescuento, precioBase));
    return precioFinal
}

// Descuento por cantidad de personas
function descuentoPersonas(precio, personas){
    var descuentoTotal = 0;

    if (personas >= 4 && personas <= 6) {
        descuentoTotal = precio*5;
    }
    if (personas >= 7 && personas <= 8) {
        descuentoTotal  = precio*10;
        
    }
    if (personas > 8) {
        descuentoTotal  = precio*15;
    }
    console.log('descuento personas', descuentoTotal / 100)
    return descuentoTotal / 100;
}

// Descuento por Codigo
function descuentoCodigo(precio, codigo, precioBase){
    switch(codigo){
        case 'DES15':
            precio = precioBase*15/100
            break;
        case 'DES200':
            precio = 200
            break;
        case 'DES1':
            precio = precio
            break;
        default:
            precio = 0;
    }
    return precio
}

// Adicionales
function adicionales(precio, horario){
    var dia = horario.getDay()
    var hora = horario.getHours()
    var adicionalHora = 0;
    var adicionalDia = 0;

    if (hora >= 13 && hora <= 14 || hora >= 20 && hora <= 21) {
        adicionalHora = precio*5/100;
    }
    
    if (dia >= 5 && dia <= 7) {
        adicionalDia = precio*10/100;
    }
    return adicionalHora + adicionalDia;

}