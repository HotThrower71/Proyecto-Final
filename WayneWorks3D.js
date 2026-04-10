// Elementos del Modal de Noticia
const modal = document.getElementById('modal-noticia');
const btnAbrir = document.getElementById('btn-abrir-formulario');
const btnCerrar = document.getElementById('btn-cerrar-modal');
const form = document.getElementById('form-nueva-noticia');
const contenedorDinamico = document.getElementById('contenedor-dinamico-principal');

// Elementos del Modal de Login
const modalLogin = document.getElementById('modal-login');
const btnLoginLogout = document.getElementById('btn-login-logout');
const btnCerrarLogin = document.getElementById('btn-cerrar-login');
const formLogin = document.getElementById('form-login');
const errorLogin = document.getElementById('error-login');

// Usuarios predefinidos
const usuarios = {
    'user': { password: 'user', role: 'user' },
    'admin': { password: 'admin', role: 'admin' }
};

// --- GESTIÓN DE SESIÓN ---

function actualizarInterfazSegunSesion() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (usuarioLogueado) {
        btnLoginLogout.textContent = `Logout (${usuarioLogueado.username})`;
        
        // Solo el admin puede añadir noticias
        if (usuarioLogueado.role === 'admin' && btnAbrir) {
            btnAbrir.style.display = 'inline-block';
        } else if (btnAbrir) {
            btnAbrir.style.display = 'none';
        }
    } else {
        btnLoginLogout.textContent = 'Login';
        if (btnAbrir) btnAbrir.style.display = 'none';
    }
}

// Inicializar interfaz
actualizarInterfazSegunSesion();

// --- EVENTOS DE MODALES ---

// Modal Noticia
if (btnAbrir) {
    btnAbrir.onclick = function() { modal.classList.add('capa-modal-activa'); }
}
if (btnCerrar) {
    btnCerrar.onclick = function() { modal.classList.remove('capa-modal-activa'); }
}

// Modal Login
if (btnLoginLogout) {
    btnLoginLogout.onclick = function() {
        const usuarioLogueado = localStorage.getItem('usuarioLogueado');
        if (usuarioLogueado) {
            // Si ya hay sesión, el botón hace Logout
            localStorage.removeItem('usuarioLogueado');
            actualizarInterfazSegunSesion();
            location.reload(); // Recargar para limpiar estado
        } else {
            // Si no hay sesión, abrir modal
            modalLogin.classList.add('capa-modal-activa');
        }
    }
}

if (btnCerrarLogin) {
    btnCerrarLogin.onclick = function() { 
        modalLogin.classList.remove('capa-modal-activa');
        errorLogin.style.display = 'none';
        formLogin.reset();
    }
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target == modal) { 
        modal.classList.remove('capa-modal-activa'); 
    }
    if (event.target == modalLogin) { 
        modalLogin.classList.remove('capa-modal-activa');
        errorLogin.style.display = 'none';
        formLogin.reset();
    }
}

// --- LÓGICA DE LOGIN ---

if (formLogin) {
    formLogin.onsubmit = function(e) {
        e.preventDefault();
        const userVal = document.getElementById('username').value;
        const passVal = document.getElementById('password').value;

        const user = usuarios[userVal];

        if (user && user.password === passVal) {
            // Login correcto
            const datosUsuario = { username: userVal, role: user.role };
            localStorage.setItem('usuarioLogueado', JSON.stringify(datosUsuario));
            
            actualizarInterfazSegunSesion();
            modalLogin.classList.remove('capa-modal-activa');
            formLogin.reset();
            errorLogin.style.display = 'none';
        } else {
            // Login incorrecto
            errorLogin.style.display = 'block';
        }
    };
}

// --- LÓGICA DE NOTICIAS ---

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
