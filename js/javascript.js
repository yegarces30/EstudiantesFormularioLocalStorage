
/*
  Esta parte del archivo contiene los métodos generales de la aplicación
*/


/* obtenerCookie permite obtener  la información de una cookie en específico.
Tiene como parametro nombre que indica el nombre de la cookie para traer la información*/

function obtenerCookie(nombre) {
   var nuevonombre = nombre + "=";
   var verificar = document.cookie.split(';');
   for (var i = 0; i < verificar.length; i++) {
      var v = verificar[i];
      while (v.charAt(0) == ' ') v = v.substring(1);
      if (v.indexOf(nuevonombre) != -1) {
         return v.substring(nuevonombre.length, v.length);
      }
   }
   return "";
}

/* la función agregarCookie tiene como función crear o modificar una agregarCookie
Tiene como parámetros, nombres que es el nombre de la cooikie, valor que corresponde al valor que se va a guardar en la cooikie
y fecha que correspopnde a la cantidad de días de duración.*/

function agregarCookie(nombre, valor, fecha) {
   var f = new Date();
   f.setTime(f.getTime() + (fecha * 24 * 60 * 60 * 1000));
   var expiracion = "expiracion=" + f.toGMTString();
   document.cookie = nombre + "=" + valor + "; " + expiracion;
}


/*La función limpiarCampos permite poner los campos en los valores por defecto*/

function limpiarCampos(){
  var codigo        = document.getElementById("codigo");
  var nombre        = document.getElementById("nombre");
  var materia       = document.getElementById("materia");
  var nota          = document.getElementById("nota");
  var observaciones = document.getElementById("observaciones");
  var opcionGuardar = document.getElementById("opcionGuardar");

  codigo.value = "";
  codigo.disabled = false;
  nombre.value = "";
  materia.selectedIndex = "0";
  nota.value = "";
  observaciones.value = "";
  opcionGuardar.value = "1";
  window.scrollTo(0, 0);
}

/*La función mostrarRegistro permite ver la información del registro seleccionado para modificarlo en el formulario.
Tiene como parámetro el campo codigo, el cual permite obtener la información en la cookie, convertirla en JSON y luego obtener
los valores del registro seleccionado*/
function mostrarRegistro(codigo){
  var cantidadEstudiantes = obtenerCookie("cantidadEstudiantes");
  if (cantidadEstudiantes != "" && cantidadEstudiantes != "0"){
    var estudiantes = obtenerCookie("estudiantes")+"]}";
    var objetoJson = JSON.parse(estudiantes);

    for (var i=0;i<objetoJson.estudiantes.length;i++){
        if(objetoJson.estudiantes[i].codigo == codigo){
          var codigo        = document.getElementById("codigo");
          var nombre        = document.getElementById("nombre");
          var materia       = document.getElementById("materia");
          var nota          = document.getElementById("nota");
          var observaciones = document.getElementById("observaciones");
          var opcionGuardar = document.getElementById("opcionGuardar");

          codigo.value = objetoJson.estudiantes[i].codigo;
          codigo.disabled = true;
          nombre.value = objetoJson.estudiantes[i].nombre;
          materia.value = objetoJson.estudiantes[i].materia;
          nota.value = objetoJson.estudiantes[i].nota;
          observaciones.value = objetoJson.estudiantes[i].observaciones;
          opcionGuardar.value = "2";
          window.scrollTo(0, 0);
          break;
        }
    }
  }
}

/*La función cargarPagina permite validar la existencia de la cookie y adicionar los eventos a los botones de las opcionrd principales*/
function cargarPagina(){
  var cantidadEstudiantes = obtenerCookie("cantidadEstudiantes");
  if (cantidadEstudiantes == "" || cantidadEstudiantes == "0"){
    agregarCookie("estudiantes",'{"estudiantes":[',30);
    agregarCookie("cantidadEstudiantes","0",30);
  }else{
    listarEstudiantes();
  }

  var btnGuardar        = document.getElementById("btnGuardar");
  btnGuardar.addEventListener("click",function(){guardar();});

  var btnNuevo        = document.getElementById("btnNuevo");
  btnNuevo.addEventListener("click",limpiarCampos);

  var btnOperaciones        = document.getElementById("btnOperaciones");
  btnOperaciones.addEventListener("click",obtenerOperaciones);

  var btnMayor        = document.getElementById("btnMayor");
  btnMayor.addEventListener("click",function (){obtenerNota(1);});

  var btnMenor        = document.getElementById("btnMenor");
  btnMenor.addEventListener("click",function (){obtenerNota(2);});
}

/*La función guardar permite guardar un registro nuevo o modificar un registro ya creado*/

function guardar(){
  var opcionGuardar = document.getElementById("opcionGuardar");
  if(opcionGuardar.value == "1"){
    adicionarEstudiante();
  }else{
    modificar();
  }
  listarEstudiantes();
}

/*******************************************************************************************/
/*Esta parte del archivo permite relizar las acciones de mostrar, crear, modificar y eliminar los registros ingresados*/



/*La funcion listarEstudiantes permite mostrar en una tabla a todos los registros de estudiantes que se encuentran
guardados en la cookie*/

function listarEstudiantes(){
  var estudiantes = obtenerCookie("estudiantes")+"]}";
  var objetoJson = JSON.parse(estudiantes);

  var sTabla ="<table class='table table-striped table-bordered table-hover'><thead>"+
              "<tr><th scope='col'>#</th>"+
              "<th scope='col'>Cod</th>"+
              "<th scope='col'>Nombre</th>"+
              "<th scope='col'>Materia</th>"+
              "<th scope='col'>Nota</th>"+
              "<th scope='col'>Observaciones</th>"+
              "<th scope='col'>Modificar</th>"+
              "<th scope='col'>Eliminar</th>"+
              "</thead><tbody>";

  for (var i=0;i<objetoJson.estudiantes.length;i++){
    sTabla += "<tr id='tr_"+objetoJson.estudiantes[i].codigo+"' ><td>"+(i+1)+"</td><td>"+objetoJson.estudiantes[i].codigo+"</td>" +
              "<td>"+objetoJson.estudiantes[i].nombre+"</td>" +
              "<td>"+objetoJson.estudiantes[i].materia+"</td>"+
              "<td>"+objetoJson.estudiantes[i].nota+"</td>"+
              "<td>"+objetoJson.estudiantes[i].observaciones+"</td>"+
              "<td><button name='"+objetoJson.estudiantes[i].codigo+"' onclick='mostrarRegistro("+objetoJson.estudiantes[i].codigo+")' "+
              "class='modificar btn btn-default btn-xs' >"+
              "<img  src='images/modificar.png' alt=''>  </img> </button></td>"+
              "<td><button name='"+objetoJson.estudiantes[i].codigo+"' onclick='eliminar("+objetoJson.estudiantes[i].codigo+")' "+
              "class='eliminar btn btn-default btn-xs' >"+
              "<img  src='images/eliminar.png' alt=''>  </img> </button></td></tr>";
  }

  sTabla +=  "</tbody></table>";
  sTabla = "<h5>Listado de estudiantes</h5>" + sTabla ;

  document.getElementById('informacion1').innerHTML = sTabla;
}

/*La función adicionarEstudiante permite guardar un registro nuevo en la cookie*/

function adicionarEstudiante(){
  var codigo        = document.getElementById("codigo");
  var nombre        = document.getElementById("nombre");
  var materia       = document.getElementById("materia");
  var nota          = document.getElementById("nota");
  var observaciones = document.getElementById("observaciones");

  var estudiantes         = obtenerCookie("estudiantes");
  var cantidadEstudiantes = parseInt(obtenerCookie("cantidadEstudiantes"),10);
  var cantidadEstudiantes = obtenerCookie("cantidadEstudiantes");

  if(cantidadEstudiantes == 0 || cantidadEstudiantes == NaN){
    agregarCookie("cantidadEstudiantes","1",30);
  }else{
    estudiantes +=",";
  }
  estudiantes +='{"codigo":"'+codigo.value.trim()+'",'+
                '"nombre":"'+nombre.value.trim()+'",'+
                '"materia":"'+materia.value.trim()+'",'+
                '"nota":'+nota.value.trim()+','+
                '"observaciones":"'+observaciones.value.trim()+'"}';
  agregarCookie("estudiantes",estudiantes,30);
  alert("Nota del estudiante registrada con éxito.");
  limpiarCampos();
}

/*La función modificar permite obtener el registro para modificar y luego guardarlo en la cookie*/

function modificar(){
  var cantidadEstudiantes = obtenerCookie("cantidadEstudiantes");
  if (cantidadEstudiantes != "" && cantidadEstudiantes != "0"){
    var estudiantes = obtenerCookie("estudiantes")+"]}";
    var objetoJson = JSON.parse(estudiantes);
    var codigo        = document.getElementById("codigo");

    for (var i=0;i<objetoJson.estudiantes.length;i++){
        if(objetoJson.estudiantes[i].codigo == codigo.value){
          var codigo        = document.getElementById("codigo");
          var nombre        = document.getElementById("nombre");
          var materia       = document.getElementById("materia");
          var nota          = document.getElementById("nota");
          var observaciones = document.getElementById("observaciones");
          var opcionGuardar = document.getElementById("opcionGuardar");

          objetoJson.estudiantes[i].codigo = codigo.value;
          objetoJson.estudiantes[i].nombre = nombre.value;
          objetoJson.estudiantes[i].materia = materia.value;
          objetoJson.estudiantes[i].nota = nota.value;
          objetoJson.estudiantes[i].observaciones = observaciones.value;
          break;
        }
    }
    estudiantes = JSON.stringify(objetoJson);
    estudiantes = estudiantes.replace("]}","");
    agregarCookie("estudiantes",estudiantes,30);
    limpiarCampos();
    alert("Registro modificado con éxito.");
  }
}

/*La función eliminar permite liminar el registro seleccionado
Tiene como parámetro la variable codigo, el cual contiene el codigo del registro a eliminar*/

function eliminar(codigo){
  var cantidadEstudiantes = obtenerCookie("cantidadEstudiantes");
  if (cantidadEstudiantes != "" && cantidadEstudiantes != "0"){
    var respuesta= confirm("¿Desea eliminar el registro seleccionado?");
    if (respuesta){
      var estudiantes = obtenerCookie("estudiantes")+"]}";
      var objetoJson = JSON.parse(estudiantes);

      for (var i=0;i<objetoJson.estudiantes.length;i++){
          if(objetoJson.estudiantes[i].codigo == codigo){
              objetoJson.estudiantes.splice(i,i);
            break;
          }
      }

      estudiantes = JSON.stringify(objetoJson);
      estudiantes = estudiantes.replace("]}","");
      agregarCookie("estudiantes",estudiantes,30);
      limpiarCampos();
      listarEstudiantes();
    }
  }
}

/********************************************************************************/

/*Eesta parte contiene las funciones que muestra las operaciones matemáticas realizadasa los registros*/

function obtenerOperaciones(){
  var sumatoria     = 0;
  var promedio      = 0;
  var producto      = 1

  var cantidadEstudiantes = obtenerCookie("cantidadEstudiantes");
  if (cantidadEstudiantes != "" && cantidadEstudiantes != "0"){
    var estudiantes = obtenerCookie("estudiantes")+"]}";
    var objetoJson = JSON.parse(estudiantes);

    for (var i=0;i<objetoJson.estudiantes.length;i++){
      var nota = parseFloat(objetoJson.estudiantes[i].nota);
      sumatoria += nota;
      producto *= nota;

    }
    if(objetoJson.estudiantes.length > 0){
      promedio = sumatoria / objetoJson.estudiantes.length;
    }

    var sTabla ="<table class='table table-striped table-bordered table-hover'>"+
                "<tr><th>Suma</th><td>"+ sumatoria + "</td></tr>" +
                "<tr><th>Promedio</th><td>"+ promedio + "</td></tr>" +
                "<tr><th>Producto</th><td>"+ producto + "</td></tr>" +
                "</table>" ;
    sTabla =    "<h5>Operaciones</h5>" + sTabla ;

    document.getElementById('informacion2').innerHTML = sTabla;
    window.scrollTo(0, window.outerHeight);
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
  var cantidadEstudiantes = obtenerCookie("cantidadEstudiantes");
  if (cantidadEstudiantes != "" && cantidadEstudiantes != "0"){
    var estudiantes = obtenerCookie("estudiantes")+"]}";
    var objetoJson = JSON.parse(estudiantes);
    var posiciones = [];
    var nota = 0;
    var informacion = "Los estudiantes con menor nota son:\n";

    if(objetoJson.estudiantes.length > 0)
    {
      nota = objetoJson.estudiantes[0].nota;
    }
    if(opcion == 1){
      var informacion = "Los estudiantes con mayor nota son:\n";
    }

    for (var i=0;i<objetoJson.estudiantes.length;i++){
      if(opcion == 1){
        if(objetoJson.estudiantes[i].nota > nota){
          nota  = objetoJson.estudiantes[i].nota;
        }
      }else{
        if(objetoJson.estudiantes[i].nota < nota){
          nota  = objetoJson.estudiantes[i].nota;
        }
      }
    }

    for (var i=0;i<objetoJson.estudiantes.length;i++){
      if(objetoJson.estudiantes[i].nota == nota){
        posiciones.push(objetoJson.estudiantes[i].codigo);
        informacion += objetoJson.estudiantes[i].nombre + "  con " + objetoJson.estudiantes[i].nota + " en la materia " + objetoJson.estudiantes[i].materia + "\n";
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
  console.log("se meti+o al accionar");
  for (var i=0;i<arregloCodigos.length;i++){
    var fila = document.getElementById("tr_"+arregloCodigos[i]);
    fila.classList.remove(claseRemover);
    fila.classList.add(claseAdicionar);
  }
}
