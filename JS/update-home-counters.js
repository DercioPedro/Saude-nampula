// atualizar numeros na home
function atualizarContadores() {
    let hospitais = JSON.parse(localStorage.getItem('hospitais') || '[]');
    let centros = JSON.parse(localStorage.getItem('centros') || '[]');
    let farmacias = JSON.parse(localStorage.getItem('farmacias') || '[]');
    let emergencias = JSON.parse(localStorage.getItem('emergencias') || '[]');
    
    // atualizar cada um
    let numHospitais = document.querySelector('.card-blue .card-count');
    if(numHospitais) {
        numHospitais.textContent = hospitais.length;
    }
    
    let numCentros = document.querySelector('.card-emerald .card-count');
    if(numCentros) {
        numCentros.textContent = centros.length;
    }
    
    let numFarmacias = document.querySelector('.card-purple .card-count');
    if(numFarmacias) {
        numFarmacias.textContent = farmacias.length;
    }
    
    let numEmergencias = document.querySelector('.card-red .card-count');
    if(numEmergencias && emergencias.length > 0) {
        numEmergencias.textContent = '24/7';
    }
}

window.addEventListener('DOMContentLoaded', function() {
    atualizarContadores();
});

// atualizar se mudar em outra aba
window.addEventListener('storage', function(e) {
    if(e.key == 'hospitais' || e.key == 'centros' || e.key == 'farmacias' || e.key == 'emergencias') {
        atualizarContadores();
    }
});
