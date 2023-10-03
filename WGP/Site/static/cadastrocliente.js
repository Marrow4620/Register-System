document.addEventListener('DOMContentLoaded', function() {
  var addClienteBtn = document.querySelector('.add-cliente-btn');
  var modal = document.getElementById('add-cliente-modal');
  var closeModal = document.querySelector('.close-modal');
  var addClienteForm = document.querySelector('.add-cliente-form');
  var clienteList = document.getElementById('cliente-list');

  addClienteBtn.addEventListener('click', function() {
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
  document.getElementById('add-cliente-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var cpf_cnpj = document.getElementById('cpf_cnpj').value;
    var tipo = document.querySelector('input[name="tipo"]:checked').value; // Obtém o valor selecionado (Física ou Jurídica)
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var cep = document.getElementById('cep').value;
    var pais = document.getElementById('pais').value;
    var uf = document.getElementById('uf').value;
    var cidade = document.getElementById('cidade').value;
    var logradouro = document.getElementById('logradouro').value;
    var bairro = document.getElementById('bairro').value;
    var numero = document.getElementById('numero').value;
    var complemento = document.getElementById('complemento').value;
    var telefone = document.getElementById('telefone').value;
    var data_cadastro = document.getElementById('data_cadastro').value;
    var situacao = document.querySelector('input[name="situacao"]:checked').value; // Obtém o valor selecionado (Ativo ou Inativo)


    var formData = new FormData();
    formData.append('cpf_cnpj', cpf_cnpj);
    formData.append('tipo', tipo);
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('cep', cep);
    formData.append('pais', pais);
    formData.append('uf', uf);
    formData.append('cidade', cidade);
    formData.append('logradouro', logradouro);
    formData.append('bairro', bairro);
    formData.append('numero', numero);
    formData.append('complemento', complemento);
    formData.append('telefone', telefone);
    formData.append('data_cadastro', data_cadastro);
    formData.append('situacao', situacao);

    addCliente(formData);

  });

// função de adcionar usuário   
  function addCliente(clienteData) {
    fetch('/add_cliente', {
      method: 'POST',
      body: clienteData
    })
      .then(function(response) {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Erro ao adicionar cliente.');
        }
      })
      .then(function(data) {
        if (data === 'Success') {
          


          // Limpar o formulário
          document.getElementById('cpf_cnpj').value = '';
          document.querySelector('input[name="tipo"]:checked').checked = true; // Reinicialize o campo de seleção de tipo (Física)
          document.getElementById('nome').value = '';
          document.getElementById('email').value = '';
          document.getElementById('cep').value = '';
          document.getElementById('pais').value = '';
          document.getElementById('uf').value = '';
          document.getElementById('cidade').value = '';
          document.getElementById('logradouro').value = '';
          document.getElementById('bairro').value = '';
          document.getElementById('numero').value = '';
          document.getElementById('complemento').value = '';
          document.getElementById('telefone').value = '';
          document.getElementById('data_cadastro').value = '';
          document.getElementById('situacao').value = '';

  
          // Fechar o modal
          modal.style.display = 'none';
  
          // Atualizar a lista de usuários
          loadClientes();
  
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
function deleteCliente(cpf_cnpj) {
  fetch('/clientes/delete/' +cpf_cnpj, {
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
        loadClientes();

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
function createClienteContainer(cliente) {
  var clienteContainer = document.createElement('div');
  clienteContainer.classList.add('cliente-container');
  clienteContainer.innerHTML = `
    
    <!--    <p>${cliente.cpf_cnpj}</p>  -->
    <h3>${cliente.nome}</h3>
    <p class="initiemail">${cliente.email}</p>
    <p class="cliuf">${cliente.uf}</p> 
    <p class="clicid">${cliente.cidade}</p>
    
    
      
    <div class="cliente-actions">
      <button class="edit-cliente-btn" data-cliente-cpf_cnpj="${cliente.cpf_cnpj}"><i class='bx bxs-pencil'></i></button>
      <button class="delete-cliente-btn" data-cliente-cpf_cnpj="${cliente.cpf_cnpj}"><i class='bx bxs-trash-alt'></i></button>
    </div>
  `;
  return clienteContainer;
}

// Função para exibir o modal de confirmação antes de excluir o usuário
function openDeleteModal(cpf_cnpj) {
  var modalElement = document.getElementById('modal_confirm');
  modalElement.style.display = 'block';

  // Definir o ID do usuário a ser excluído no campo oculto do modal
  var deleteClientecpf_cnpjInput = document.getElementById('delete-cliente-cpf_cnpj');
  if (deleteClientecpf_cnpjInput) {
    deleteClientecpf_cnpjInput.value = cpf_cnpj;
  }

  // Associar a função deleteUser diretamente ao botão "Excluir" no modal
  var deleteButton = document.querySelector('#modal_confirm .modal-footer .btn-danger');
  deleteButton.addEventListener('click', function() {
    // Chamar diretamente a função deleteUser passando o ID do usuário
    deleteCliente(cpf_cnpj);
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



// Função para atualizar a lista de usuários na página
function clearClientesList() {
  const clienteContainer = document.getElementById('cliente-list');
  clienteContainer.innerHTML = '';
}
// Função para vincular eventos de clique aos botões de edição e exclusão
function bindEditDeleteEvents() {
  const editButtons = document.getElementsByClassName('edit-cliente-btn');
  for (const button of editButtons) {
    button.addEventListener('click', function() {
      const clientecpf_cnpj = this.getAttribute('data-cliente-cpf_cnpj');
      openEditClienteModal(clientecpf_cnpj);
    });
  }

  const deleteButtons = document.getElementsByClassName('delete-cliente-btn');
  for (const button of deleteButtons) {
    button.addEventListener('click', function() {
      const clientecpf_cnpj = this.getAttribute('data-cliente-cpf_cnpj');
      openDeleteModal(clientecpf_cnpj);
    });
  }
}

// Função para limpar a lista de usuários
function clearClientesList() {
  const clienteContainer = document.getElementById('cliente-list');
  clienteContainer.innerHTML = '';
}

// Função para atualizar a lista de usuários na página
function updateClientesList(clientes) {
  clearClientesList(); // Limpar a lista atual

  for (const cliente of clientes) {
    const clienteDiv = createClienteContainer(cliente); // Chamando a função createUserContainer para criar o conteúdo de cada usuário
    const clienteContainer = document.getElementById('cliente-list');
    clienteContainer.appendChild(clienteDiv);
  }

  bindEditDeleteEvents(); // Vincular eventos de clique novamente após a atualização da lista de usuários
}


// Função para fazer a busca dos usuários usando AJAX
function searchClientes(query) {
  fetch(`/search?q=${query}`)
    .then(response => response.json())
    .then(data => {
      const clientes = data.clientes;
      updateClientesList(clientes);
    })
    .catch(error => console.error('Erro ao buscar usuários:', error));
}

// Event listener para o formulário de busca
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const searchInput = document.querySelector('.search-input');
  const searchQuery = searchInput.value;
  searchClientes(searchQuery);
});

    
    
    
  
  // função de carregar usuários 
  function loadClientes() {
    fetch('/clientes')
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erro ao obter a lista de usuários.');
        }
      })
      .then(function(data) {
        var clienteList = document.getElementById('cliente-list');
        clienteList.innerHTML = '';
        data.clientes.forEach(function(cliente) {
          var clienteContainer = createClienteContainer(cliente);
          clienteList.appendChild(clienteContainer);
        });
        
       
        
        var editButtons = document.getElementsByClassName('edit-cliente-btn');
        for (var i = 0; i < editButtons.length; i++) {
          var button = editButtons[i];
          button.addEventListener('click', function() {
            var clientecpf_cnpj = this.getAttribute('data-cliente-cpf_cnpj');
            openEditClienteModal(clientecpf_cnpj);
          });
        }

        // função de editar usuário 
        document.getElementById('edit-cliente-form').addEventListener('submit', function(event) {
          event.preventDefault();
          
        var clientecpf_cnpj = this.getAttribute('data-cliente-cpf_cnpj');

        // Verifique qual dos botões de rádio está marcado
        var tipo;

        if (document.getElementById('edit-fisica').checked) {
          tipo = document.getElementById('edit-fisica').value; // 'Física'
        } else if (document.getElementById('edit-juridico').checked) {
          tipo = document.getElementById('edit-juridico').value; // 'Jurídica'
        } else {
          // Nenhum dos botões está marcado, defina um valor padrão (por exemplo, 'Física')
          tipo = 'Física';
        }


        var nome = document.getElementById('edit-nome').value;
        var email = document.getElementById('edit-email').value;
        var cep = document.getElementById('edit-cep').value;
        var pais = document.getElementById('edit-pais').value;
        var uf = document.getElementById('edit-uf').value;
        var cidade = document.getElementById('edit-cidade').value;
        var logradouro = document.getElementById('edit-logradouro').value;
        var bairro = document.getElementById('edit-bairro').value;
        var numero = document.getElementById('edit-numero').value;
        var complemento = document.getElementById('edit-complemento').value;
        var telefone = document.getElementById('edit-telefone').value;

        // Obtenha o valor do campo "Situação"
        var situacao;
        if (document.getElementById('ativo').checked) {
          situacao = 'Ativo';
        } else if (document.getElementById('inativo').checked) {
          situacao = 'Inativo';
        } else {
          situacao = 'Ativo'; // Valor padrão
        }

          
        
        var formData = new FormData();
        formData.append('tipo', tipo);
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('cep', cep);
        formData.append('pais', pais);
        formData.append('uf', uf);
        formData.append('cidade', cidade);
        formData.append('logradouro', logradouro);
        formData.append('bairro', bairro);
        formData.append('numero', numero);
        formData.append('complemento', complemento);
        formData.append('telefone', telefone);
     
        formData.append('situacao', situacao);
          
        
         
        
          updateCliente(clientecpf_cnpj, formData);
          });
        
// Variável de estado para acompanhar a ordem atual
let ascending_order = true;

// Função para alternar a ordem dos usuários
function toggleOrder() {
  // Inverter o estado da variável para a próxima chamada
  ascending_order = !ascending_order;

  // Faça uma solicitação AJAX para o endpoint de ordenação
  fetch(`/clientes_ordered?ascending=${ascending_order}`)
    .then((response) => response.json())
    .then((data) => {
      // Limpe a lista existente
      const clienteList = document.getElementById('cliente-list');
      clienteList.innerHTML = '';

      // Preencha a lista com os usuários obtidos da solicitação
      data.clientes.forEach((cliente) => {
        const clienteContainerContainer =  createClienteContainer(cliente);
        clienteList.appendChild(clienteContainerContainer);
      });
    })
    .catch((error) => {
      console.error('Erro ao alternar a ordem dos clientes:', error);
    });
}

// Adicione um ouvinte de evento ao botão
const toggleButton = document.getElementById('toggleOrderButton');
toggleButton.addEventListener('click', toggleOrder);

        // função de excluir usuário 
        var deleteButtons = document.getElementsByClassName('delete-cliente-btn');
for (var i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', function() {
    var clientecpf_cnpj = this.getAttribute('data-cliente-cpf_cnpj');
    openDeleteModal(clientecpf_cnpj);
  });
}
      })
      .catch(function(error) {
        console.error('Erro:', error);

      });
  }
  // função de editar usuário MODAL
  function openEditClienteModal(cpf_cnpj) {
    fetch('/clientes/' + cpf_cnpj)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erro ao obter os dados do cliente.');
        }
      })
      .then(function(data) {
        document.getElementById('edit-tipo').value = data.tipo;
  
        if (data.tipo === 'Física') {
          document.getElementById('edit-fisica').checked = true;
        } else if (data.tipo === 'Jurídica') {
          document.getElementById('edit-juridico').checked = true;
        }
  
        document.getElementById('edit-nome').value = data.nome;
        document.getElementById('edit-email').value = data.email;
        document.getElementById('edit-cep').value = data.cep;
        document.getElementById('edit-pais').value = data.pais;
        document.getElementById('edit-uf').value = data.uf;
        document.getElementById('edit-cidade').value = data.cidade;
        document.getElementById('edit-logradouro').value = data.logradouro;
        document.getElementById('edit-bairro').value = data.bairro;
        document.getElementById('edit-numero').value = data.numero;
        document.getElementById('edit-complemento').value = data.complemento;
        document.getElementById('edit-telefone').value = data.telefone;
        
        // Defina o valor do campo "Situação" com base nos dados do cliente
        if (data.situacao === 'Ativo') {
          document.getElementById('edit-ativo').checked = true;
        } else if (data.situacao === 'Inativo') {
          document.getElementById('edit-inativo').checked = true;
        }
  
        var editClienteModal = document.getElementById('edit-cliente-modal');
        editClienteModal.style.display = 'block';
  
        document.getElementById('edit-cliente-form').setAttribute('data-cliente-cpf_cnpj', cpf_cnpj);
      })
      .catch(function(error) {
        console.error('Erro:', error);
      });
  }
  
  
  // função de editar usuário
function updateCliente(cpf_cnpj, clienteData) {
  fetch('/clientes/' + cpf_cnpj, {
    method: 'POST',
    body: clienteData,
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
        var editClienteModal = document.getElementById('edit-cliente-modal');
        editClienteModal.style.display = 'none';

        // Para página não recarregar ao editar, retirar location reload
        // location.reload();
        loadClientes();

        
      } else {
        throw new Error('Erro ao atualizar usuário.');
      }
    })
    .catch(function (error) {
      console.error('Erro:', error);

    });
}

  
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('edit-cliente-form').addEventListener('submit', function(event) {
      event.preventDefault();
      var clientecpf_cnpj = this.getAttribute('data-cliente-cpf_cnpj');
      var tipo = document.querySelector('input[name="edit-tipo"]:checked').value; // Obtém o valor do campo "tipo" selecionado
      var nome = document.getElementById('edit-nome').value;
      var email = document.getElementById('edit-email').value;
      var cep = document.getElementById('edit-cep').value;
      var pais = document.getElementById('edit-pais').value;
      var uf = document.getElementById('edit-uf').value;
      var cidade = document.getElementById('edit-cidade').value;
      var logradouro = document.getElementById('edit-logradouro').value;
      var bairro = document.getElementById('edit-bairro').value;
      var numero = document.getElementById('edit-numero').value;
      var complemento = document.getElementById('edit-complemento').value;
      var telefone = document.getElementById('edit-telefone').value;
    
      var situacao = document.querySelector('input[name="edit-situacao"]:checked').value;

  
      var formData = new FormData();
        formData.append('tipo', tipo);
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('cep', cep);
        formData.append('pais', pais);
        formData.append('uf', uf);
        formData.append('cidade', cidade);
        formData.append('logradouro', logradouro);
        formData.append('bairro', bairro);
        formData.append('numero', numero);
        formData.append('complemento', complemento);
        formData.append('telefone', telefone);
    
        formData.append('situacao', situacao);
     
  
      updateCliente(clientecpf_cnpj, formData);
    });
  

  });
  

  
// Carregar os usuários ao abrir a página
loadClientes();
  
});
 

  




var modal = document.getElementById("add-cliente-modal");
  var btn = document.querySelector(".add-cliente-btn");
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
  var popUp = document.getElementById('edit-cliente-modal');
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
var editClienteModal = document.getElementById("edit-cliente-modal");

closeModal.addEventListener("click", function () {
  editClienteModal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == editClienteModal) {
    editClienteModal.style.display = "none";
  }
});





     /*  IMPLEMENTAÇÃO DO SIDEBAR PARA ABRIR QUANDO PASSA O MOUSSE  */ 
     /*
     function openSidebar() {
      var sidebar = document.querySelector('.sidebar');
      sidebar.classList.remove('close');
    }
    
    function closeSidebar() {
      var sidebar = document.querySelector('.sidebar');
      sidebar.classList.add('close');
    }
    
  */


/* PUXAR CEP */
function consultaEndereco(cepId, logradouroId, complementoId, bairroId, cidadeId, ufId) {
  let cep = document.querySelector(`#${cepId}`).value;

  cep = cep.replace('-', '');

  if (cep.length !== 8) {
    alert('CEP Inválido!');
    return;
  }

  let url = `https://viacep.com.br/ws/${cep}/json/`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (dados) {
      if (dados.erro) {
        alert('Não foi possível localizar o endereço.');
      } else {
        document.querySelector(`#${logradouroId}`).value = dados.logradouro;
        document.querySelector(`#${complementoId}`).value = dados.complemento;
        document.querySelector(`#${bairroId}`).value = dados.bairro;
        document.querySelector(`#${cidadeId}`).value = dados.localidade;
        document.querySelector(`#${ufId}`).value = dados.uf;
      }
    })
    .catch(function (error) {
      alert('Ocorreu um erro ao buscar o endereço.');
      console.error('Erro:', error);
    });
}

// função do modal de cadastro para buscar CEP














// Mascaras dos campos

$(document).ready(function() {
  $('#cpf_cnpj').inputmask({
    mask: ['999.999.999-99', '99.999.999/9999-99'],
    keepStatic: true,
    removeMaskOnSubmit: true
  });
});

$(document).ready(function () {
  $('#cep').mask('00000-000'); // Aplica a máscara de CEP (cinco dígitos, hífen e mais três dígitos)
});

$(document).ready(function(){
  $('#telefone').mask('(00) 00000-0000');
});

$(document).ready(function(){
  $('#edit-cliente-cep').mask('00000-000')
});

$(document).ready(function() {
  $('#edit-telefone').inputmask('(99) 99999-9999');
});




