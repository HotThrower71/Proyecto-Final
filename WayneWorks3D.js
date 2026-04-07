const modal = document.getElementById('modal-noticia');
const btnAbrir = document.getElementById('btn-abrir-formulario');
const btnCerrar = document.getElementById('btn-cerrar-modal');
const form = document.getElementById('form-nueva-noticia');
const contenedorDinamico = document.getElementById('contenedor-dinamico-principal');

if (btnAbrir) {
    btnAbrir.onclick = function() { modal.classList.add('capa-modal-activa'); }
}
if (btnCerrar) {
    btnCerrar.onclick = function() { modal.classList.remove('capa-modal-activa'); }
}
window.onclick = function(event) {
    if (event.target == modal) { modal.classList.remove('capa-modal-activa'); }
}

function reorganizarDiseno() {
    if (!contenedorDinamico) return;
    const noticias = contenedorDinamico.children;
    const total = noticias.length;

    for (let i = 0; i < total; i++) {
        const indiceDesdeAtras = (total - 1) - i;
        const noticia = noticias[i];
        const divImagen = noticia.querySelector('div');

        const posicionEnCiclo = indiceDesdeAtras % 3;
        
        let esFijaGrande = (posicionEnCiclo === 2);
        let debeVerseGrande = esFijaGrande;

        if (!esFijaGrande && i === 0 && posicionEnCiclo === 0) {
            debeVerseGrande = true;
        }

        noticia.className = 'tarjeta-individual-noticia ' + (debeVerseGrande ? 'tarjeta-grande-dinamica' : 'tarjeta-normal-dinamica');
        if (divImagen) {
            divImagen.className = debeVerseGrande ? 'caja-imagen-noticia-destacada' : 'caja-imagen-noticia';
        }
    }
}

if (form) {
    form.onsubmit = function(e) {
        e.preventDefault();

        const tituloVal = document.getElementById('titulo').value;
        const categoriaVal = document.getElementById('categoria').value;
        const descripcionVal = document.getElementById('descripcion').value;
        let imagenVal = document.getElementById('imagen').value || 'ayu.png';

        const hoy = new Date();
        const fechaTexto = hoy.getDate() + " de " + 
                           hoy.toLocaleString('es-ES', { month: 'long' }) + ", " + 
                           hoy.getFullYear();

        const article = document.createElement('article');
        
        const divImagen = document.createElement('div');
        const img = document.createElement('img');
        img.src = imagenVal;
        
        const spanCat = document.createElement('span');
        spanCat.className = 'etiqueta-categoria-noticia';
        spanCat.textContent = categoriaVal;
        
        divImagen.appendChild(img);
        divImagen.appendChild(spanCat);

        const divTextos = document.createElement('div');
        divTextos.className = 'caja-textos-noticia';
        
        const spanFecha = document.createElement('span');
        spanFecha.className = 'fecha-publicacion-noticia';
        spanFecha.textContent = fechaTexto;
        
        const h3 = document.createElement('h3');
        h3.textContent = tituloVal;
        
        const p = document.createElement('p');
        p.className = 'parrafo-descripcion-noticia';
        p.textContent = descripcionVal;
        
        divTextos.appendChild(spanFecha);
        divTextos.appendChild(h3);
        divTextos.appendChild(p);

        article.appendChild(divImagen);
        article.appendChild(divTextos);

        contenedorDinamico.insertBefore(article, contenedorDinamico.firstChild);

        reorganizarDiseno();

        form.reset();
        modal.classList.remove('capa-modal-activa');
    };
}
