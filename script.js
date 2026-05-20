// Countdown para la fecha de la boda
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

// Música de fondo
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

// Smooth scroll para el botón de la portada
document.querySelector('.btn-scroll').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('historia').scrollIntoView({ behavior: 'smooth' });
});

// RSVP (simulado para demo - guarda en localStorage)
const btnConfirmar = document.getElementById('btnConfirmar');
const mensajeDiv = document.getElementById('mensajeConfirmacion');

btnConfirmar.addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value.trim();
    const acompanantes = document.getElementById('acompanantes').value;
    const asistencia = document.querySelector('input[name="asistencia"]:checked').value;
    
    if (!nombre) {
        alert('Por favor, ingresa tu nombre completo');
        return;
    }
    
    // Guardar en localStorage (simulación)
    const confirmacion = {
        nombre: nombre,
        acompanantes: acompanantes === '1' ? 1 : 2,
        asistencia: asistencia,
        fecha: new Date().toLocaleString()
    };
    
    localStorage.setItem(`rsvp_${nombre.replace(/\s/g, '_')}`, JSON.stringify(confirmacion));
    
    // Mostrar mensaje de éxito
    if (asistencia === 'si') {
        mensajeDiv.innerHTML = `🎉 ¡Gracias ${nombre}! Nos alegra mucho que nos acompañarás ${acompanantes === '2' ? 'en pareja' : 'en este día especial'}. 🎉`;
        mensajeDiv.style.background = '#e8f5e9';
        mensajeDiv.style.color = '#2e7d32';
    } else {
        mensajeDiv.innerHTML = `💙 Gracias por avisar, ${nombre}. Te extrañaremos, pero habrá más momentos para celebrar. 💙`;
        mensajeDiv.style.background = '#ffebee';
        mensajeDiv.style.color = '#c62828';
    }
    
    mensajeDiv.style.display = 'block';
    
    // Limpiar formulario
    document.getElementById('nombre').value = '';
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 5000);
});

// Efecto de aparición al hacer scroll (opcional)
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
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = '0.6s ease';
    observer.observe(el);
});
