const url="https://api.edamam.com/search?app_id=900da95e&app_key=40698503668e0bb3897581f4766d77f9&q=";
let newServiceWorker;
 function ShowSanckBar(){
    var  x= document.getElementById('snackbar');
    x.className='show';
}
document.getElementById('btn_buscar').addEventListener('click',(e)=>{
  cargarRecetas();
    
    });
function cargarRecetas(){
    let busqueda=document.getElementById('txt_busqueda').value;
 
      let finalUrl=url+busqueda;
        fetch(finalUrl).then(response => response.json())
        .then(response => {
         let contendor=document.getElementById('contenedor_recetas');
         contendor.innerHTML='';
         if(response.count>0){
             let recetas='';
            response.hits.forEach(hits => {
             
                    let receta=hits.recipe;
                recetas+=`  <div class="col-12 col-lg-6 col-xxl-4 mb-5">
                <div class="card bg-light border-0 h-100">
                    <div class="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                        <div class="featurerounded-3 mb-4 mt-n4">
                            <img alt="" style="max-width: 150px;" class="img-fluid" src="${receta.image}">
                        </div>
                        <h2 class="fs-4 fw-bold">${receta.label}</h2>
                        <p class="mb-0">${receta.ingredientLines[0]}<br> ${receta.ingredientLines[1]}<br>... </p>
                    </div>
                </div>
            </div>`;
            });
            document.getElementById('txt_titulo').innerHTML='Recetas relacionadas con: '+busqueda;
            contendor.innerHTML=recetas;
            
         }else{
             contendor.innerHTML='<div class="col-12  mb-5 text-center justify-content-center d-flex"><h1 class="h-100 text-center mx-auto">No se encontrarón recetas</h1></div>'
         }
    
        })
    
 
    

}

document.getElementById('btn-update').addEventListener('click',()=>{
    newServiceWorker.postMessage({action:'skipWaiting'});
    window.location.reload();
    });
window.addEventListener("load", function() {
    cargarRecetas();
    navigator.serviceWorker.register("/serviceWorker.js").then((registration)=>{
        registration.addEventListener('updatefound',()=>{
            newServiceWorker=registration.installing;
            newServiceWorker.addEventListener('statechange', ()=>{
            
                if(newServiceWorker.state==   'installed'){
                        ShowSanckBar();
                       
                }
            })
    })
}).catch((err)=>{
        console.log("data error =>"+err);
    })

     })