var expect = chai.expect;

// Test Reservar Horario
describe('Test de reservar horario', function(){
        let resto;
        
        beforeEach(function() {
        resto = new Restaurant(1, "TAO Uptown", "Asiática", "Nueva York", ["13:00", "15:30", "18:00"], "../img/asiatica1.jpg", [6, 7, 9, 10, 5])
        arrayOriginal = resto.horarios;
        })

        it('Elimina un horario del array', function(){
                resto.reservarHorario("13:00");
                expect(resto.horarios).to.be.an('array').that.does.not.include("13:00");
                expect(resto.horarios).to.be.an('array').to.equal(arrayOriginal);
        })
        
        it('El array queda con un elemento menos', function(){
                var arrayLenght = arrayOriginal.length;
                resto.reservarHorario("13:00");
                expect(resto.horarios.length).to.eql(--arrayLenght);
        })
        it('Horario invalido no modifica el array', function(){ 
                resto.reservarHorario("12:00");
                expect(resto.horarios).to.equal(arrayOriginal);
        })
        it('Horario vacio no modifica el array', function(){ 
                resto.reservarHorario();
                expect(resto.horarios).to.equal(arrayOriginal);
        })
        
});


// Test Obtener Puntuación
describe('Test de Obtener Puntuacion', function(){

        it('Chequeo que el promedio sea correcto', function(){
                resto = new Restaurant(1, "TAO Uptown", "Asiática", "Nueva York", ["13:00", "15:30", "18:00"], "../img/asiatica1.jpg", [1, 1, 1, 1, 1])
                expect(resto.obtenerPuntuacion()).to.eql(1)
        })

        it('Promedio 0', function(){
                resto = new Restaurant(1, "TAO Uptown", "Asiática", "Nueva York", ["13:00", "15:30", "18:00"], "../img/asiatica1.jpg", [])
                expect(resto.obtenerPuntuacion()).to.eql(0)
        })
});

// Test Calificar Restaurant
describe('Test de Calificar Resto', function(){
        beforeEach(function() {
        resto = new Restaurant(1, "TAO Uptown", "Asiática", "Nueva York", ["13:00", "15:30", "18:00"], "../img/asiatica1.jpg", [10,1])
        calificacionOriginal = resto.calificaciones;
        })

        it('Calificación positiva', function(){
                resto.calificar(2)
                ultimaCalificacion = resto.calificaciones[resto.calificaciones.length -1]
                expect(resto.obtenerPuntuacion()).to.eql(4.3)
                expect(ultimaCalificacion).to.eql(2)
        })

        it('Calificación minima con 0', function(){
                resto.calificar(0)
                expect(resto.obtenerPuntuacion()).to.eql(3.7)
                expect(calificacionOriginal).to.eql(resto.calificaciones)
        })

        it('Calificación máxima con 10', function(){
                resto.calificar(10)
                ultimaCalificacion = resto.calificaciones[resto.calificaciones.length -1]
                expect(ultimaCalificacion).to.eql(10)
                expect(resto.obtenerPuntuacion()).to.eql(7)
        })

        it('Calificación negativa (no modifica)', function(){
                resto.calificar(-5)
                expect(resto.obtenerPuntuacion()).to.eql(5.5)
                expect(calificacionOriginal).to.eql(resto.calificaciones)
        })

        it('Calificación invalida 12 (no modifica)', function(){
                resto.calificar(12)
                ultimaCalificacion = resto.calificaciones[resto.calificaciones.length -1]
                expect(ultimaCalificacion).to.eql(1)
                expect(resto.obtenerPuntuacion()).to.eql(5.5)
        })

        it('Calificación con string (no modifica)', function(){
                resto.calificar('string')
                ultimaCalificacion = resto.calificaciones[resto.calificaciones.length -1]
                expect(ultimaCalificacion).to.eql(1)
                expect(resto.obtenerPuntuacion()).to.eql(5.5)
        })
        it('Calificación vacía (no modifica)', function(){
                resto.calificar()
                ultimaCalificacion = resto.calificaciones[resto.calificaciones.length -1]
                expect(ultimaCalificacion).to.eql(1)
                expect(resto.obtenerPuntuacion()).to.eql(5.5)
        })


})


// Test Buscar Restaurante ID buscarRestaurante(id)
describe('Test de Buscar Resto por ID', function(){
        let resto1 = new Restaurant(1, "Chez Moi", "Ensalada", "París", ["11:00", "12:00", "14:30"], "../img/ensalada1.jpg", [8, 4, 5, 5, 5, 5]);
        let resto2 = new Restaurant(2, "Maison Kayser", "Desayuno", "Nueva York", ["21:00", "22:30", "15:00"], "../img/desayuno2.jpg", [9, 5, 7, 6, 7]);
        let listadotest;
        beforeEach(function() {
                listadotest = new Listado([resto1,resto2]) 
        })
        it('Busca Resto ID 1', function(){
                expect(listadotest.buscarRestaurante(1)).to.equal(resto1)
        })
        it('Busca Resto ID 2', function(){
                expect(listadotest.buscarRestaurante(2)).to.equal(resto2)
        })
        it('Busca Resto ID inválido', function(){
                expect(listadotest.buscarRestaurante(3)).to.equal("No se ha encontrado ningún restaurant")
        })
})

// Test Obtener Restaurante listado.obtenerRestaurantes('Pizza', null, null)
describe('Test de Buscar Obtener Restaurante', function(){
        let restoRubro = new Restaurant(1, "Resto 1", "Rubrotest", "París", ["11:00", "RubroHora", "14:30"], "../img/ensalada1.jpg", [8, 4, 5, 5, 5, 5]);
        let restoCiudad = new Restaurant(2, "Resto 2", "Desayuno", "RubroCiudad", ["21:00", "22:30", "RubroHora"], "../img/desayuno2.jpg", [9, 5, 7, 6, 7]);
        let restoHorario =  new Restaurant(3, "Resto 3", "Rubrotest", "Berlín", ["RubroHora", "19:00", "20:30"], "../img/ensalada2.jpg", [8, 3, 2, 1, 8, 7]);
        let listadoTesting = new Listado(listadoDeRestaurantes)
        listadoTesting.restaurantes.push(restoRubro,restoCiudad,restoHorario)

        it('Busca Resto por Rubro', function(){
                newlistado = listadoTesting.obtenerRestaurantes('Rubrotest', null, null)
                expect(newlistado.length).to.eql(2);
                expect(newlistado).to.eql([restoRubro,restoHorario]);
        })


        it('Busca Resto por Ciudad', function(){
                newlistado = listadoTesting.obtenerRestaurantes(null, 'RubroCiudad', null)
                expect(newlistado.length).to.eql(1);
                expect(newlistado).to.eql([restoCiudad]);
        })

        it('Busca Resto por Hora', function(){
                newlistado = listadoTesting.obtenerRestaurantes(null, null, 'RubroHora')
                expect(newlistado.length).to.eql(3);
                expect(newlistado).to.eql([restoRubro,restoCiudad,restoHorario]);
        })

        it('Busca Resto por Rubro y Hora', function(){
                newlistado = listadoTesting.obtenerRestaurantes('Rubrotest', null, 'RubroHora')
                expect(newlistado.length).to.eql(2);
                expect(newlistado).to.eql([restoRubro,restoHorario]);
        })
})
