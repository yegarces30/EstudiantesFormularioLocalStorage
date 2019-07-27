
/*
  Esta parte del archivo contiene los métodos generales de la aplicación
*/

/*La función limpiarCampos permite poner los campos en los valores por defecto*/

function limpiarCampos(){
  $("#codigo").val("");
  $("#codigo").attr("disabled",false);
  $("#nombre").val("");
  $("#materia").val("Ciencias sociales");
  //$("#codigo").selectedIndex = "0";
  $("#nota").val("");
  $("#observaciones").val("");
  $('html,body').animate({scrollTop: 0}, 1000);
}

/*La función mostrarRegistro permite ver la información del registro seleccionado para modificarlo en el formulario.
Tiene como parámetro el campo codigo, el cual permite obtener la información en la cookie, convertirla en JSON y luego obtener
los valores del registro seleccionado*/
function mostrarRegistro(codigo){

  var estudiante = localStorage.getItem(codigo);
  objetoJson = JSON.parse(estudiante);
  $("#codigo").val(objetoJson.codigo);
  $("#codigo").attr("disabled",true);
  $("#nombre").val(objetoJson.nombre);
  $("#materia").val(objetoJson.materia);
  $("#nota").val(objetoJson.nota);
  $("#observaciones").val(objetoJson.observaciones);
  $('html,body').animate({scrollTop: 0}, 1000);
}

/*La función cargarPagina permite validar la existencia de la cookie y adicionar los eventos a los botones de las opcionrd principales*/
function cargarPagina(){
  listarEstudiantes();

  var btnGuardar        = document.getElementById("btnGuardar");
  btnGuardar.addEventListener("click",function(){guardar();});

  btnNuevo        = document.getElementById("btnNuevo");
  btnNuevo.addEventListener("click",limpiarCampos);

  btnOperaciones        = document.getElementById("btnOperaciones");
  btnOperaciones.addEventListener("click",obtenerOperaciones);

  btnMayor        = document.getElementById("btnMayor");
  btnMayor.addEventListener("click",function (){obtenerNota(1);});

  btnMenor        = document.getElementById("btnMenor");
  btnMenor.addEventListener("click",function (){obtenerNota(2);});
}

/*
La funcion jsonACadena Convierte el objeto JSON en cadena
*/
function jsonACadena(){
  var estudante = {
    "codigo" : $.trim($("#codigo").val()),
    "nombre" : $.trim($("#nombre").val()),
    "materia" : $.trim($("#materia").val()),
    "nota" : $.trim($("#nota").val()),
    "observaciones" : $.trim($("#observaciones").val())
  }
  return JSON.stringify(estudante);
}


/*La función guardar permite guardar un registro nuevo o modificar un registro ya creado*/

function guardar(){
  adicionarModificarEstudiante();
  listarEstudiantes();
}

/*******************************************************************************************/
/*Esta parte del archivo permite relizar las acciones de mostrar, crear, modificar y eliminar los registros ingresados*/



/*La funcion listarEstudiantes permite mostrar en una tabla a todos los registros de estudiantes que se encuentran
guardados en la cookie*/

function listarEstudiantes(){

  var sTabla ="<table id='listaEstudiantes' class='table table-striped table-bordered table-hover'><thead>"+
              "<tr><th scope='col'>#</th>"+
              "<th scope='col'>Cod</th>"+
              "<th scope='col'>Nombre</th>"+
              "<th scope='col'>Materia</th>"+
              "<th scope='col'>Nota</th>"+
              "<th scope='col'>Observaciones</th>"+
              "<th scope='col'>Modificar</th>"+
              "<th scope='col'>Eliminar</th>"+
              "</thead><tbody>";

  for (var i = 0; i < localStorage.length; i++) {
    var estudiante = localStorage[localStorage.key(i)]
    objetoJson = JSON.parse(estudiante);
    codigo = "'"+objetoJson.codigo + "'";

    sTabla += "<tr id='tr_"+objetoJson.codigo+"'><td>"+(i+1)+"</td><td>"+codigo+"</td>" +
              "<td>"+objetoJson.nombre+"</td>" +
              "<td>"+objetoJson.materia+"</td>"+
              "<td>"+objetoJson.nota+"</td>"+
              "<td>"+objetoJson.observaciones+"</td>"+
              "<td><button name='"+codigo+"' onclick=mostrarRegistro("+codigo+") "+
              "class='modificar btn btn-default btn-xs' >"+
              "<img  src='images/modificar.png' alt=''>  </img> </button></td>"+
              "<td><button name='"+codigo+"' onclick=eliminar("+codigo+") "+
              "class='eliminar btn btn-default btn-xs' >"+
              "<img  src='images/eliminar.png' alt=''>  </img> </button></td></tr>";
  }

  sTabla +=  "</tbody></table>";
  sTabla = "<h5>Listado de estudiantes</h5>" + sTabla ;

  $('#informacion1').html(sTabla);
}


/*La función adicionarEstudiante permite guardar un registro nuevo en la cookie*/

function adicionarModificarEstudiante(){

  var estudiante = jsonACadena();
  localStorage.setItem($("#codigo").val(),estudiante);
  alert("Nota del estudiante registrada con éxito.");
  limpiarCampos();
}

/*La función eliminar permite liminar el registro seleccionado
Tiene como parámetro la variable codigo, el cual contiene el codigo del registro a eliminar*/

function eliminar(codigo){

  var respuesta = confirm("¿Desea eliminar el registro seleccionado?");
  if (respuesta){
    localStorage.removeItem(codigo);
    limpiarCampos();
    listarEstudiantes();
  }
}

/********************************************************************************/

/*Eesta parte contiene las funciones que muestra las operaciones matemáticas realizadasa los registros*/

function obtenerOperaciones(){
  var sumatoria     = 0;
  promedio      = 0;
  producto      = 1

  if ( localStorage.length > 0) {
    for (var i = 0; i < localStorage.length; i++) {
      objetoJson = JSON.parse(localStorage[localStorage.key(i)]);
      nota = parseFloat(objetoJson.nota);
      sumatoria += nota;
      producto *= nota;
    }

    promedio = sumatoria / localStorage.length;

    var sTabla ="<table id='operaciones' class='table table-striped table-bordered table-hover' scope='col' colspan='2'><thead>";
    sTabla += "<tr><th>Suma</th><td>"+ sumatoria + "</td></tr>";
    sTabla += "<tr><th>Promedio</th><td>"+ promedio + "</td></tr>";
    sTabla += "<tr><th>Producto</th><td>"+ producto + "</td></tr>";
    sTabla += "</tbody></table>";
    sTabla = "<h5>Operaciones</h5>" + sTabla ;

    $('#informacion2').html(sTabla);
    $('html,body').animate({scrollTop: $("#operaciones").offset().top}, 2000);

  }else{
    alert("No hay registros para operar");
  }
}


/********************************************************************************/
/*Esta parte permite obtener las notas mayores y menores*/

/*
Función obtenerNota
El parametro opcion recibe el valor de 1 o 2.
En caso de recibir el valor de 1, la función mostrará la información de los estudiante con mayor nota.
En caso de recibir el valor de 1, la función mostrará la información de los estudiante con menor nota.
Se recorre el objeto JSON para obtener la información de las notas dependiendo del parámetro recibido
para Luego mostrar la información usando animaciones y un popup de alert().
*/

function obtenerNota(opcion){
  var posiciones = [];
  nota = 0;
  informacion = "Los estudiantes con menor nota son:\n";

  if(opcion == 1){
    var informacion = "Los estudiantes con mayor nota son:\n";
  }

  $('html,body').animate({scrollTop: $("#listaEstudiantes").offset().top}, 1000);

  if ( localStorage.length > 0) {
    objetoJson = JSON.parse(localStorage[localStorage.key(i)]);
    nota = parseFloat(objetoJson.nota);
    for (var i = 0; i < localStorage.length; i++) {
      objetoJson = JSON.parse(localStorage[localStorage.key(i)]);
      notaCopia = parseFloat(objetoJson.nota);
      if(opcion == 1){
        if(notaCopia > nota){
          nota = notaCopia;
        }
      }else{
        if(notaCopia < nota){
          nota = notaCopia;
        }
      }
    }

    for (var i = 0; i < localStorage.length; i++) {
      objetoJson = JSON.parse(localStorage[localStorage.key(i)]);
      if(objetoJson.nota == nota){
        posiciones.push(objetoJson.codigo);
        informacion += objetoJson.nombre + "  con " + objetoJson.nota + " en la materia " + objetoJson.materia + "\n";
      }
    }

    accionarClass(posiciones,"animacion1","animacion2");
    var tiempo = 250 ;
    for(var j=1;j<=3;j++){
      setTimeout(accionarClass,tiempo,posiciones,'animacion2','animacion1');
      tiempo+=250;
      setTimeout(accionarClass,tiempo,posiciones,'animacion1','animacion2');
      tiempo+=250;
    }
    setTimeout(accionarClass,2000,posiciones,'-','animacion1');
    setTimeout(alert,2010,informacion);
  }
}

/*La función accionarClass se encarga de recorre el arreglo para asignar y remover las diferentes clases
que permitirán ver la animación.
Recibe como parametros:
arregloCodigos: contiene el listado de códigos para modificar las filas de la tabla de registro de estudiantes.
claseAdicionar: es el nombre de la clase css que se adicionará a la fila de la tabla.
claseRemover: es el nombre de la clase css que se removerá de la fila de la tabla.*/
function accionarClass(arregloCodigos, claseAdicionar, claseRemover){
  for (var i=0;i<arregloCodigos.length;i++){
    $("#tr_"+arregloCodigos[i]).removeClass(claseRemover).addClass(claseAdicionar);
  }
}
