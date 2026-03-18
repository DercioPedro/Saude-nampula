const loginForm = document.getElementById('loginForm');
const alertDiv = document.getElementById('alert');

// Credenciais padrão (em produção, isso viria de um servidor)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

function showAlert(message, type) {
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.display = 'block';

    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 3000);
}

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validação simples
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Salvar sessão
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
        localStorage.setItem('loginTime', new Date().toISOString());

        showAlert('Login realizado com sucesso! Redirecionando...', 'success');

        // Redirecionar para painel
        setTimeout(() => {
            window.location.href = 'admin-panel.html';
        }, 1000);
    } else {
        showAlert('Usuário ou senha incorretos!', 'error');
        document.getElementById('password').value = '';
    }
});

// Verificar se já está logado
if (localStorage.getItem('adminLoggedIn') === 'true') {
    window.location.href = 'admin-panel.html';
}