document.addEventListener('DOMContentLoaded', function() {
  var addUserBtn = document.querySelector('.add-user-btn');
  var modal = document.getElementById('add-user-modal');
  var closeModal = document.querySelector('.close-modal');
  var addUserForm = document.querySelector('.add-user-form');
  var userList = document.getElementById('user-list');

  addUserBtn.addEventListener('click', function() {
    modal.style.display = 'block';
  });

  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
  // função de adcionar usuário
  document.getElementById('add-user-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var userType = document.getElementById('user-type').value;
    var password = document.getElementById('password').value;
    var login = document.getElementById('login').value;
    var photoInput = document.getElementById('photo');
    var photoFile = photoInput.files[0];
  
    var formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('user-type', userType);
    formData.append('password', password);
    formData.append('login', login);
    formData.append('photo', photoFile);

    addUser(formData);
  });
// função de adcionar usuário   
  function addUser(userData) {
    fetch('/add_user', {
      method: 'POST',
      body: userData
    })
      .then(function(response) {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Erro ao adicionar usuário.');
        }
      })
      .then(function(data) {
        if (data === 'Success') {
          // Limpar o formulário
          document.getElementById('name').value = '';
          document.getElementById('email').value = '';
          document.getElementById('user-type').value = '';
          document.getElementById('password').value = '';
          document.getElementById('login').value = '';
          document.getElementById('photo').value = '';
  
          // Fechar o modal
          modal.style.display = 'none';
  
          // Atualizar a lista de usuários
          loadUsers();
  
          // Exibir uma mensagem de sucesso
         
        } else {
          throw new Error('Erro ao adicionar usuário.');
        }
      })
      .catch(function(error) {
        console.error('Erro:', error);
     
      });
  }
// função de excluir usuário 
function deleteUser(login) {
  fetch('/users/delete/' +login, {
    method: 'POST'
  })
    .then(function(response) {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Erro ao excluir usuário.');
      }
    })
    .then(function(data) {
      if (data === 'Success') {
        // Atualizar a lista de usuários
        loadUsers();

        // Exibir uma mensagem de sucesso
      
      } else {
        throw new Error('Erro ao excluir usuário.');
      }
    })
    .catch(function(error) {
      console.error('Erro:', error);
     
    });
}

// Botões de exclusão e edição
function createUserContainer(user) {
  var userContainer = document.createElement('div');
  userContainer.classList.add('user-container');
  userContainer.innerHTML = `
  ${user.photo ? `<img src="data:image/jpeg;base64,${user.photo}" alt="${user.name} Photo">` : '<img src="/static/unnamed.png" alt="Default Photo">'}
    <p>${user.login}</p>
    <h3>${user.name}</h3>
    <p>${user.email}</p>
    <p>${user.user_type}</p>
    
      
    <div class="user-actions">
      <button class="edit-user-btn" data-user-login="${user.login}"><i class='bx bxs-pencil'></i></button>
      <button class="delete-user-btn" data-user-login="${user.login}"><i class='bx bxs-trash-alt'></i></button>
    </div>
  `;
  return userContainer;
}

// Função para exibir o modal de confirmação antes de excluir o usuário
function openDeleteModal(login) {
  var modalElement = document.getElementById('modal_confirm');
  modalElement.style.display = 'block';

  // Definir o ID do usuário a ser excluído no campo oculto do modal
  var deleteUserloginInput = document.getElementById('delete-user-login');
  if (deleteUserloginInput) {
    deleteUserloginInput.value = login;
  }

  // Associar a função deleteUser diretamente ao botão "Excluir" no modal
  var deleteButton = document.querySelector('#modal_confirm .modal-footer .btn-danger');
  deleteButton.addEventListener('click', function() {
    // Chamar diretamente a função deleteUser passando o ID do usuário
    deleteUser(login);
    // Fechar o modal automaticamente
    modalElement.style.display = 'none';
  });

  // Associar a função closeModal ao botão "Cancelar" no modal
  var cancelButton = document.querySelector('#modal_confirm .modal-footer .btn-secondary');
  cancelButton.addEventListener('click', function() {
    // Fechar o modal
    modalElement.style.display = 'none';
  });
}

// Função para fechar o modal de confirmação
function closeModal() {
  var modalElement = document.getElementById('modal_confirm');
  modalElement.style.display = 'none';
}

// Variável de estado para acompanhar a ordem atual
let ascending_order = true;

// Função para alternar a ordem dos usuários
function toggleOrder() {
  // Inverter o estado da variável para a próxima chamada
  ascending_order = !ascending_order;

  // Faça uma solicitação AJAX para o endpoint de ordenação
  fetch(`/users_ordered?ascending=${ascending_order}`)
    .then((response) => response.json())
    .then((data) => {
      // Limpe a lista existente
      const userList = document.getElementById('user-list');
      userList.innerHTML = '';

      // Preencha a lista com os usuários obtidos da solicitação
      data.users.forEach((user) => {
        const userContainer = createUserContainer(user);
        userList.appendChild(userContainer);
      });
    })
    .catch((error) => {
      console.error('Erro ao alternar a ordem dos usuários:', error);
    });
}

// Adicione um ouvinte de evento ao botão
const toggleButton = document.getElementById('toggleOrderButton');
toggleButton.addEventListener('click', toggleOrder);



// Função para atualizar a lista de usuários na página
function clearUsersList() {
  const userContainer = document.getElementById('user-list');
  userContainer.innerHTML = '';
}
// Função para vincular eventos de clique aos botões de edição e exclusão
function bindEditDeleteEvents() {
  const editButtons = document.getElementsByClassName('edit-user-btn');
  for (const button of editButtons) {
    button.addEventListener('click', function() {
      const userlogin = this.getAttribute('data-user-login');
      openEditUserModal(userlogin);
    });
  }

  const deleteButtons = document.getElementsByClassName('delete-user-btn');
  for (const button of deleteButtons) {
    button.addEventListener('click', function() {
      const userlogin = this.getAttribute('data-user-login');
      openDeleteModal(userlogin);
    });
  }
}

// Função para limpar a lista de usuários
function clearUsersList() {
  const userContainer = document.getElementById('user-list');
  userContainer.innerHTML = '';
}

// Função para atualizar a lista de usuários na página
function updateUsersList(users) {
  clearUsersList(); // Limpar a lista atual

  for (const user of users) {
    const userDiv = createUserContainer(user); // Chamando a função createUserContainer para criar o conteúdo de cada usuário
    const userContainer = document.getElementById('user-list');
    userContainer.appendChild(userDiv);
  }

  bindEditDeleteEvents(); // Vincular eventos de clique novamente após a atualização da lista de usuários
}





// Função para fazer a busca dos usuários usando AJAX
function searchUsers(query) {
  fetch(`/search3?u=${query}`)
    .then(response => response.json())
    .then(data => {
      const users = data.users;
      updateUsersList(users);
    })
    .catch(error => console.error('Erro ao buscar usuários:', error));
}

// Event listener para o formulário de busca
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const searchInput = document.querySelector('.search-input');
  const searchQuery = searchInput.value;
  searchUsers(searchQuery);
});

    
    
    
  
  // função de carregar usuários 
  function loadUsers() {
    fetch('/users')
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erro ao obter a lista de usuários.');
        }
      })
      .then(function(data) {
        var userList = document.getElementById('user-list');
        userList.innerHTML = '';
        data.users.forEach(function(user) {
          var userContainer = createUserContainer(user);
          userList.appendChild(userContainer);
        });
        
       
        
        var editButtons = document.getElementsByClassName('edit-user-btn');
        for (var i = 0; i < editButtons.length; i++) {
          var button = editButtons[i];
          button.addEventListener('click', function() {
            var userlogin = this.getAttribute('data-user-login');
            openEditUserModal(userlogin);
          });
        }
        // função de editar usuário 
        document.getElementById('edit-user-form').addEventListener('submit', function(event) {
          event.preventDefault();
          var userlogin = this.getAttribute('data-user-login');
          var name = document.getElementById('edit-name').value;
          var email = document.getElementById('edit-email').value;
          var userType = document.getElementById('edit-user-type').value;
          var password = document.getElementById('edit-password').value;
         
          var photoInput = document.getElementById('edit-photo');
          var photoFile = photoInput.files[0];
          
          function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
            const byteCharacters = atob(b64Data);
            const byteArrays = [];
          
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              const slice = byteCharacters.slice(offset, offset + sliceSize);
          
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
          
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
          
            const blob = new Blob(byteArrays, { type: contentType });
            return blob;
          }
          
        
          var formData = new FormData();
          formData.append('name', name);
          formData.append('email', email);
          formData.append('user-type', userType);
          formData.append('password', password);
          
        
          // Verificar se um novo arquivo de foto foi selecionado
          if (photoFile) {
            formData.append('photo', photoFile);
          } else {
            // Recuperar a foto atual do usuário e adicioná-la ao formData
            var currentPhoto = document.getElementById('edit-photo-preview').getAttribute('src');
            if (currentPhoto) {
              var photoData = currentPhoto.split(',')[1];
              var photoBlob = b64toBlob(photoData);
              formData.append('photo', photoBlob, 'current_photo.jpg');
            }
          }
        
          updateUser(userlogin, formData);
        });
        
        // função de excluir usuário 
        var deleteButtons = document.getElementsByClassName('delete-user-btn');
for (var i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', function() {
    var userlogin = this.getAttribute('data-user-login');
    openDeleteModal(userlogin);
  });
}
      })
      .catch(function(error) {
        console.error('Erro:', error);
      
      });
  }
  // função de editar usuário MODAL
  function openEditUserModal(login) {
    fetch('/users/' + login)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erro ao obter os dados do usuário.');
        }
      })
      .then(function(data) {
        document.getElementById('edit-name').value = data.name;
        document.getElementById('edit-email').value = data.email;
        document.getElementById('edit-user-type').value = data.user_type;
        document.getElementById('edit-password').value = data.password;
        
        document.getElementById('edit-photo');

        if (data.photo) {
          document.getElementById('edit-photo-preview').src = 'data:image/jpeg;base64,' + data.photo;

        } else {
          document.getElementById('edit-photo-preview').src = ''
        }
        

        
        var editUserModal = document.getElementById('edit-user-modal');
        editUserModal.style.display = 'block';
    
        document.getElementById('edit-user-form').setAttribute('data-user-login', login);
      })
      .catch(function(error) {
        console.error('Erro:', error);
      
      });
  }
  
  // função de editar usuário
function updateUser(login, userData) {
  fetch('/users/' + login, {
    method: 'POST',
    body: userData,
  })
    .then(function (response) {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Erro ao atualizar usuário.');
      }
    })
    .then(function (data) {
      if (data === 'Success') {
        var editUserModal = document.getElementById('edit-user-modal');
        editUserModal.style.display = 'none';

        // Para página não recarregar ao editar, retirar location reload
        // location.reload();
        loadUsers();

   
      } else {
        throw new Error('Erro ao atualizar usuário.');
      }
    })
    .catch(function (error) {
      console.error('Erro:', error);

    });
}

  
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('edit-user-form').addEventListener('submit', function(event) {
      event.preventDefault();
      var userlogin = this.getAttribute('data-user-login');
      var name = document.getElementById('edit-name').value;
      var email = document.getElementById('edit-email').value;
      var userType = document.getElementById('edit-user-type').value;
      var password = document.getElementById('edit-password').value;
      ;
      var photoInput = document.getElementById('edit-photo');
      var photoFile = photoInput.files[0];
  
      var formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('user-type', userType);
      formData.append('password', password);
     
      formData.append('photo', photoFile);
  
      updateUser(userlogin, formData);
    });
  
    
    
        
    
   
    
  });
  




  
  
  
  
// Carregar os usuários ao abrir a página
loadUsers();
  
});
 

  






  

var modal = document.getElementById("add-user-modal");
  var btn = document.querySelector(".add-user-btn");
  var closeBtn = document.querySelector(".close-modal");

  btn.addEventListener("click", function() {
    modal.style.display = "block";
    modal.querySelector('.modal-content').style.display = "block";
  });

  closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
    modal.querySelector('.modal-content').style.display = "none";
  });


/* FECHAR POP-UP EDITAR */ 
function fecharPopUp() {
  var popUp = document.getElementById('edit-user-modal');
  if (popUp) {
    popUp.style.display = 'none';
  }
}




  /* MUDAR O ESTADO PARA FOTO ADICIONADA */ 
  
     function updateFileUploadText(input) {
      var fileUploadText = document.getElementById("file-upload-text");
        if (input.files.length > 0) {
         fileUploadText.textContent = "Imagem adicionada";
        } else {
         fileUploadText.textContent = "Selecionar arquivo";
       }
     }
 



     // Código para fechar o pop-up da página de edição
var closeModal = document.querySelector(".close");
var editUserModal = document.getElementById("edit-user-modal");

closeModal.addEventListener("click", function () {
  editUserModal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == editUserModal) {
    editUserModal.style.display = "none";
  }
});

var closeButton = document.querySelector(".close-button");

closeButton.addEventListener("click", function() {
  var modal = document.getElementById("edit-user-modal");
  modal.style.display = "none";
});







    