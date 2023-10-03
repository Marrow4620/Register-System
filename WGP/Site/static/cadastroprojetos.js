document.addEventListener('DOMContentLoaded', function() {
  var addProjetoBtn = document.querySelector('.add-projeto-btn');
  var modal = document.getElementById('add-projeto-modal');
  var closeModal = document.querySelector('.close-modal');
  var addProjetoForm = document.querySelector('.add-projeto-form');
  var projetoList = document.getElementById('projeto-list');


  addProjetoBtn.addEventListener('click', function() {
    modal.style.display = 'block';
    carregarClientes();
    carregarConsultores(); // Adicione essa chamada aqui
  });


  addProjetoBtn.addEventListener('click', function() {
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
  document.getElementById('add-projeto-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var Cliente = document.getElementById('Cliente').value;
    var TipoProjeto = document.getElementById('TipoProjeto').value;
    var Consultor = document.getElementById('Consultor').value;
    var EscopoProjeto = document.getElementById('EscopoProjeto').value;
    var GPCliente = document.getElementById('GPCliente').value;
    var GPWinnercon = document.getElementById('GPWinnercon').value;
    var TipoFaturamento = document.getElementById('TipoFaturamento').value;
    var TipoServidor = document.getElementById('TipoServidor').value;
    var Proposta = document.getElementById('Proposta').value;
    var ResponsavelAssinou = document.getElementById('ResponsavelAssinou').value;
    var Assinado = document.getElementById('Assinado').value;
    var Horas = document.getElementById('Horas').value;
    var ValorHora = document.getElementById('ValorHora').value;
    var Inicio = document.getElementById('Inicio').value;
    var Termino = document.getElementById('Termino').value;
    var StatusRadios = document.querySelectorAll('[name="Status"]');
    var Status;
    for (var i = 0; i < StatusRadios.length; i++) {
      if (StatusRadios[i].checked) {
        Status = StatusRadios[i].value;
        break;
      }
    }
    


    var formData = new FormData();
    formData.append('Cliente', Cliente);
    formData.append('TipoProjeto', TipoProjeto);
    formData.append('Consultor', Consultor);
    formData.append('EscopoProjeto', EscopoProjeto);
    formData.append('GPCliente', GPCliente);
    formData.append('GPWinnercon', GPWinnercon);
    formData.append('TipoFaturamento',TipoFaturamento);
    formData.append('TipoServidor', TipoServidor);
    formData.append('Proposta', Proposta);
    formData.append('ResponsavelAssinou', ResponsavelAssinou);
    formData.append('Assinado', Assinado);
    formData.append('Horas', Horas);
    formData.append('ValorHora', ValorHora);
    formData.append('Inicio', Inicio);
    formData.append('Termino', Termino);
    formData.append('Status', Status);
    
    addProjeto(formData);

  });


  
function carregarClientes() {
  axios.get('/add_projeto_form')
      .then(response => {
          const data = response.data;
          if (data && data.clientes) {
              const clientes = data.clientes;
              const selectCliente = document.getElementById('Cliente','edit-Cliente');
              
              clientes.forEach(Cliente => {
                  const option = document.createElement('option');
                  option.value = Cliente;
                  option.text = Cliente;
                  selectCliente.appendChild(option);
              });
          } else {
              console.error('Erro ao carregar nomes dos clientes: Resposta inválida');
          }
      })
      .catch(error => {
          console.error('Erro ao carregar nomes dos clientes:', error);
      });
}


function carregarConsultores() {
  axios.get('/add_consultor_form')
      .then(response => {
          const data = response.data;
          const selectConsultor = document.getElementById('Consultor');
          
          data.consultores.forEach(Consultor => {
              const option = document.createElement('option');
              option.value = Consultor.trim();
              option.text = Consultor.trim();
              selectConsultor.appendChild(option);
          });
      })
      .catch(error => {
          console.error('Erro ao carregar nomes dos consultores:', error);
      });
}

function carregarClientesEdicao() {
  axios.get('/add_projeto_form')
      .then(response => {
          const data = response.data;
          if (data && data.clientes) {
              const clientes = data.clientes;
              const selectCliente = document.getElementById('edit-Cliente');
              
              clientes.forEach(Cliente => {
                  const option = document.createElement('option');
                  option.value = Cliente;
                  option.text = Cliente;
                  selectCliente.appendChild(option);
              });
          } else {
              console.error('Erro ao carregar nomes dos clientes: Resposta inválida');
          }
      })
      .catch(error => {
          console.error('Erro ao carregar nomes dos clientes:', error);
      });
}
function carregarConsultorEdicao() {
  axios.get('/add_consultor_form')
  .then(response => {
    const data = response.data;
    const selectConsultor = document.getElementById('edit-Consultor');
    
    data.consultores.forEach(Consultor => {
        const option = document.createElement('option');
        option.value = Consultor.trim();
        option.text = Consultor.trim();
        selectConsultor.appendChild(option);
    });
})
.catch(error => {
    console.error('Erro ao carregar nomes dos consultores:', error);
});
}



// função de adcionar usuário   
  function addProjeto(projetoData) {
    fetch('/add_projeto', {
      method: 'POST',
      body: projetoData
    })
      .then(function(response) {
        if (response.ok) {
          return response.text();
      
        }
      })
      .then(function(data) {
        if (data === 'Success') {
          // Limpar o formulário
          document.getElementById('Cliente').value = '';
          document.getElementById('TipoProjeto').value = '';
          document.getElementById('Consultor').value = '';
          document.getElementById('EscopoProjeto').value = '';
          document.getElementById('GPCliente').value = '';
          document.getElementById('GPWinnercon').value = '';
          document.getElementById('TipoFaturamento').value = '';
          document.getElementById('TipoServidor').value = '';
          document.getElementById('Proposta').value = '';
          document.getElementById('ResponsavelAssinou').value = '';
          document.getElementById('Assinado').value = '';
          document.getElementById('Horas').value = '';
          document.getElementById('ValorHora').value = '';
          document.getElementById('Inicio').value = '';
          document.getElementById('Termino').value = '';
          document.querySelector('[name="Status"]').value = '';


  
          // Fechar o modal
          modal.style.display = 'none';
  
          // Atualizar a lista de usuários
          loadProjetos();
  
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
function deleteProjetos(EscopoProjeto) {
  fetch('/projetos/delete/' + EscopoProjeto, {
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
        loadProjetos();

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
function createProjetoContainer(projeto) {
  var projetoContainer = document.createElement('div');
  projetoContainer.classList.add('projeto-container');

  var escopoProjeto = projeto.EscopoProjeto.length > 20 ? projeto.EscopoProjeto.substring(0, 20) + "..." : projeto.EscopoProjeto;

  projetoContainer.innerHTML = `
    
    <p>${escopoProjeto}</p>
    <h3>${projeto.Cliente}</h3>
    <p>${projeto.Consultor}</p>
    
    
      
    <div class="projeto-actions">
      <button class="edit-projeto-btn" data-projeto-EscopoProjeto="${projeto.EscopoProjeto}"><i class='bx bxs-pencil'></i></button>
      <button class="delete-projeto-btn" data-projeto-EscopoProjeto="${projeto.EscopoProjeto}"><i class='bx bxs-trash-alt'></i></button>
    </div>
  `;
  return projetoContainer;
}

// Função para exibir o modal de confirmação antes de excluir o usuário
function openDeleteModal(EscopoProjeto) {
  var modalElement = document.getElementById('modal_confirm');
  modalElement.style.display = 'block';

  // Definir o ID do usuário a ser excluído no campo oculto do modal
  var deleteProjetoEscopoProjetoInput = document.getElementById('delete-proejeto-EscopoProjeto');
  if (deleteProjetoEscopoProjetoInput) {
    deleteProjetoEscopoProjetoInput.value = EscopoProjeto;
  }

  // Associar a função deleteUser diretamente ao botão "Excluir" no modal
  var deleteButton = document.querySelector('#modal_confirm .modal-footer .btn-danger');
  deleteButton.addEventListener('click', function() {
    // Chamar diretamente a função deleteUser passando o ID do usuário
    deleteProjetos(EscopoProjeto);
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
function clearProjetosList() {
  const projetoContainer = document.getElementById('projeto-list');
  projetoContainer.innerHTML = '';
}
// Função para vincular eventos de clique aos botões de edição e exclusão
function bindEditDeleteEvents() {
  const editButtons = document.getElementsByClassName('edit-projeto-btn');
  for (const button of editButtons) {
    button.addEventListener('click', function() {
      const projetoEscopoProjeto = this.getAttribute('data-projeto-EscopoProjeto');
      openEditProjetoModal(projetoEscopoProjeto);
    });
  }

  const deleteButtons = document.getElementsByClassName('delete-projeto-btn');
  for (const button of deleteButtons) {
    button.addEventListener('click', function() {
      const projetoEscopoProjeto = this.getAttribute('data-projeto-EscopoProjeto');
      openDeleteModal(projetoEscopoProjeto);
    });
  }
}

// Função para limpar a lista de usuários
function clearProjetosList() {
  const projetoContainer = document.getElementById('projeto-list');
  projetoContainer.innerHTML = '';
}

// Função para atualizar a lista de usuários na página
function updateProjetosList(projetos) {
  clearProjetosList(); // Limpar a lista atual

  for (const projeto of projetos) {
    const projetoDiv = createProjetoContainer(projeto); // Chamando a função createUserContainer para criar o conteúdo de cada usuário
    const projetoContainer = document.getElementById('projeto-list');
    projetoContainer.appendChild(projetoDiv);
  }

  bindEditDeleteEvents(); // Vincular eventos de clique novamente após a atualização da lista de usuários
}


// Função para fazer a busca dos usuários usando AJAX
function searchProjetos(query) {
  console.log("Pesquisando por:", query);
  fetch(`/search4?p=${query}`)
    .then(response => response.json())
    .then(data => {
      console.log("Dados recebidos:", data);
      const projetos = data.projetos;

      if (Array.isArray(projetos)) {
        updateProjetosList(projetos);
      } else {
        console.error('A resposta do servidor não contém projetos válidos.');
      }
    })
    .catch(error => console.error('Erro ao buscar projetos:', error));
}

// Event listener para o formulário de busca
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const searchInput = document.querySelector('.search-input');
  const searchQuery = searchInput.value;
  searchProjetos(searchQuery);
});

    
    
    
  
  // função de carregar usuários 
  function loadProjetos() {
    fetch('/projetos')
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erro ao obter a lista de usuários.');
        }
      })
      .then(function(data) {
        var projetoList = document.getElementById('projeto-list');
        projetoList.innerHTML = '';
        data.projetos.forEach(function(projeto) {
          var projetoContainer = createProjetoContainer(projeto);
          projetoList.appendChild(projetoContainer);
        });
        
       
        
        var editButtons = document.getElementsByClassName('edit-projeto-btn');
        for (var i = 0; i < editButtons.length; i++) {
          var button = editButtons[i];
          button.addEventListener('click', function() {
            var projetoEscopoProjeto = this.getAttribute('data-projeto-EscopoProjeto');
            openEditProjetoModal(projetoEscopoProjeto);
          });
        }
        // função de editar usuário 
        document.getElementById('edit-projeto-form').addEventListener('submit', function(event) {
          event.preventDefault();
          
          var projetoEscopoProjeto = this.getAttribute('data-projeto-EscopoProjeto');
          var Cliente = document.getElementById('edit-Cliente').value;
          var TipoProjeto = document.getElementById('edit-TipoProjeto').value;
          var Consultor = document.getElementById('edit-Consultor').value;
          var GPCliente = document.getElementById('edit-GPCliente').value;
          var GPWinnercon = document.getElementById('edit-GPWinnercon').value;
          var TipoFaturamento = document.getElementById('edit-TipoFaturamento').value;
          var TipoServidor = document.getElementById('edit-TipoServidor').value;
          var Proposta = document.getElementById('edit-Proposta').value;
          var ResponsavelAssinou = document.getElementById('edit-ResponsavelAssinou').value;
          var Assinado = document.getElementById('edit-Assinado').value;
          var Horas = document.getElementById('edit-Horas').value;
          var ValorHora = document.getElementById('edit-ValorHora').value;
          var Inicio = document.getElementById('edit-Inicio').value;
          var Termino = document.getElementById('edit-Termino').value;
          var Status = document.querySelector('#edit-Status').value;

          console.log('Dados do formulário:');
          console.log('projetoEscopoProjeto:', projetoEscopoProjeto);
          console.log('Cliente:', Cliente);
          console.log('TipoProjeto:', TipoProjeto);
          console.log('Consultor:', Consultor);
          console.log('GPCliente:', GPCliente);
          console.log('GPWinnercon:', GPWinnercon);
          console.log('TipoFaturamento:', TipoFaturamento);
          console.log('TipoServidor:', TipoServidor);
          console.log('Proposta:', Proposta);
          console.log('ResponsavelAssinou:', ResponsavelAssinou);
          console.log('Assinado:', Assinado);
          console.log('Horas:', Horas);
          console.log('ValorHora:', ValorHora);
          console.log('Inicio:', Inicio);
          console.log('Termino:', Termino);
          console.log('Status:', Status);
        
          
          var formData = new FormData();
          formData.append('Cliente', Cliente);
          formData.append('TipoProjeto', TipoProjeto);
          formData.append('Consultor', Consultor);
          formData.append('GPCliente', GPCliente);
          formData.append('GPWinnercon', GPWinnercon);
          formData.append('TipoFaturamento',TipoFaturamento);
          formData.append('TipoServidor', TipoServidor);
          formData.append('Proposta', Proposta);
          formData.append('ResponsavelAssinou', ResponsavelAssinou);
          formData.append('Assinado', Assinado);
          formData.append('Horas', Horas);
          formData.append('ValorHora', ValorHora);
          formData.append('Inicio', Inicio);
          formData.append('Termino', Termino);
          formData.append('Status', Status);
        
          updateProjeto(projetoEscopoProjeto, formData);
        });


      // Variável de estado para acompanhar a ordem atual
let ascending_order = true;

// Função para alternar a ordem dos usuários
function toggleOrder() {
  // Inverter o estado da variável para a próxima chamada
  ascending_order = !ascending_order;

  // Faça uma solicitação AJAX para o endpoint de ordenação
  fetch(`/projetos_ordered?ascending=${ascending_order}`)
    .then((response) => response.json())
    .then((data) => {
      // Limpe a lista existente
      const proejetoList = document.getElementById('projetos-list');
      projetoList.innerHTML = '';

      // Preencha a lista com os usuários obtidos da solicitação
      data.projetos.forEach((projeto) => {
        const projetoContainer = createProjetoContainer(projeto);
        projetoList.appendChild(projetoContainer);
      });
    })
    .catch((error) => {
      console.error('Erro ao alternar a ordem dos usuários:', error);
    });
}

// Adicione um ouvinte de evento ao botão
const toggleButton = document.getElementById('toggleOrderButton');
toggleButton.addEventListener('click', toggleOrder);

        
        // função de excluir usuário 
        var deleteButtons = document.getElementsByClassName('delete-projeto-btn');
for (var i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', function() {
    var projetoEscopoProjeto = this.getAttribute('data-projeto-EscopoProjeto');
    openDeleteModal(projetoEscopoProjeto);
  });
}
      })
      .catch(function(error) {
        console.error('Erro:', error);
  
      });
  }
  // função de editar usuário MODAL
  function openEditProjetoModal(EscopoProjeto) {
    fetch('/projetos/' + EscopoProjeto)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erro ao obter os dados do usuário.');
        }
      })
      .then(function(data) {
        console.log('Dados do usuário recuperados:');
        console.log('data:', data);
  

        document.getElementById('edit-Cliente').value = data.Cliente;
        document.getElementById('edit-TipoProjeto').value = data.TipoProjeto;
        document.getElementById('edit-Consultor').value = data.Consultor;
        document.getElementById('edit-GPCliente').value = data.GPCliente;
        document.getElementById('edit-GPWinnercon').value = data.GPWinnercon;
        document.getElementById('edit-TipoFaturamento').value = data.TipoFaturamento;
        document.getElementById('edit-TipoServidor').value = data.TipoServidor;
        document.getElementById('edit-Proposta').value = data.Proposta;
        document.getElementById('edit-ResponsavelAssinou').value = data.ResponsavelAssinou;
        document.getElementById('edit-Assinado').value = data.Assinado;
        document.getElementById('edit-Horas').value = data.Horas;
        document.getElementById('edit-ValorHora').value = data.ValorHora;
        document.getElementById('edit-Inicio').value = data.Inicio;
        document.getElementById('edit-Termino').value = data.Termino;
        document.getElementById('edit-Status').value = data.Status;
        
        

        
        var editProjetoModal = document.getElementById('edit-projeto-modal');
        editProjetoModal.style.display = 'block';
    
        document.getElementById('edit-projeto-form').setAttribute('data-projeto-EscopoProjeto', EscopoProjeto);
        carregarClientesEdicao();
        carregarConsultorEdicao();
      })
      .catch(function(error) {
        console.error('Erro:', error);
       
      });
  }
  
  function updateProjeto(EscopoProjeto, projetoData) {
    fetch('/projetos/' + EscopoProjeto, {
      method: 'POST',
      body: projetoData,
    })
      .then(function (response) {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Erro ao atualizar usuário.');
        }
      })
      .then(function (data) {
        console.log('Resposta do servidor:', data); // Adicione este log
  
        if (data === 'Success') {
          var editProjetoModal = document.getElementById('edit-projeto-modal');
          editProjetoModal.style.display = 'none';
  
          // Para página não recarregar ao editar, retirar location reload
          // location.reload();
          loadProjetos();
          
          console.log('Atualização do projeto bem-sucedida!'); // Adicione este log
        } else {
          throw new Error('Erro ao atualizar usuário.');
        }
      })
      .catch(function (error) {
        console.error('Erro ao atualizar projeto:', error);
        console.log('Erro ao atualizar projeto:', error);
      });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('edit-projeto-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var Cliente = document.getElementById('edit-Cliente').value;
      var TipoProjeto = document.getElementById('edit-TipoProjeto').value;
      var Consultor = document.getElementById('edit-Consultor').value;
      var GPCliente = document.getElementById('edit-GPCliente').value;
      var GPWinnercon = document.getElementById('edit-GPWinnercon').value;
      var TipoFaturamento = document.getElementById('edit-TipoFaturamento').value;
      var TipoServidor = document.getElementById('edit-TipoServidor').value;
      var Proposta = document.getElementById('edit-Proposta').value;
      var ResponsavelAssinou = document.getElementById('edit-ResponsavelAssinou').value;
      var Assinado = document.getElementById('edit-Assinado').value;
      var Horas = document.getElementById('edit-Horas').value;
      var ValorHora = document.getElementById('edit-ValorHora').value;
      var Inicio = document.getElementById('edit-Inicio').value;
      var Termino = document.getElementById('edit-Termino').value;
      var Status = document.querySelector('#edit-Status').value;

      console.log('Dados do formulário:');
      console.log('Cliente:', Cliente);
      console.log('TipoProjeto:', TipoProjeto);
      console.log('Consultor:', Consultor);
      console.log('GPCliente:', GPCliente);
      console.log('GPWinnercon:', GPWinnercon);
      console.log('TipoFaturamento:', TipoFaturamento);
      console.log('TipoServidor:', TipoServidor);
      console.log('Proposta:', Proposta);
      console.log('ResponsavelAssinou:', ResponsavelAssinou);
      console.log('Assinado:', Assinado);
      console.log('Horas:', Horas);
      console.log('ValorHora:', ValorHora);
      console.log('Inicio:', Inicio);
      console.log('Termino:', Termino);
      console.log('Status:', Status);      
      
      var formData = new FormData();
      formData.append('Cliente', Cliente);
      formData.append('TipoProjeto', TipoProjeto);
      formData.append('Consultor', Consultor);
      formData.append('GPCliente', GPCliente);
      formData.append('GPWinnercon', GPWinnercon);
      formData.append('TipoFaturamento',TipoFaturamento);
      formData.append('TipoServidor', TipoServidor);
      formData.append('Proposta', Proposta);
      formData.append('ResponsavelAssinou', ResponsavelAssinou);
      formData.append('Assinado', Assinado);
      formData.append('Horas', (Horas));
      formData.append('ValorHora', (ValorHora));
      formData.append('Inicio', Inicio);
      formData.append('Termino', Termino);
      formData.append('Status',Status);
      
  
      updateProjeto(projetoEscopoProjeto, formData);
    });
  

  });
  

  
// Carregar os usuários ao abrir a página
loadProjetos();
  
});
 

  






  



var modal = document.getElementById("add-projeto-modal");
  var btn = document.querySelector(".add-projeto-btn");
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
  var popUp = document.getElementById('edit-projeto-modal');
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
var editProjetoModal = document.getElementById("edit-projeto-modal");

closeModal.addEventListener("click", function () {
  editProjetoModal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == editProjetoModal) {
    editProjetoModal.style.display = "none";
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



    