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
    console.log(precioFinal)
    return precioFinal
}

// Descuento por cantidad de personas
function descuentoPersonas(precioBase, personas){
    var descuentoTotal = 0;

    if (personas >= 4 && personas <= 6) {
        console.log('entro en descuento persona 4/6')
        descuentoTotal = Math.floor(precioBase*5)/100;
    }
    if (personas >= 7 && personas <= 8) {
        console.log('entro en descuento persona 7/8')
        descuentoTotal  = Math.floor(precioBase*10)/100;
    }
    if (personas > 8) {
        console.log('entro en descuento persona +8')
        descuentoTotal  = Math.floor(precioBase*15)/100;
    }
    return descuentoTotal;
}

// Descuento por Codigo
function descuentoCodigo(precio, codigo, precioBase){
    switch(codigo){
        case 'DES15':
            console.log('entro en descuento DES15')
            precio = precioBase*15/100
            break;
        case 'DES200':
            console.log('entro en descuento DES200')
            precio = 200
            break;
        case 'DES1':
            console.log('entro en descuento DES1')
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
        console.log('entro en adicional hora 5%')
        adicionalHora = precio*5/100;
    }
    if (dia == 0 || dia >= 5) {
        console.log('entro en adicional dia 10%')
        adicionalDia = precio*10/100;
    }
    return adicionalHora + adicionalDia;
}