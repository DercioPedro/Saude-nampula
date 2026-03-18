// pegar id do hospital da URL
function getHospitalId() {
    let params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// carregar detalhes do hospital
function carregarDetalhes() {
    let id = getHospitalId();

    if (!id) {
        alert('Hospital não encontrado!');
        window.location.href = 'hospital.html';
        return;
    }

    let dados = localStorage.getItem('hospitais');
    let hospitais = dados ? JSON.parse(dados) : [];

    let hospital = null;
    for (let i = 0; i < hospitais.length; i++) {
        if (hospitais[i].id == id) {
            hospital = hospitais[i];
            break;
        }
    }

    if (!hospital) {
        alert('Hospital não encontrado!');
        window.location.href = 'hospital.html';
        return;
    }

    // preencher pagina com dados
    document.getElementById('breadcrumb-nome').textContent = hospital.nome;
    document.getElementById('hospital-nome').textContent = hospital.nome;
    document.getElementById('hospital-horario').textContent = hospital.horario;
    document.getElementById('hospital-endereco').textContent = hospital.endereco;
    document.getElementById('hospital-telefone').textContent = hospital.telefone;

    // preencher servicos
    let servicosDiv = document.getElementById('servicos-list');
    servicosDiv.innerHTML = '';

    if (hospital.servicos) {
        let servicos = hospital.servicos.split(',');

        for (let i = 0; i < servicos.length; i++) {
            let servico = servicos[i].trim();
            if (servico) {
                let tag = document.createElement('div');
                tag.className = 'servico-tag';
                tag.textContent = servico;
                servicosDiv.appendChild(tag);
            }
        }
    } else {
        servicosDiv.innerHTML = '<p class="loading-text">Nenhum serviço cadastrado</p>';
    }

    // guardar telefone global para uso nos botoes
    window.hospitalTelefone = hospital.telefone;
    window.hospitalNome = hospital.nome;
    window.hospitalEndereco = hospital.endereco;
}

// ligar para hospital
function ligar() {
    if (window.hospitalTelefone) {
        if (confirm('Deseja ligar para ' + window.hospitalTelefone + '?')) {
            window.location.href = 'tel:' + window.hospitalTelefone;
        }
    }
}

// ver no mapa
function verNoMapa() {
    if (window.hospitalEndereco) {
        let endereco = encodeURIComponent(window.hospitalEndereco + ', Nampula, Mozambique');
        window.open('https://www.google.com/maps/search/?api=1&query=' + endereco, '_blank');
    }
}

// obter direcoes
function obterDirecoes() {
    if (window.hospitalEndereco) {
        let endereco = encodeURIComponent(window.hospitalEndereco + ', Nampula, Mozambique');
        window.open('https://www.google.com/maps/dir/?api=1&destination=' + endereco, '_blank');
    }
}

// compartilhar
function compartilhar() {
    let url = window.location.href;
    let texto = 'Confira este hospital: ' + window.hospitalNome;

    if (navigator.share) {
        navigator.share({
            title: window.hospitalNome,
            text: texto,
            url: url
        }).catch(function (err) {
            copiarLink();
        });
    } else {
        copiarLink();
    }
}

function copiarLink() {
    let url = window.location.href;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
            alert('Link copiado para área de transferência!');
        });
    } else {
        // fallback antigo
        let input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('Link copiado para área de transferência!');
    }
}

// carregar quando pagina carregar
window.addEventListener('DOMContentLoaded', function () {
    carregarDetalhes();
});