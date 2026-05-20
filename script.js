// ========== COUNTDOWN PARA LA BODA ==========
function actualizarCountdown() {
    const fechaBoda = new Date("December 20, 2025 19:00:00").getTime();
    const ahora = new Date().getTime();
    const distancia = fechaBoda - ahora;

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (86400000)) / (3600000));
    const minutos = Math.floor((distancia % 3600000) / 60000);
    const segundos = Math.floor((distancia % 60000) / 1000);

    document.getElementById("dias").innerText = dias < 10 ? "0" + dias : dias;
    document.getElementById("horas").innerText = horas < 10 ? "0" + horas : horas;
    document.getElementById("minutos").innerText = minutos < 10 ? "0" + minutos : minutos;
    document.getElementById("segundos").innerText = segundos < 10 ? "0" + segundos : segundos;
}

setInterval(actualizarCountdown, 1000);
actualizarCountdown();

// ========== MÚSICA DE FONDO ==========
const musica = document.getElementById("musicaFondo");
const musicBtn = document.getElementById("musicBtn");
let musicaActivada = false;

musicBtn.addEventListener("click", () => {
    if (!musicaActivada) {
        musica.play().catch(e => console.log("Autoplay no permitido"));
        musicaActivada = true;
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        musica.pause();
        musicaActivada = false;
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    }
});

// ========== SMOOTH SCROLL ==========
const btnScroll = document.querySelector('.btn-scroll');
if (btnScroll) {
    btnScroll.addEventListener('click', (e) => {
        e.preventDefault();
        const historiaSection = document.getElementById('historia');
        if (historiaSection) {
            historiaSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ========== EFECTOS AL HACER SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.detalle-card, .galeria-item, .historia-content > *').forEach(el => {
    if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = '0.6s ease';
        observer.observe(el);
    }
});

// ========== RSVP CON GOOGLE SHEETS (REAL) ==========
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfj4JWpZhUVETmPec4WhZltHNOZbICgipJzoBr8La3VCjPnTprQFV7A71cebKTrpH0Wg/exec';

const btnConfirmar = document.getElementById('btnConfirmar');
const mensajeDiv = document.getElementById('mensajeConfirmacion');
const nombreInput = document.getElementById('nombre');
const acompanantesSelect = document.getElementById('acompanantes');
const radiosAsistencia = document.querySelectorAll('input[name="asistencia"]');

// Función para enviar confirmación
async function enviarConfirmacion() {
    const nombre = nombreInput.value.trim();
    const acompanantes = acompanantesSelect.value;
    let asistencia = 'si';
    
    // Obtener valor del radio seleccionado
    for (const radio of radiosAsistencia) {
        if (radio.checked) {
            asistencia = radio.value;
            break;
        }
    }
    
    // Validaciones
    if (!nombre) {
        mostrarMensaje('💖 Por favor, ingresa tu nombre completo', 'error');
        return;
    }
    
    // Deshabilitar botón mientras se envía
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = 'Enviando... <i class="fas fa-spinner fa-pulse"></i>';
    
    // Preparar datos
    const datos = {
        nombre: nombre,
        acompanantes: acompanantes,
        asistencia: asistencia,
        fecha_registro: new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz' }),
        token: 'demo_' + Date.now()
    };
    
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        // Mostrar mensaje de éxito según respuesta
        if (asistencia === 'si') {
            mostrarMensaje(
                `🎉 ¡Gracias ${nombre}! 💖<br><br>` +
                `Nos alegra mucho que nos acompañarás ${acompanantes === '2' ? 'en pareja' : 'a celebrar este día especial'}.<br><br>` +
                `📋 Hemos registrado tu confirmación. ¡Te esperamos!`,
                'success'
            );
            
            // Limpiar formulario
            nombreInput.value = '';
            acompanantesSelect.value = '1';
            document.querySelector('input[name="asistencia"][value="si"]').checked = true;
            
        } else {
            mostrarMensaje(
                `💙 Gracias por avisar, ${nombre}.<br><br>` +
                `Te extrañaremos, pero habrá más momentos para celebrar juntos.`,
                'info'
            );
            
            // Limpiar formulario
            nombreInput.value = '';
        }
        
        // Scroll al mensaje
        mensajeDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Ocultar mensaje después de 6 segundos
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
        }, 6000);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje(
            `❌ Hubo un error al guardar tu confirmación.<br><br>` +
            `Por favor, intenta de nuevo o contáctanos por WhatsApp.`,
            'error'
        );
        
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
        }, 5000);
    } finally {
        // Rehabilitar botón
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = 'Confirmar asistencia <i class="fas fa-heart"></i>';
    }
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    mensajeDiv.style.display = 'block';
    mensajeDiv.innerHTML = texto;
    
    if (tipo === 'success') {
        mensajeDiv.style.background = '#e8f5e9';
        mensajeDiv.style.color = '#2e7d32';
        mensajeDiv.style.border = '1px solid #81c784';
    } else if (tipo === 'error') {
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
        mensajeDiv.style.border = '1px solid #ef9a9a';
    } else {
        mensajeDiv.style.background = '#e3f2fd';
        mensajeDiv.style.color = '#1565c0';
        mensajeDiv.style.border = '1px solid #90caf9';
    }
}

// Asignar evento al botón
if (btnConfirmar) {
    btnConfirmar.addEventListener('click', enviarConfirmacion);
}

// Permitir enviar con Enter en el campo nombre
if (nombreInput) {
    nombreInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            enviarConfirmacion();
        }
    });
}
