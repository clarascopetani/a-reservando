var precioTotal
var cantidadPersonas
var diaDate
var horaADate
var reserva

var Aplicacion = function(listado) {
        this.listado = listado;
        this.dibujarListado(listado.restaurantes)
        this.dibujarFiltros();
        this.registrarEventos();
    }
    //Esta función le asigna al botón "Buscar" la función filtrarRestaurantes()
Aplicacion.prototype.registrarEventos = function() {
    $(".buscar").click(this.filtrarRestaurantes.bind(this));
}

//Esta función llama a las funciones que se encargan de cargar las opciones de los filtros
Aplicacion.prototype.dibujarFiltros = function() {
    this.dibujarHorarios();
    this.dibujarRubros();
    this.dibujarCiudades();
}

//Función que se encarga de dibujar todos los restaurantes que recibe por parámetro. Cuando hablamos de dibujar, nos referimos a crear
//los elementos HTML que permiten visualizar el restaurante.
Aplicacion.prototype.dibujarListado = function(restaurantes) {
    var self = this;
    //Se borra el contenedor de restaurantes
    $(".flex").empty();
    var elementos = [];

    //Si no se recibe ningún restaurante por parámetro (porque los filtros aplicados no retornaron ningún resultado) se crea un elemento
    //que va a mostrar en el HTML el mensaje de "No se encontraron resultados".
    if (restaurantes.length === 0) {
        elementos.push($("<span/>").attr("class", "alerta").html("No se encontraron resultados"));
    } else {
        //Por cada erestaurante, se ejecuta la función crearTarjetaDeRestaurante()
        restaurantes.forEach(function(restaurant) {
            elementos.push(self.crearTarjetaDeRestaurante(restaurant));
        });
    }

    //Se agrega cada elemento al contenedor de restaurantes.
    elementos.forEach(function(elemento) {
        elemento.appendTo(".flex");
    })
}

//Función que se encarga de crear todos los elementos HTML necesarios para poder visualizar un restaurant
Aplicacion.prototype.crearTarjetaDeRestaurante = function(restaurant) {
    var self = this;
    // Creamos el elemento de restaurante, asignandole cada atributo del restaurant que corresponda
    var card = $(`
    <div class="flex-item" id=${restaurant.id}>
        <img class="imagen" src="${restaurant.imagen}">
        <div class="informacion">
            <div class="nombre-puntuacion-container">
                <h4 class="nombre">${restaurant.nombre}</h4>
                <div class="puntuacion-container">
                    <span class="puntuacion">${restaurant.obtenerPuntuacion()}</span>
                </div>
            </div>
            <div class="informacion-container">
                <span><i class="fas fa-map-marker-alt"></i></span>
                <span class="ubicacion">${restaurant.ubicacion}</span>
                <span><i class="fas fa-utensils"></i></span>
                <span class="rubro">${restaurant.rubro}</span>
                <span><i class="fas fa-dollar-sign"></i></span>
                <span class="precio">${restaurant.precio}</span>
            </div>
        </div>
        <div class="reservas">
            <span class="reserva">¡Reserva tu lugar!</span>
            <div class="horarios-container">
            </div>
        </div>
    </div>
    `);
    
    //Buscamos el elemento que se corresponde con la puntuación y le registramos al evento click, la funcionalidad de calificar un restaurant
    card.find(".puntuacion").click(function() {
        self.calificarRestaurant(restaurant);
    });
    
    //Buscamos el contendor donde se van a cargar los horarios
    var contenedorHorarios = card.find(".horarios-container");

    //Por cada horario de un restaurant, creamos el elemento HTML que va a mostrarlo. Además le asignamos la funcionalidad de reservar un restaurant.
    restaurant.horarios.sort().forEach(function(horario) {
        var nuevoHorario = $("<span/>").attr("class", "horario").html(horario);
        nuevoHorario.click(function() {
            self.reservarUnHorario(restaurant, horario);
        })
        nuevoHorario.appendTo(contenedorHorarios);
    });
    return card;
}

//Esta función muestra la alerta para dar la posibilidad de calificar un restaurant. La alerta que se utilizó es de la biblioteca "SweetAlert".
//En el caso de que la calificación sea válida, se ejecuta la función de calificarRestaurant() del listado. Luego, se busca en el HTML el restaurant que
//se corresponde con el id que se está calificando y se le actualiza la puntuación
Aplicacion.prototype.calificarRestaurant = function(restaurant) {
    var self = this;
    //var calif;
        Swal.fire({
          title: "Ingrese su calificación (valor numérico entre 1 y 10) :",
          input: 'number',
          inputPlaceholder: '1 al 10',
          showCancelButton: true,
          inputValidator: (calif) => {
            return new Promise((resolve) => {
              if (calif >= 1 && calif <= 10 ) {
                var nuevaCalificacion = parseInt(calif);
                self.listado.calificarRestaurant(restaurant.id, nuevaCalificacion);
                var restaurantActualizar = $("#" + restaurant.id);
                restaurantActualizar.find(".puntuacion").html(restaurant.obtenerPuntuacion());
                resolve()
              } else {
                resolve('Ingrese una calificación válida')
              }
            })
          }
        })
}

//Esta función se encarga de enviarle un mensaje al listado para que reserve un horario de un determinado restaurant
Aplicacion.prototype.reservarUnHorario = function(restaurant, horario) {
    this.listado.reservarUnHorario(restaurant.id, horario)
    //Se obtiene elemento que se corresponde con el id del restaurante al que se va a reservar el horario
    var restaurantActualizar = $("#" + restaurant.id);
    //Se busca el elemento HTML que contiene el horario que se va a sacar
    var horarioASacar = restaurantActualizar.find("span:contains(" + horario + ")")
    //Se verifica si quedó algún horario disponible. En el caso de que no, se agrega el mensajde de "No hay mas horarios disponibles"
    var cantidadHorarios = restaurantActualizar.find(".horario").length;
    if (cantidadHorarios === 1) {
        restaurantActualizar.find(".reserva").html("No hay más mesas disponibles 😪")
    }

    Swal.mixin({
        input: 'text',
        confirmButtonText: 'Siguiente &rarr;',
        showCancelButton: true,
        reverseButtons: true,
        progressSteps: ['1', '2', '3'],
      }).queue([
        {
          title: 'Completá tu reserva!',
          input: false,
          html: '<div type="text" id="datepicker"></div>',
          onOpen: function() { 
            diaDate = $( "#datepicker" ).datepicker(
               {dateFormat: "m-d-yy" ,
               onSelect: function(dia){ 
                   diaDate = dia 
               }  
           });
         },
          preConfirm:(diaDate) => {
            if(undefine) {
                Swal.insertQueueStep({
                    type: 'error',
                    title: 'ingresa cantidad de personas',
                    input: 'number',
                  })
            } else {
                console.log(diaDate)
                }
            },
        },
        {   
            title: 'Cuantas personas son?',
            input: "number",
            inputValidator: (value) => {
                return new Promise((resolve) => {
                  if (value > 0 || value !== NaN ) {
                    var cantidadPersonas = parseInt(value)
                    resolve()
                  } else {
                    resolve('Ingrese una calificación válida')
                  }
                })
              }
        },
        {   
            title: 'Tenes un código de decuento?',
        }
      ]).then((result) => {
        if (result.value) {
            datosReserva = result.value
            //cantidadPersonas = parseInt(datosReserva[1]);
            var codigoDescuento = datosReserva[2];
            var diaReserva = new Date(moment().format(diaDate + "," + horario));
            reserva = new Reserva (diaReserva, cantidadPersonas,listado.buscarRestaurante(restaurant.id).precio, codigoDescuento)
            console.log(reserva)
            precioTotal = reserva.precioTotal()
        Swal.fire({
            title: 'Listo!',
            html: 'Tenes una reserva para: ' + cantidadPersonas + ' personas en  ' 
            + restaurant.nombre + " el " + diaDate + " a las " + horario
            + '. Precio total: ' + '$' + precioTotal,
            confirmButtonText: 'Perfecto!'
            })
            horarioASacar.remove();
        } else {
            resolve('Ingrese una calificación válida')
          }
      })
}

//Esta función se encarga de generar las opciones del filtro de las ciudades.
Aplicacion.prototype.dibujarCiudades = function() {
    $("#filtro-ciudad").empty();
    this.cargarOpcionDefault("filtro-ciudad", "Ciudad");
    this.cargarOpcionTodos("filtro-ciudad");

    this.listado.obtenerUbicacion().forEach(function(ciudad) {
        var nuevaOpcion = $("<option/>").text(ciudad).val(ciudad);
        nuevaOpcion.appendTo("#filtro-ciudad");
    });
}

//Esta función se encarga de generar las opciones del filtro de rubros.
Aplicacion.prototype.dibujarRubros = function() {
    $("#filtro-rubro").empty();
    this.cargarOpcionDefault("filtro-rubro", "Rubro");
    this.cargarOpcionTodos("filtro-rubro")

    this.listado.obtenerRubros().forEach(function(rubro) {
        var nuevaOpcion = $("<option/>").text(rubro).val(rubro);
        nuevaOpcion.appendTo("#filtro-rubro");
    });

}

//Esta función se encarga de generar las opciones del filtro de horarios.
Aplicacion.prototype.dibujarHorarios = function() {
    $("#filtro-horario").empty();
    this.cargarOpcionDefault("filtro-horario", "Horario");
    this.cargarOpcionTodos("filtro-horario")

    this.listado.obtenerHorarios().forEach(function(horario) {
        var nuevaOpcion = $("<option/>").text(horario).val(horario);
        nuevaOpcion.appendTo("#filtro-horario");
    });
}

//Función que crea la opción default de los filtros
Aplicacion.prototype.cargarOpcionDefault = function(idFiltro, defecto) {
    var opcionDefault = $("<option/>").text(defecto).val(0).prop("disabled", true).prop("selected", true);
    opcionDefault.appendTo("#" + idFiltro);
}

//Función que crea la opción "Todos" de los filtros
Aplicacion.prototype.cargarOpcionTodos = function(idFiltro) {
    var opcionTodos = $("<option/>").text("Todos").val(1);
    opcionTodos.appendTo("#" + idFiltro);
}

//Función que se encarga de pedirle al listado que filtre los restaurantes y de actualizar el HTML con los resultados de la búsqueda.
//Las opciones "Default" y "Todos" de los filtros, tienen como propiedad val un 1 y un 0. En el caso de que el la propiedad val de alguno
//de los filtros sea 0 o 1, se envía como filtro el valor null, para que el listado sepa que no tiene que filtrar por ese campo.
Aplicacion.prototype.filtrarRestaurantes = function() {
    if ($("#filtro-rubro option:selected").val() === "1" || $("#filtro-rubro option:selected").val() === "0") {
        var filtroRubro = null;
    } else {
        var filtroRubro = $("#filtro-rubro option:selected").val();
    }

    if ($("#filtro-ciudad option:selected").val() === "1" || $("#filtro-ciudad option:selected").val() === "0") {
        var filtroCiudad = null;
    } else {
        var filtroCiudad = $("#filtro-ciudad option:selected").val();
    }

    if ($("#filtro-horario option:selected").val() === "1" || $("#filtro-horario option:selected").val() === "0") {
        var filtroHorario = null;
    } else {
        var filtroHorario = $("#filtro-horario option:selected").val();
    }

    var restaurantesFiltrados = this.listado.obtenerRestaurantes(filtroRubro, filtroCiudad, filtroHorario);
    this.dibujarListado(restaurantesFiltrados);
}

var aplicacion = new Aplicacion(listado);