// Variables y selectores
const formulario=document.querySelector('#agregar-gasto');
const gastoListado=document.querySelector('#gastos ul');




// Eventos
eventListeners();
function eventListeners(){
  document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
  formulario.addEventListener('submit',agregarGasto)

}


// clases
class Presupuesto{
  constructor(presupuesto){
      this.presupuesto=Number(presupuesto);
      this.restante=Number(presupuesto);
      this.gastos=[];
  }
  nuevoGasto(gasto){
    this.gastos=[...this.gastos,gasto];
    this.calcularrestante();
  }
  calcularrestante(){
    const gastado=this.gastos.reduce((total,gasto)=>total + gasto.cantidad,0);
    this.restante=this.presupuesto-gastado;
    console.log(this.restante)
  }
  eliminarGasto(id){
    this.gastos=this.gastos.filter(gasto=>gasto.id !==id)
  }
}
class UI{
  // Extreayendo el valor 
  insertarPresupuesto(cantidad){
    // Agrgando al HTML
   const {presupuesto,restante}=cantidad;
   document.querySelector('#total').textContent=presupuesto;
   document.querySelector('#restante').textContent=restante;
  }

  imprimirAlerta(mensaje,tipo){
    // creear el div
    const divMensaje=document.createElement('div');
    divMensaje.classList.add('text-center','alert');
    if(tipo==='error'){
      divMensaje.classList.add('alert-danger');
    }
    else{
      divMensaje.classList.add('alert-success');
    }
    // Mensaje de error
      divMensaje.textContent=mensaje;
    // Insertar en el HTML
    document.querySelector('.primario').insertBefore(divMensaje,formulario);
    // quitar el html
    setTimeout(() => {
        divMensaje.remove()
    }, 3000);
  }

  agregarGastoListado(gastos){
    this.limpiarHTML() //Elimina el HTML previo
    // Iterar sobre los gastos
    gastos.forEach(gasto => {
         const {cantidad,nombre,id}=gasto;
        // crear un LI
         const nuevoGasto=document.createElement('li');
         nuevoGasto.className='list-group-item d-flex justify-content-between align-items-center';
         nuevoGasto.dataset.id=id;
        // Agregar el HTML del gasto
          nuevoGasto.innerHTML=`${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`
        // boton para borrar el gasto
          const btnBorrar=document.createElement('button');
          btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
          btnBorrar.innerHTML='Borrar &times';
          btnBorrar.onclick=()=>{
            eliminarGasto(id);
          }
          nuevoGasto.appendChild(btnBorrar);

        // Agregamos al HTML
          gastoListado.appendChild(nuevoGasto)
    });
  }
  limpiarHTML(){
    while(gastoListado.firstChild){
      gastoListado.removeChild(gastoListado.firstChild)
    }
  }

  actualizarRestante(restante){
    document.querySelector('#restante').textContent=restante;
  }

  comprobarPresupuesto(presupuestoOBj){
    const {presupuesto,restante}=presupuestoOBj;
    const restanteDviv=document.querySelector('.restante');
    // comprobar 25%
    if((presupuesto/4)>restante){
      restanteDviv.classList.remove('alert-success','alert-warning');
      restanteDviv.classList.add('alert-danger')
    }
    else if((presupuesto/2)>restante){
      restanteDviv.classList.remove('alert-success');
      restanteDviv.classList.add('alert-warning')
    }
    // si el total es emnor a 0

      if(restante<=0){
        ui.imprimirAlerta('El presupuesto de ha agotado','error')
        formulario.querySelector('button[type="submit"]').disabled=true;
      }
  }
}
// instanciar
const ui=new UI();

let presupuesto;


// funciones
function preguntarPresupuesto(){
  const presupuestoUsuario=prompt('Cual es tu presupuesto?')
  // console.log(presupuestoUsuario)
  if(presupuestoUsuario==='' || presupuestoUsuario===null||isNaN(presupuestoUsuario)||presupuestoUsuario<=0){
    window.location.reload();
  }
  // presupuesto valido
  presupuesto=new Presupuesto(presupuestoUsuario);
  console.log(presupuesto)

  ui.insertarPresupuesto(presupuesto)
}
// Añade gastos
function agregarGasto(e){
  e.preventDefault();
  // Leer los datos del formulario
  const nombre=document.querySelector('#gasto').value;
  const cantidad=Number(document.querySelector('#cantidad').value);
  if(nombre===''|| cantidad===''){
    ui.imprimirAlerta('Ambos campos son obligatorios','error');
    return;
  }
  else if(cantidad<=0 || isNaN(cantidad)){
    ui.imprimirAlerta('Cantidad no valida','error');
    return;
  }
  // Generar un objeto con  gasto
  const gasto ={nombre,cantidad,id:Date.now()}
  // Añade un nuevo gasto
  presupuesto.nuevoGasto(gasto)
  // Mensaje de todo bien
  ui.imprimirAlerta('Gastos agregados correctamente')
  // imprimir gastos
  const {gastos,restante}=presupuesto;
  ui.agregarGastoListado(gastos)
  ui.actualizarRestante(restante)
  ui.comprobarPresupuesto(presupuesto);
  formulario.reset();
}

function eliminarGasto(id){
  presupuesto.eliminarGasto(id)
}