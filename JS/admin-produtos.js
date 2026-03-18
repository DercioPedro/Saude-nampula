// ==================== VERIFICAÇÃO DE AUTENTICAÇÃO ====================
(function verificarAutenticacao() {
    // Verificar se há sessão ativa
    let sessao = localStorage.getItem('sessaoFarmacia');

    if (!sessao) {
        // Não está logado, redirecionar para login
        window.location.href = 'login-farmacia.html';
        return;
    }

    // Verificar se a sessão expirou (8 horas)
    sessao = JSON.parse(sessao);
    let agora = Date.now();
    let tempoSessao = agora - sessao.timestamp;
    let tempoLimite = 8 * 60 * 60 * 1000; // 8 horas

    if (tempoSessao > tempoLimite) {
        // Sessão expirada
        localStorage.removeItem('sessaoFarmacia');
        window.location.href = 'login-farmacia.html';
        return;
    }

    // Salvar dados da sessão globalmente
    window.sessaoAtual = sessao;
})();

// ==================== VARIÁVEIS GLOBAIS ====================
let farmacias = [];
let produtos = [];
let farmaciaAtual = null;

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function () {
    carregarDadosIniciais();
});

function carregarDadosIniciais() {
    // Carregar farmácias
    let dadosFarmacias = localStorage.getItem('farmacias');
    farmacias = dadosFarmacias ? JSON.parse(dadosFarmacias) : [];

    // Encontrar farmácia atual baseada na sessão
    farmaciaAtual = farmacias.find(f => (f.id || f.nome) == window.sessaoAtual.farmaciaId);

    if (!farmaciaAtual) {
        mostrarToast('Erro: Farmácia não encontrada', 'erro');
        return;
    }

    // Mostrar informações da farmácia no cabeçalho
    mostrarInfoFarmacia();

    // Carregar produtos
    carregarProdutos();

    // Carregar produtos da farmácia
    carregarProdutosDaFarmacia();
}

function mostrarInfoFarmacia() {
    let header = document.getElementById('farmaciaInfoHeader');

    let plantaoTexto = farmaciaAtual.plantao ? '🟢 Plantão 24h' : '🕒 Horário Comercial';
    let plantaoCor = farmaciaAtual.plantao ? '#dbeafe' : '#d1fae5';
    let plantaoCorTexto = farmaciaAtual.plantao ? '#1e40af' : '#047857';

    header.innerHTML = `
                <div>
                    <h3>
                        <span style="font-size: 28px;"><img src="/img/comprimidos.png" alt="Farmácia"></span> 
                        ${farmaciaAtual.nome}
                    </h3>
                    <p style="margin-top: 5px;">
                        <span> <img src="/img/ponto.png" alt="Mapa"> ${farmaciaAtual.endereco || 'Endereço não informado'}</span>
                        <span style="margin-left: 15px;"> <img src="/img/call.png" alt="Telefone"> ${farmaciaAtual.telefone || 'Telefone não informado'}</span>
                    </p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="background: ${plantaoCor}; color: ${plantaoCorTexto}; padding: 8px 16px; border-radius: 20px; font-weight: 600;">
                        ${plantaoTexto}
                    </span>
                    <button class="btn-logout" onclick="fazerLogout()">
                         Sair
                    </button>
                </div>
            `;
}

function carregarProdutos() {
    let dados = localStorage.getItem('produtos');
    produtos = dados ? JSON.parse(dados) : [];
}

function carregarProdutosDaFarmacia() {
    // Filtrar produtos apenas da farmácia atual
    let produtosFarmacia = produtos.filter(p => p.farmaciaId == window.sessaoAtual.farmaciaId);

    if (produtosFarmacia.length === 0) {
        document.getElementById('produtosContainer').innerHTML = `
                    <div class="empty-state">
                        <span style="font-size: 48px;"></span>
                        <p>Nenhum produto cadastrado</p>
                        <small>Clique em "Adicionar Novo Produto" para começar</small>
                    </div>
                `;
        return;
    }

    renderizarTabelaProdutos(produtosFarmacia);
}

function renderizarTabelaProdutos(produtosLista) {
    let container = document.getElementById('produtosContainer');
    let filtroCategoria = document.getElementById('filtroCategoria').value;

    // Aplicar filtro de categoria
    if (filtroCategoria) {
        produtosLista = produtosLista.filter(p => p.categoria === filtroCategoria);
    }

    if (produtosLista.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum produto encontrado com o filtro selecionado</div>';
        return;
    }

    let tabela = `
                <table class="tabela-produtos">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Categoria</th>
                            <th>Preço (MZN)</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

    for (let i = 0; i < produtosLista.length; i++) {
        let p = produtosLista[i];
        let statusClass = 'status-disponivel';
        let statusText = 'Disponível';

        if (p.quantidade <= 0) {
            statusClass = 'status-indisponivel';
            statusText = 'Indisponível';
        } else if (p.quantidade < 10) {
            statusClass = 'status-baixo';
            statusText = 'Stock Baixo';
        }

        tabela += `
                    <tr>
                        <td>
                            <strong>${p.nome}</strong><br>
                            <small style="color: #6b7280;">${p.fabricante || ''}</small>
                        </td>
                        <td>${p.categoria || 'Medicamento'}</td>
                        <td><strong>${p.preco} MZN</strong></td>
                        <td>${p.quantidade} unid.</td>
                        <td><span class="status-stock ${statusClass}">${statusText}</span></td>
                        <td class="acoes-produto">
                            <button class="btn-editar" onclick="editarProduto('${p.id}')"> Editar</button>
                            <button class="btn-excluir" onclick="excluirProduto('${p.id}')"> Excluir</button>
                        </td>
                    </tr>
                `;
    }

    tabela += `
                    </tbody>
                </table>
            `;

    container.innerHTML = tabela;
}

function filtrarProdutos() {
    carregarProdutosDaFarmacia();
}

// ==================== FUNÇÕES DE FORMULÁRIO ====================
function mostrarFormularioProduto() {
    document.getElementById('formTitulo').innerHTML = '➕ Adicionar Novo Produto';
    document.getElementById('produtoId').value = '';
    document.getElementById('farmaciaId').value = window.sessaoAtual.farmaciaId;
    document.getElementById('produtoNome').value = '';
    document.getElementById('produtoCategoria').value = '';
    document.getElementById('produtoPreco').value = '';
    document.getElementById('produtoQuantidade').value = '';
    document.getElementById('produtoFabricante').value = '';
    document.getElementById('produtoValidade').value = '';
    document.getElementById('produtoDescricao').value = '';

    document.getElementById('formProduto').classList.add('ativo');

    // Rolar até o formulário
    document.getElementById('formProduto').scrollIntoView({ behavior: 'smooth' });
}

function fecharFormularioProduto() {
    document.getElementById('formProduto').classList.remove('ativo');
}

function editarProduto(id) {
    let produto = produtos.find(p => p.id == id);
    if (!produto) return;

    document.getElementById('formTitulo').innerHTML = ' Editar Produto';
    document.getElementById('produtoId').value = produto.id;
    document.getElementById('farmaciaId').value = produto.farmaciaId;
    document.getElementById('produtoNome').value = produto.nome || '';
    document.getElementById('produtoCategoria').value = produto.categoria || '';
    document.getElementById('produtoPreco').value = produto.preco || '';
    document.getElementById('produtoQuantidade').value = produto.quantidade || '';
    document.getElementById('produtoFabricante').value = produto.fabricante || '';
    document.getElementById('produtoValidade').value = produto.validade || '';
    document.getElementById('produtoDescricao').value = produto.descricao || '';

    document.getElementById('formProduto').classList.add('ativo');
    document.getElementById('formProduto').scrollIntoView({ behavior: 'smooth' });
}

// ==================== FUNÇÕES CRUD ====================
function salvarProduto() {
    // Validar campos obrigatórios
    let nome = document.getElementById('produtoNome').value.trim();
    let categoria = document.getElementById('produtoCategoria').value;
    let preco = document.getElementById('produtoPreco').value;
    let quantidade = document.getElementById('produtoQuantidade').value;
    let farmaciaId = document.getElementById('farmaciaId').value;

    if (!nome) {
        mostrarToast('Por favor, insira o nome do produto', 'erro');
        return;
    }

    if (!categoria) {
        mostrarToast('Por favor, selecione uma categoria', 'erro');
        return;
    }

    if (!preco || preco <= 0) {
        mostrarToast('Por favor, insira um preço válido', 'erro');
        return;
    }

    if (!quantidade || quantidade < 0) {
        mostrarToast('Por favor, insira uma quantidade válida', 'erro');
        return;
    }

    let produtoId = document.getElementById('produtoId').value;

    let produto = {
        id: produtoId || Date.now().toString(),
        farmaciaId: farmaciaId,
        nome: nome,
        categoria: categoria,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade),
        fabricante: document.getElementById('produtoFabricante').value.trim(),
        validade: document.getElementById('produtoValidade').value,
        descricao: document.getElementById('produtoDescricao').value.trim(),
        dataCadastro: new Date().toISOString()
    };

    if (produtoId) {
        // Atualizar produto existente
        let index = produtos.findIndex(p => p.id == produtoId);
        if (index !== -1) {
            produtos[index] = produto;
        }
    } else {
        // Adicionar novo produto
        produtos.push(produto);
    }

    // Salvar no localStorage
    localStorage.setItem('produtos', JSON.stringify(produtos));

    // Atualizar medicamentos da farmácia para compatibilidade
    atualizarMedicamentosDaFarmacia();

    mostrarToast('Produto salvo com sucesso!');
    fecharFormularioProduto();
    carregarProdutosDaFarmacia();
}

function excluirProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }

    let index = produtos.findIndex(p => p.id == id);
    if (index !== -1) {
        produtos.splice(index, 1);
        localStorage.setItem('produtos', JSON.stringify(produtos));

        // Atualizar medicamentos da farmácia
        atualizarMedicamentosDaFarmacia();

        mostrarToast('Produto excluído com sucesso!');
        carregarProdutosDaFarmacia();
    }
}

// ==================== FUNÇÕES AUXILIARES ====================
function atualizarMedicamentosDaFarmacia() {
    // Manter compatibilidade com a estrutura antiga
    let produtosFarmacia = produtos.filter(p => p.farmaciaId == window.sessaoAtual.farmaciaId);

    if (farmaciaAtual) {
        // Converter produtos para o formato antigo de medicamentos
        let medicamentos = produtosFarmacia.map(p =>
            `${p.nome} - ${p.preco} MZN`
        );

        farmaciaAtual.medicamentos = medicamentos;

        // Salvar farmácias atualizadas
        localStorage.setItem('farmacias', JSON.stringify(farmacias));
    }
}

function fazerLogout() {
    localStorage.removeItem('sessaoFarmacia');
    window.location.href = 'login-farmacia.html';
}

function mostrarToast(mensagem, tipo = 'sucesso') {
    let toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = 'toast mostrar';

    if (tipo === 'erro') {
        toast.classList.add('erro');
    }

    setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 3000);
}

// ==================== EXPOR FUNÇÕES GLOBAIS ====================
window.mostrarFormularioProduto = mostrarFormularioProduto;
window.fecharFormularioProduto = fecharFormularioProduto;
window.salvarProduto = salvarProduto;
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
window.filtrarProdutos = filtrarProdutos;
window.fazerLogout = fazerLogout;