var Restaurant = function(id, nombre, rubro, ubicacion, horarios, imagen, calificaciones, precio) {
    this.id = id;
    this.nombre = nombre;
    this.rubro = rubro;
    this.ubicacion = ubicacion;
    this.horarios = horarios;
    this.imagen = imagen;
    this.calificaciones = calificaciones;
    this.precio = precio;
}

Restaurant.prototype.reservarHorario = function(horarioReservado) {
    var horarioFiltrado =  this.horarios.filter((horariosDisponibles) => (horariosDisponibles !== horarioReservado))
    this.horarios = horarioFiltrado
    return horarioFiltrado
}

Restaurant.prototype.calificar = function(nuevaCalificacion) {
    if (Number.isInteger(nuevaCalificacion) && nuevaCalificacion >= 0 && nuevaCalificacion <= 10) {
        this.calificaciones.push(nuevaCalificacion);
    }
}

Restaurant.prototype.obtenerPuntuacion = function() {
    if (this.calificaciones.length === 0) {
        return 0;
    } else {
        var sumaArray = this.sumatoria(this.calificaciones);
        var calificacion = this.promedio(sumaArray, this.calificaciones)
        return calificacion
    }
}


Restaurant.prototype.sumatoria = function(arr){
    var sumatoria = 0;
    for (var i = 0; i < arr.length; i++) {
        sumatoria += arr[i]
    }
    return sumatoria
}

Restaurant.prototype.promedio = function(suma, calificaciones){
    var promedio = suma / calificaciones.length;
    return Math.round(promedio * 10) / 10;
}