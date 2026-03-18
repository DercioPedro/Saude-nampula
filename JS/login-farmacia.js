// ==================== VARIÁVEIS GLOBAIS ====================
let farmacias = [];
let credenciais = [];
let farmaciaSelecionadaPrimeiroAcesso = null;

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function () {
    carregarFarmacias();
    carregarCredenciais();
});

function carregarFarmacias() {
    let dados = localStorage.getItem('farmacias');
    farmacias = dados ? JSON.parse(dados) : [];

    // Atualizar selects
    atualizarSelectFarmacias('farmaciaSelect');
    atualizarSelectFarmacias('novaFarmaciaSelect');
}

function carregarCredenciais() {
    let dados = localStorage.getItem('credenciaisFarmacias');
    credenciais = dados ? JSON.parse(dados) : [];
}

function atualizarSelectFarmacias(selectId) {
    let select = document.getElementById(selectId);
    if (!select) return;

    if (farmacias.length === 0) {
        select.innerHTML = '<option value="">Nenhuma farmácia disponível</option>';
        return;
    }

    let options = '<option value="">Selecione uma farmácia</option>';
    for (let i = 0; i < farmacias.length; i++) {
        let farmaciaId = farmacias[i].id || i;
        let temCredencial = credenciais.some(c => c.farmaciaId == farmaciaId);

        // Para o select de primeiro acesso, só mostrar farmácias sem senha
        if (selectId === 'novaFarmaciaSelect') {
            if (!temCredencial) {
                options += `<option value="${farmaciaId}">${farmacias[i].nome}</option>`;
            }
        } else {
            // Para o select de login, mostrar todas
            options += `<option value="${farmaciaId}">${farmacias[i].nome}</option>`;
        }
    }
    select.innerHTML = options;
}

// ==================== FUNÇÕES DE ABA ====================
function mudarAba(aba) {
    // Atualizar abas
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('ativo'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('ativo'));

    if (aba === 'login') {
        document.querySelector('.tab').classList.add('ativo');
        document.getElementById('abaLogin').classList.add('ativo');
    } else {
        document.querySelectorAll('.tab')[1].classList.add('ativo');
        document.getElementById('abaPrimeiroAcesso').classList.add('ativo');
    }
}

// ==================== FUNÇÕES DE LOGIN ====================
function fazerLogin() {
    let farmaciaId = document.getElementById('farmaciaSelect').value;
    let senha = document.getElementById('senha').value;

    if (!farmaciaId) {
        mostrarErro('Selecione sua farmácia');
        return;
    }

    if (!senha) {
        mostrarErro('Digite sua senha');
        return;
    }

    // Buscar credencial
    let credencial = credenciais.find(c => c.farmaciaId == farmaciaId);

    if (!credencial) {
        mostrarErro('Farmácia sem senha cadastrada. Faça o primeiro acesso.');
        return;
    }

    // Verificar senha
    if (credencial.senha !== senha) {
        mostrarErro('Senha incorreta');
        return;
    }

    // Login bem-sucedido
    let farmacia = farmacias.find(f => (f.id || farmacias.indexOf(f)) == farmaciaId);

    // Salvar sessão
    let sessao = {
        farmaciaId: farmaciaId,
        farmaciaNome: farmacia.nome,
        timestamp: Date.now()
    };
    localStorage.setItem('sessaoFarmacia', JSON.stringify(sessao));

    mostrarSucesso('Login realizado com sucesso! Redirecionando...');

    // Redirecionar para o painel
    setTimeout(() => {
        window.location.href = `admin-produtos.html?farmacia=${encodeURIComponent(farmacia.nome)}&id=${farmaciaId}`;
    }, 1500);
}

// ==================== FUNÇÕES DE PRIMEIRO ACESSO ====================
function mostrarModalPrimeiroAcesso() {
    let farmaciaId = document.getElementById('novaFarmaciaSelect').value;

    if (!farmaciaId) {
        mostrarErro('Selecione sua farmácia');
        return;
    }

    // Verificar se a farmácia já tem senha
    if (credenciais.some(c => c.farmaciaId == farmaciaId)) {
        mostrarErro('Esta farmácia já possui senha cadastrada. Faça login normalmente.');
        return;
    }

    farmaciaSelecionadaPrimeiroAcesso = farmaciaId;

    // Mostrar informações da farmácia
    let farmacia = farmacias.find(f => (f.id || farmacias.indexOf(f)) == farmaciaId);
    document.getElementById('infoFarmaciaEscolhida').innerHTML = `
                <strong>${farmacia.nome}</strong><br>
                <small style="font-weight: normal;">${farmacia.endereco || ''}</small>
            `;

    // Abrir modal
    document.getElementById('modalPrimeiroAcesso').style.display = 'block';

    // Limpar campos
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmarSenha').value = '';
    document.getElementById('modalErro').classList.remove('mostrar');

    // Resetar indicador de força da senha
    document.querySelectorAll('#forcaSenha span').forEach(span => {
        span.style.background = '#e5e7eb';
    });
}

function fecharModalPrimeiroAcesso() {
    document.getElementById('modalPrimeiroAcesso').style.display = 'none';
}

function verificarForcaSenha() {
    let senha = document.getElementById('novaSenha').value;
    let spans = document.querySelectorAll('#forcaSenha span');

    // Resetar cores
    spans.forEach(span => span.style.background = '#e5e7eb');

    if (senha.length === 0) return;

    // Verificar força da senha
    let forca = 0;

    // Tamanho
    if (senha.length >= 8) forca++;

    // Tem números
    if (/\d/.test(senha)) forca++;

    // Tem letras maiúsculas e minúsculas
    if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) forca++;

    // Tem caracteres especiais
    if (/[!@#$%^&*]/.test(senha)) forca++;

    // Aplicar cores
    if (forca >= 3) {
        spans[0].style.background = '#059669'; // forte
        spans[1].style.background = '#059669';
        spans[2].style.background = '#059669';
    } else if (forca >= 2) {
        spans[0].style.background = '#f59e0b'; // média
        spans[1].style.background = '#f59e0b';
    } else if (forca >= 1) {
        spans[0].style.background = '#ef4444'; // fraca
    }
}

function criarSenhaPrimeiroAcesso() {
    let senha = document.getElementById('novaSenha').value;
    let confirmarSenha = document.getElementById('confirmarSenha').value;

    if (!senha || senha.length < 4) {
        mostrarErroModal('A senha deve ter no mínimo 4 caracteres');
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarErroModal('As senhas não coincidem');
        return;
    }

    if (!farmaciaSelecionadaPrimeiroAcesso) {
        mostrarErroModal('Erro: Farmácia não selecionada');
        return;
    }

    // Verificar novamente se já não foi cadastrada (por segurança)
    if (credenciais.some(c => c.farmaciaId == farmaciaSelecionadaPrimeiroAcesso)) {
        mostrarErroModal('Esta farmácia já possui senha cadastrada');
        return;
    }

    // Criar nova credencial
    let novaCredencial = {
        farmaciaId: farmaciaSelecionadaPrimeiroAcesso,
        senha: senha,
        dataCadastro: new Date().toISOString(),
        primeiroAcesso: true
    };

    credenciais.push(novaCredencial);
    localStorage.setItem('credenciaisFarmacias', JSON.stringify(credenciais));

    // Fechar modal
    fecharModalPrimeiroAcesso();

    // Fazer login automático
    let farmacia = farmacias.find(f => (f.id || farmacias.indexOf(f)) == farmaciaSelecionadaPrimeiroAcesso);

    // Salvar sessão
    let sessao = {
        farmaciaId: farmaciaSelecionadaPrimeiroAcesso,
        farmaciaNome: farmacia.nome,
        timestamp: Date.now(),
        primeiroAcesso: true
    };
    localStorage.setItem('sessaoFarmacia', JSON.stringify(sessao));

    mostrarSucesso('Senha criada com sucesso! Redirecionando...');

    // Redirecionar para o painel
    setTimeout(() => {
        window.location.href = `admin-produtos.html?farmacia=${encodeURIComponent(farmacia.nome)}&id=${farmaciaSelecionadaPrimeiroAcesso}`;
    }, 1500);
}

// ==================== FUNÇÕES AUXILIARES ====================
function mostrarErro(mensagem) {
    let erroDiv = document.getElementById('erroMensagem');
    erroDiv.textContent = mensagem;
    erroDiv.classList.add('mostrar');

    setTimeout(() => {
        erroDiv.classList.remove('mostrar');
    }, 3000);
}

function mostrarErroModal(mensagem) {
    let erroDiv = document.getElementById('modalErro');
    erroDiv.textContent = mensagem;
    erroDiv.classList.add('mostrar');

    setTimeout(() => {
        erroDiv.classList.remove('mostrar');
    }, 3000);
}

function mostrarSucesso(mensagem) {
    let sucessoDiv = document.getElementById('sucessoMensagem');
    sucessoDiv.textContent = mensagem;
    sucessoDiv.classList.add('mostrar');

    setTimeout(() => {
        sucessoDiv.classList.remove('mostrar');
    }, 3000);
}

// Fechar modal ao clicar fora
window.onclick = function (event) {
    let modal = document.getElementById('modalPrimeiroAcesso');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// ==================== EXPOR FUNÇÕES ====================
window.mudarAba = mudarAba;
window.fazerLogin = fazerLogin;
window.mostrarModalPrimeiroAcesso = mostrarModalPrimeiroAcesso;
window.fecharModalPrimeiroAcesso = fecharModalPrimeiroAcesso;
window.verificarForcaSenha = verificarForcaSenha;
window.criarSenhaPrimeiroAcesso = criarSenhaPrimeiroAcesso;