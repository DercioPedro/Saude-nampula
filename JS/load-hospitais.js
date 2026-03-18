const hospitaisExemplo = [
    {
        id: 1,
        nome: "Hospital Central de Nampula",
        endereco: "Av. Eduardo Mondlane, Centro",
        telefone: "+258 26 210000",
        horario: "Aberto 24 Horas",
        emergencia: true,
        especialidades: ["Clínica Geral", "Cirurgia", "Pediatria", "Ginecologia"]
    },
    {
        id: 2,
        nome: "Hospital Provincial de Nampula",
        endereco: "Centro da Cidade, Nampula",
        telefone: "+258 26 210001",
        horario: "08:00 - 20:00",
        emergencia: true,
        especialidades: ["Clínica Geral", "Ortopedia", "Oftalmologia"]
    },
    {
        id: 3,
        nome: "Hospital Rural de Muhala",
        endereco: "Bairro Muhala, Nampula",
        telefone: "+258 26 210002",
        horario: "08:00 - 18:00",
        emergencia: false,
        especialidades: ["Clínica Geral", "Pediatria"]
    },
    {
        id: 4,
        nome: "Hospital Distrital de Mucatine",
        endereco: "Bairro Mucatine, Nampula",
        telefone: "+258 26 210003",
        horario: "07:00 - 19:00",
        emergencia: false,
        especialidades: ["Clínica Geral", "Ginecologia", "Medicina Interna"]
    },
    {
        id: 5,
        nome: "Hospital Popular de Nampula",
        endereco: "Mercado Central, Nampula",
        telefone: "+258 26 210004",
        horario: "08:00 - 18:00",
        emergencia: false,
        especialidades: ["Clínica Geral", "Pediatria", "Dermatologia"]
    },
    {
        id: 6,
        nome: "Hospital Saúde",
        endereco: "Av. do Trabalho, Nampula",
        telefone: "+258 26 210005",
        horario: "Aberto 24 Horas",
        emergencia: true,
        especialidades: ["Clínica Geral", "Cirurgia", "Cardiologia"]
    }
];

// Inicializar localStorage com dados de exemplo se estiver vazio
function inicializarDados() {
    let dados = localStorage.getItem('hospitais');
    if (!dados || JSON.parse(dados).length === 0) {
        localStorage.setItem('hospitais', JSON.stringify(hospitaisExemplo));
        console.log("Dados de exemplo carregados no localStorage");
    }
}

// Carregar hospitais do localStorage
function carregarHospitais() {
    inicializarDados();

    let dados = localStorage.getItem('hospitais');
    let hospitais = dados ? JSON.parse(dados) : [];

    let hospitaisGrid = document.querySelector('.hospitais-grid');

    if (!hospitaisGrid) {
        console.error("Elemento .hospitais-grid não encontrado!");
        return;
    }

    hospitaisGrid.innerHTML = '';

    let msgVazia = document.querySelector('.empty-message');
    if (msgVazia) msgVazia.remove();

    if (hospitais.length === 0) {
        mostrarMensagemVazia(hospitaisGrid);
        return;
    }

    for (let i = 0; i < hospitais.length; i++) {
        let card = criarCardHospital(hospitais[i]);
        hospitaisGrid.appendChild(card);
    }
}


// carregar hospitais do localStorage
function carregarHospitais() {
    let dados = localStorage.getItem('hospitais');
    let hospitais = dados ? JSON.parse(dados) : [];

    let main = document.querySelector('main');
    let header = main.querySelector('.page-header');

    // limpar cards antigos
    let cardsAntigos = document.querySelectorAll('.hospital-card');
    for (let i = 0; i < cardsAntigos.length; i++) {
        cardsAntigos[i].remove();
    }

    // se nao tiver nada, mostra mensagem
    if (hospitais.length == 0) {
        let msg = document.createElement('div');
        msg.className = 'empty-message';
        msg.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6b7280;">
                <h3 style="font-size: 24px; margin-bottom: 16px;">Nenhum hospital cadastrado</h3>
                <p>Os hospitais cadastrados aparecerão aqui.</p>
            </div>
        `;
        header.after(msg);
        return;
    }

    // criar card pra cada hospital
    for (let i = 0; i < hospitais.length; i++) {
        let card = criarCard(hospitais[i]);
        main.appendChild(card);
    }
}

function criarCard(hospital) {
    let card = document.createElement('div');
    card.className = 'hospital-card';

    // pegar servicos
    let servicos = [];
    if (hospital.servicos) {
        servicos = hospital.servicos.split(',');
    }

    let tagsServicos = '';
    for (let i = 0; i < servicos.length; i++) {
        let s = servicos[i].trim();
        if (s) {
            tagsServicos += `<span class="service-tag">${s}</span>`;
        }
    }

    let htmlServicos = '';
    if (servicos.length > 0) {
        htmlServicos = `
        <div class="services">
            <p class="services-label">Serviços:</p>
            <div class="services-tags">
                ${tagsServicos}
            </div>
        </div>
        `;
    }

    card.innerHTML = `
        <div class="hospital-header">
            <div class="hospital-title">
                <h3>${hospital.nome}</h3>
                <span class="hospital-type">Hospital</span>
            </div>
            <span class="hospital-icon"><img src="img/hospital.png" alt=""></span>
        </div>

        <div class="hospital-details">
            <div class="detail-item">
                <span class="detail-icon"><img src="img/ponto.png" alt=""></span>
                <span>${hospital.endereco}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon"><img src="img/call.png" alt=""></span>
                <span>${hospital.telefone}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon"><img src="img/clock.png" alt=""></span>
                <span>${hospital.horario}</span>
            </div>
        </div>

        ${htmlServicos}

        <button class="details-btn" onclick="verDetalhes(${hospital.id})">Ver Detalhes</button>
    `;

    return card;
}

// funcao para ir para pagina de detalhes
function verDetalhes(id) {
    window.location.href = 'hospital-detalhes.html?id=' + id;
}

// quando a pagina carregar
window.addEventListener('DOMContentLoaded', function () {
    carregarHospitais();
});
