
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const addButton = document.getElementById('add-button');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    const idInput = document.getElementById('id');
    const loginInput = document.getElementById('login');
    const senhaInput = document.getElementById('senha');
    const userTableBody = document.querySelector('#user-table tbody');

    let users = []; 
    let nextId; 
    let selectedUserId = null;

    
    if (!localStorage.getItem("tds")) {
        let dadosIniciais = [
            { id: 1, login: "will", senha: "123", imagem: "https://via.placeholder.com/80?text=Will" },
            { id: 2, login: "bob", senha: "2222", imagem: "https://via.placeholder.com/80?text=Bob" },
            { id: 3, login: "ringo", senha: "3333", imagem: "https://via.placeholder.com/80?text=Ringo" }
        ];
        localStorage.setItem("tds", JSON.stringify(dadosIniciais));
        console.log("Dados iniciais 'tds' armazenados no localStorage.");
    } else {
        console.log("Dados 'tds' já existem no localStorage.");
    }

    
    users = JSON.parse(localStorage.getItem("tds")) || [];
    
    nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    

    
    function renderUserTable(data) {
        userTableBody.innerHTML = '';
        data.forEach(user => {
            const row = userTableBody.insertRow();
            row.dataset.userId = user.id;
            const idCell = row.insertCell();
            const loginCell = row.insertCell();
            const senhaCell = row.insertCell();
            
            idCell.textContent = user.id;
            loginCell.textContent = user.login;
            senhaCell.textContent = '********'; 
            row.addEventListener('click', () => selectUser(user));
        });
    }

    
    function selectUser(user) {
        selectedUserId = user.id;
        idInput.value = user.id;
        loginInput.value = user.login;
        senhaInput.value = user.senha; 
    }

    
    function clearForm() {
        idInput.value = '';
        loginInput.value = '';
        senhaInput.value = '';
        selectedUserId = null; 
    }

    
    function updateLocalStorage() {
        localStorage.setItem("tds", JSON.stringify(users));
    }

    
    addButton.addEventListener('click', function() {
        const login = loginInput.value.trim();
        const senha = senhaInput.value;

        if (login && senha) {
            
            if (users.some(user => user.login === login)) {
                alert('Já existe um usuário com este login.');
                return;
            }

            const newUser = { id: nextId++, login: login, senha: senha, imagem: "https://via.placeholder.com/80?text=Novo" }; // Adiciona imagem padrão
            users.push(newUser);
            renderUserTable(users);
            updateLocalStorage();
            clearForm();
            alert('Usuário cadastrado com sucesso!');
        } else {
            alert('Por favor, preencha login e senha.');
        }
    });

    
    updateButton.addEventListener('click', function() {
        if (selectedUserId) {
            const login = loginInput.value.trim();
            const senha = senhaInput.value;
            const index = users.findIndex(user => user.id === selectedUserId);

            if (index !== -1) {
                
                if (users.some((user, i) => user.login === login && i !== index)) {
                    alert('Já existe outro usuário com este login.');
                    return;
                }

                users[index].login = login;
                users[index].senha = senha;
                
                renderUserTable(users);
                updateLocalStorage();
                clearForm();
                alert('Usuário atualizado com sucesso!');
            } else {
                alert('Usuário não encontrado para atualização.');
            }
        } else {
            alert('Por favor, selecione um usuário para atualizar.');
        }
    });

    
    deleteButton.addEventListener('click', function() {
        if (selectedUserId) {
            if (confirm('Tem certeza que deseja apagar este usuário?')) {
                users = users.filter(user => user.id !== selectedUserId);
                renderUserTable(users);
                updateLocalStorage();
                clearForm();
                alert('Usuário apagado com sucesso!');
            }
        } else {
            alert('Por favor, selecione um usuário para apagar.');
        }
    });

    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            renderUserTable(users); 
            return;
        }
        const filteredUsers = users.filter(user =>
            user.id.toString().includes(searchTerm) ||
            user.login.toLowerCase().includes(searchTerm) ||
            user.senha.toLowerCase().includes(searchTerm) 
        );
        renderUserTable(filteredUsers);
    });

    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Escape' && searchInput.value !== '') {
            searchInput.value = '';
            renderUserTable(users);
        }
    });

    
    renderUserTable(users);
});


document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.matches('#search-input')) {
        document.getElementById('search-button').click();
    }
});