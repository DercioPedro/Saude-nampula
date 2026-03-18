// verificar se ta logado
function checkAuth() {
    if (localStorage.getItem('adminLoggedIn') != 'true') {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// carregar nome do usuario
function carregarInfoUsuario() {
    let usuario = localStorage.getItem('adminUsername') || 'Administrador';
    document.getElementById('nomeUsuario').textContent = usuario.charAt(0).toUpperCase() + usuario.slice(1);
}

// sair
function sair() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('loginTime');
        window.location.href = 'admin-login.html';
    }
}

// inicializar dados de exemplo
function inicializarDados() {
    if (!localStorage.getItem('hospitais')) {
        let hospitais = [
            {
                id: 1,
                nome: "Hospital Central de Nampula",
                endereco: "Avenida do Trabalho",
                telefone: "+258 26 212345",
                horario: "24 horas",
                servicos: "Emergência, Cirurgia, Internamento, Consultas Gerais"
            },
            {
                id: 2,
                nome: "Hospital Geral de Marrere",
                endereco: "Bairro de Marrere",
                telefone: "+258 26 213456",
                horario: "24 horas",
                servicos: "Emergência, Pediatria, Maternidade"
            }
        ];
        localStorage.setItem('hospitais', JSON.stringify(hospitais));
    }

    if (!localStorage.getItem('centros')) {
        let centros = [
            {
                id: 1,
                nome: "Centro de Saúde de Muatala",
                endereco: "Bairro de Muatala",
                telefone: "+258 26 214567",
                horario: "07:00 - 15:30",
                servicos: "Consultas Gerais, Vacinação, Planeamento Familiar"
            },
            {
                id: 2,
                nome: "Centro de Saúde Urbano 1º de Maio",
                endereco: "Bairro 1º de Maio",
                telefone: "+258 26 215678",
                horario: "07:00 - 15:30",
                servicos: "Consultas, Maternidade, Pediatria"
            }
        ];
        localStorage.setItem('centros', JSON.stringify(centros));
    }

    if (!localStorage.getItem('farmacias')) {
        let farmacias = [
            {
                id: 1,
                nome: "Farmácia Moderna",
                endereco: "Avenida do Trabalho",
                telefone: "+258 26 216789",
                horario: "08:00 - 20:00",
                plantao: "Sim"
            },
            {
                id: 2,
                nome: "Farmácia Santa Maria",
                endereco: "Rua dos Continuadores",
                telefone: "+258 26 217890",
                horario: "08:00 - 18:00",
                plantao: "Não"
            }
        ];
        localStorage.setItem('farmacias', JSON.stringify(farmacias));
    }

    if (!localStorage.getItem('emergencias')) {
        let emergencias = [
            {
                id: 1,
                nome: "Ambulância Central",
                tipo: "Ambulância",
                telefone: "119",
                disponibilidade: "24/7"
            },
            {
                id: 2,
                nome: "Bombeiros Nampula",
                tipo: "Bombeiros",
                telefone: "198",
                disponibilidade: "24/7"
            },
            {
                id: 3,
                nome: "Polícia de Emergência",
                tipo: "Polícia",
                telefone: "112",
                disponibilidade: "24/7"
            }
        ];
        localStorage.setItem('emergencias', JSON.stringify(emergencias));
    }
}

// atualizar contadores
function atualizarContadores() {
    let hospitais = JSON.parse(localStorage.getItem('hospitais') || '[]');
    let centros = JSON.parse(localStorage.getItem('centros') || '[]');
    let farmacias = JSON.parse(localStorage.getItem('farmacias') || '[]');
    let emergencias = JSON.parse(localStorage.getItem('emergencias') || '[]');

    document.getElementById('contadorHospitais').textContent = hospitais.length;
    document.getElementById('contadorCentros').textContent = centros.length;
    document.getElementById('contadorFarmacias').textContent = farmacias.length;
    document.getElementById('contadorEmergencias').textContent = emergencias.length;
}

// mudar tab
function mudarAba(abaNome) {
    let abas = document.querySelectorAll('.tab');
    for (let i = 0; i < abas.length; i++) {
        abas[i].classList.remove('active');
    }

    let conteudos = document.querySelectorAll('.tab-content');
    for (let i = 0; i < conteudos.length; i++) {
        conteudos[i].classList.remove('active');
    }

    event.target.classList.add('active');
    document.getElementById('aba-' + abaNome).classList.add('active');
}

// carregar tabelas
function carregarTabelas() {
    carregarHospitais();
    carregarCentros();
    carregarFarmacias();
    carregarEmergencias();
}

function carregarHospitais() {
    let hospitais = JSON.parse(localStorage.getItem('hospitais') || '[]');
    let corpo = document.getElementById('corpoHospitais');

    if (hospitais.length == 0) {
        corpo.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #6b7280;">Nenhum hospital cadastrado</td></tr>';
        return;
    }

    let html = '';
    for (let i = 0; i < hospitais.length; i++) {
        let h = hospitais[i];
        html += `
        <tr>
            <td><strong>${h.nome}</strong></td>
            <td>${h.endereco}</td>
            <td>${h.telefone}</td>
            <td>${h.horario}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editarItem('hospital', ${h.id})">Editar</button>
                    <button class="btn-delete" onclick="deletarItem('hospital', ${h.id})">Excluir</button>
                </div>
            </td>
        </tr>
        `;
    }
    corpo.innerHTML = html;
}

function carregarCentros() {
    let centros = JSON.parse(localStorage.getItem('centros') || '[]');
    let corpo = document.getElementById('corpoCentros');

    if (centros.length == 0) {
        corpo.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #6b7280;">Nenhum centro de saúde cadastrado</td></tr>';
        return;
    }

    let html = '';
    for (let i = 0; i < centros.length; i++) {
        let c = centros[i];
        html += `
        <tr>
            <td><strong>${c.nome}</strong></td>
            <td>${c.endereco}</td>
            <td>${c.telefone}</td>
            <td>${c.horario}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editarItem('centro', ${c.id})">Editar</button>
                    <button class="btn-delete" onclick="deletarItem('centro', ${c.id})">Excluir</button>
                </div>
            </td>
        </tr>
        `;
    }
    corpo.innerHTML = html;
}

function carregarFarmacias() {
    let farmacias = JSON.parse(localStorage.getItem('farmacias') || '[]');
    let corpo = document.getElementById('corpoFarmacias');

    if (farmacias.length == 0) {
        corpo.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #6b7280;">Nenhuma farmácia cadastrada</td></tr>';
        return;
    }

    let html = '';
    for (let i = 0; i < farmacias.length; i++) {
        let f = farmacias[i];
        html += `
        <tr>
            <td><strong>${f.nome}</strong></td>
            <td>${f.endereco}</td>
            <td>${f.telefone}</td>
            <td>${f.horario}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editarItem('farmacia', ${f.id})">Editar</button>
                    <button class="btn-delete" onclick="deletarItem('farmacia', ${f.id})">Excluir</button>
                </div>
            </td>
        </tr>
        `;
    }
    corpo.innerHTML = html;
}

function carregarEmergencias() {
    let emergencias = JSON.parse(localStorage.getItem('emergencias') || '[]');
    let corpo = document.getElementById('corpoEmergencias');

    if (emergencias.length == 0) {
        corpo.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #6b7280;">Nenhum contato de emergência cadastrado</td></tr>';
        return;
    }

    let html = '';
    for (let i = 0; i < emergencias.length; i++) {
        let e = emergencias[i];
        html += `
        <tr>
            <td><strong>${e.nome}</strong></td>
            <td>${e.tipo}</td>
            <td>${e.telefone}</td>
            <td>${e.disponibilidade}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editarItem('emergencia', ${e.id})">Editar</button>
                    <button class="btn-delete" onclick="deletarItem('emergencia', ${e.id})">Excluir</button>
                </div>
            </td>
        </tr>
        `;
    }
    corpo.innerHTML = html;
}

// modal
let tipoAtual = '';
let idAtual = null;

function abrirModalAdicionar(tipo) {
    tipoAtual = tipo;
    idAtual = null;

    let titulos = {
        'hospital': 'Adicionar Hospital',
        'centro': 'Adicionar Centro de Saúde',
        'farmacia': 'Adicionar Farmácia',
        'emergencia': 'Adicionar Contato de Emergência'
    };

    document.getElementById('tituloModal').textContent = titulos[tipo];
    mostrarCamposFormulario(tipo);
    document.getElementById('modal').classList.add('active');
}

function mostrarCamposFormulario(tipo) {
    let campos = document.getElementById('camposFormulario');

    if (tipo == 'hospital' || tipo == 'centro') {
        campos.innerHTML = `
            <div class="form-group">
                <label>Nome *</label>
                <input type="text" id="nome" required>
            </div>
            <div class="form-group">
                <label>Endereço *</label>
                <input type="text" id="endereco" required>
            </div>
            <div class="form-group">
                <label>Telefone *</label>
                <input type="tel" id="telefone" required>
            </div>
            <div class="form-group">
                <label>Horário de Funcionamento *</label>
                <input type="text" id="horario" placeholder="Ex: 24 horas ou 07:00 - 15:30" required>
            </div>
            <div class="form-group">
                <label>Serviços Oferecidos</label>
                <textarea id="servicos" placeholder="Ex: Emergência, Cirurgia, Consultas..."></textarea>
            </div>
        `;
    } else if (tipo == 'farmacia') {
        campos.innerHTML = `
            <div class="form-group">
                <label>Nome *</label>
                <input type="text" id="nome" required>
            </div>
            <div class="form-group">
                <label>Endereço *</label>
                <input type="text" id="endereco" required>
            </div>
            <div class="form-group">
                <label>Telefone *</label>
                <input type="tel" id="telefone" required>
            </div>
            <div class="form-group">
                <label>Horário de Funcionamento *</label>
                <input type="text" id="horario" placeholder="Ex: 08:00 - 20:00" required>
            </div>
            <div class="form-group">
                <label>Plantão</label>
                <select id="plantao">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>
        `;
    } else if (tipo == 'emergencia') {
        campos.innerHTML = `
            <div class="form-group">
                <label>Nome do Serviço *</label>
                <input type="text" id="nome" required>
            </div>
            <div class="form-group">
                <label>Tipo *</label>
                <select id="tipo" required>
                    <option value="">Selecione...</option>
                    <option value="Ambulância">Ambulância</option>
                    <option value="Bombeiros">Bombeiros</option>
                    <option value="Polícia">Polícia</option>
                    <option value="Resgate">Resgate</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>
            <div class="form-group">
                <label>Telefone *</label>
                <input type="tel" id="telefone" required>
            </div>
            <div class="form-group">
                <label>Disponibilidade *</label>
                <input type="text" id="disponibilidade" placeholder="Ex: 24/7" required>
            </div>
        `;
    }
}

function editarItem(tipo, id) {
    tipoAtual = tipo;
    idAtual = id;

    let chaveStorage = tipo == 'hospital' ? 'hospitais' :
        tipo == 'centro' ? 'centros' :
            tipo == 'farmacia' ? 'farmacias' : 'emergencias';

    let itens = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    let item = null;

    for (let i = 0; i < itens.length; i++) {
        if (itens[i].id == id) {
            item = itens[i];
            break;
        }
    }

    if (!item) return;

    let titulos = {
        'hospital': 'Editar Hospital',
        'centro': 'Editar Centro de Saúde',
        'farmacia': 'Editar Farmácia',
        'emergencia': 'Editar Contato de Emergência'
    };

    document.getElementById('tituloModal').textContent = titulos[tipo];
    mostrarCamposFormulario(tipo);

    // preencher campos
    document.getElementById('nome').value = item.nome;
    if (tipo != 'emergencia') {
        document.getElementById('endereco').value = item.endereco;
    }
    document.getElementById('telefone').value = item.telefone;

    if (tipo == 'hospital' || tipo == 'centro') {
        document.getElementById('horario').value = item.horario;
        if (item.servicos) document.getElementById('servicos').value = item.servicos;
    } else if (tipo == 'farmacia') {
        document.getElementById('horario').value = item.horario;
        document.getElementById('plantao').value = item.plantao;
    } else if (tipo == 'emergencia') {
        document.getElementById('tipo').value = item.tipo;
        document.getElementById('disponibilidade').value = item.disponibilidade;
    }

    document.getElementById('modal').classList.add('active');
}

function fecharModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('formularioItem').reset();
    tipoAtual = '';
    idAtual = null;
}

// submit form
document.getElementById('formularioItem').addEventListener('submit', function (e) {
    e.preventDefault();

    let chaveStorage = tipoAtual == 'hospital' ? 'hospitais' :
        tipoAtual == 'centro' ? 'centros' :
            tipoAtual == 'farmacia' ? 'farmacias' : 'emergencias';

    let itens = JSON.parse(localStorage.getItem(chaveStorage) || '[]');

    let dadosFormulario = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value
    };

    if (tipoAtual == 'hospital' || tipoAtual == 'centro') {
        dadosFormulario.endereco = document.getElementById('endereco').value;
        dadosFormulario.horario = document.getElementById('horario').value;
        dadosFormulario.servicos = document.getElementById('servicos') ? document.getElementById('servicos').value : '';
    } else if (tipoAtual == 'farmacia') {
        dadosFormulario.endereco = document.getElementById('endereco').value;
        dadosFormulario.horario = document.getElementById('horario').value;
        dadosFormulario.plantao = document.getElementById('plantao').value;
    } else if (tipoAtual == 'emergencia') {
        dadosFormulario.tipo = document.getElementById('tipo').value;
        dadosFormulario.disponibilidade = document.getElementById('disponibilidade').value;
    }

    if (idAtual) {
        // editar
        for (let i = 0; i < itens.length; i++) {
            if (itens[i].id == idAtual) {
                itens[i] = Object.assign(itens[i], dadosFormulario);
                break;
            }
        }
    } else {
        // adicionar
        let novoId = 1;
        if (itens.length > 0) {
            let maiorId = 0;
            for (let i = 0; i < itens.length; i++) {
                if (itens[i].id > maiorId) maiorId = itens[i].id;
            }
            novoId = maiorId + 1;
        }
        dadosFormulario.id = novoId;
        itens.push(dadosFormulario);
    }

    localStorage.setItem(chaveStorage, JSON.stringify(itens));

    fecharModal();
    carregarTabelas();
    atualizarContadores();

    alert(idAtual ? 'Item atualizado com sucesso!' : 'Item adicionado com sucesso!');
});

// deletar
function deletarItem(tipo, id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    let chaveStorage = tipo == 'hospital' ? 'hospitais' :
        tipo == 'centro' ? 'centros' :
            tipo == 'farmacia' ? 'farmacias' : 'emergencias';

    let itens = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    let novosItens = [];

    for (let i = 0; i < itens.length; i++) {
        if (itens[i].id != id) {
            novosItens.push(itens[i]);
        }
    }

    localStorage.setItem(chaveStorage, JSON.stringify(novosItens));

    carregarTabelas();
    atualizarContadores();
    alert('Item excluído com sucesso!');
}

// fechar modal clicando fora
document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target == this) {
        fecharModal();
    }
});

// inicializar
if (checkAuth()) {
    carregarInfoUsuario();
    inicializarDados();
    atualizarContadores();
    carregarTabelas();
}