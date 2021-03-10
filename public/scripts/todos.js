// Define self como this
let self = this;

// Cria os elementos
self.labels = document.querySelector('#app .labels');
self.clear = document.querySelector('#app .cp');
self.listElement = document.querySelector('#app ul');
self.inputElement = document.querySelector('#app input');
self.buttonElement = document.querySelector('#app button');
self.nameUser = document.querySelector('#user');
self.loader = document.querySelector('#loader');

// Styles labels
Object.assign(self.labels.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
});

self.todos = JSON.parse(localStorage.getItem('list_todos')) || [ ];

function renderTodos() {
    self.listElement.innerHTML = "";

    if(self.todos.length > 0) {
        self.nameUser.classList.remove('hd');
        self.nameUser.innerHTML = `Repositórios de ${JSON.parse(localStorage.getItem('user'))}`
    } else {
        self.nameUser.classList.add('hd');
    }

    self.todos.forEach((todo, index) => {   
        self.todoElement = document.createElement('li');
        self.rowTodo = document.createElement('div');
        self.text = document.createElement('div');
        self.linkElement = document.createElement('a');
        self.contentIndex = document.createElement('span');
        self.todoIndex = document.createTextNode(`${index + 1}. `);
        self.todoText = document.createTextNode(`${todo.description}`);

        self.contentIndex.classList.add('tx-b');
        self.rowTodo.classList.add('row', 'gt-md', 'al-it-c', 'pt-xs');
        self.text.classList.add('col-auto', 'pd-sm');
        self.linkElement.classList.add('link-animated', 'pb-xs', 'rl', 'ml-1');

        Object.assign(self.text.style, {
            paddingLeft: 0,
            maxWidth: 'fit-content',
            lineHeight: '30px'
        });

        self.linkElement.setAttribute('href', '#');

        self.pos = todos.indexOf(todo);
        self.linkElement.setAttribute('onclick', 'onRemove('+ pos +')')

        self.linkText = document.createTextNode('Excluir');

        self.contentIndex.appendChild(self.todoIndex);
        self.text.appendChild(self.contentIndex);
        self.text.appendChild(self.todoText);
        self.rowTodo.appendChild(self.text);
        self.todoElement.appendChild(self.rowTodo);
        self.listElement.appendChild(self.todoElement);
        self.linkElement.appendChild(self.linkText);
        self.text.appendChild(self.linkElement);
        self.todoElement.appendChild(self.rowTodo);
    });
}

function addTodo() {
    self.todoText = inputElement.value;
    self.listElement.innerHTML = "";
    self.loader.classList.remove('hd');
    self.nameUser.classList.add('hd');

    if(self.rowError) {
        self.rowError.remove();
    }

    if(self.todoText == '') {
        self.loader.classList.add('hd');
        self.ipError = document.querySelector('.error');

        self.rowError = document.createElement('div');
        self.required = document.createElement('div');

        self.rowError.classList.add('row', 'jf-ct-c', 'al-it-c');
        self.required.classList.add('col-12', 'mt-xs', 'tx-dg', 'tx-c', 'tx-sm');

        self.required.innerHTML = 'Campo Obrigatório!';

        self.rowError.appendChild(required);
        self.ipError.appendChild(rowError);

        self.inputElement.classList.add('bd-cl-dg');
        
        setTimeout(function() {
            self.rowError.remove();
            self.inputElement.classList.remove('bd-cl-dg');
        }, 1500);     
    } else {
        axios.get(`https://api.github.com/users/${self.todoText}/repos`)
        .then(
            function(response){
                self.loader.classList.add('hd');
                self.todos = response.data;

                salveToStorage();
                renderTodos();

                inputElement.value = '';
            }
        )
        .catch(
            function(error){
                console.log(error)
            }
        )
    }
}

renderTodos();

self.clear.onclick = onRemove;
self.buttonElement.onclick = addTodo;

self.inputElement.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        addTodo();
    }
});

function onRemove(pos) {
    if(!isNaN(pos)) {
        self.todos.splice(pos, 1);
    } else {
        self.todos = [];
    }

    renderTodos();
    salveToStorage();
}

function salveToStorage() {
    localStorage.setItem('list_todos', JSON.stringify(self.todos));
    localStorage.setItem('user', JSON.stringify(self.inputElement.value));
}