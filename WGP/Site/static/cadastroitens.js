document.addEventListener('DOMContentLoaded', function() {
  var addItemBtn = document.querySelector('.add-item-btn');
  var modal = document.getElementById('add-item-modal');
  var closeModal = document.querySelector('.close-modal');
  var addItemForm = document.querySelector('.add-item-form');
  var itemList = document.getElementById('item-list');

  addItemBtn.addEventListener('click', function() {
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
  document.getElementById('add-item-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var ItemName = document.getElementById('ItemName').value;
    var Codigo = document.getElementById('Codigo').value;
    
    
    var formData = new FormData();
    formData.append('ItemName', ItemName);
    formData.append('Codigo', Codigo);
    

    addItem(formData);
  });

// função de adcionar usuário   
  function addItem(itemData) {
    fetch('/add_item', {
      method: 'POST',
      body: itemData
    })
      .then(function(response) {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Erro ao adicionar item.');
        }
      })
      .then(function(data) {
        if (data === 'Success') {
          // Limpar o formulário
          document.getElementById('ItemName').value = '';
          document.getElementById('Codigo').value = '';
          

  
          // Fechar o modal
          modal.style.display = 'none';
  
          // Atualizar a lista de usuários
          loadItems();
  
          // Exibir uma mensagem de sucesso
         
        } else {
          throw new Error('Erro ao adicionar usuário.');
        }
      })
      .catch(function(error) {
        console.error('Erro:', error);
       
      });
  }
  

// Função para abrir o modal de adicionar subitem

function openAddSubitemModal(itemID) {
  var addSubitemModal = document.getElementById('add-subitem-modal');
  addSubitemModal.style.display = 'block';

  var addSubitemForm = document.getElementById('add-subitem-form');
  var subitemNameInput = document.getElementById('subitem-name');
  var CodigoInput = document.getElementById('CodigoSub');
  
  // Event listener para o submit do formulário
  addSubitemForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var subitemName = subitemNameInput.value;
    var CodigoSub = CodigoInput.value; // Obter o valor de CodigoSub

    // Chamar a função para adicionar subitem ao item correspondente
    addSubitemToItem(itemID, subitemName, CodigoSub); // Passar CodigoSub para a função

    // Resetar o formulário
    subitemNameInput.value = '';
    CodigoInput.value = '';

    // Fechar o modal após a submissão
    addSubitemModal.style.display = 'none';

    // Atualizar a lista de itens
    loadItems();
    location.reload();

  });
}

// Função para adicionar subitem ao item correspondente
function addSubitemToItem(itemID, subitemName, CodigoSub) { // Adicione CodigoSub como parâmetro
  var formData = new FormData();
  formData.append('subitem', subitemName);
  formData.append('ParentItemID', itemID);
  formData.append('CodigoSub', CodigoSub); // Inclua o campo CodigoSub no FormData

  fetch('/add_subitem', {
    method: 'POST',
    body: formData
  })
  .then(function(response) {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Erro ao adicionar subitem.');
    }
  })
  .then(function(data) {
    if (data === 'Success') {
      // Atualizar a lista de itens para refletir o novo subitem
      loadItems();
     
    } else {
      throw new Error('Erro ao adicionar subitem.');
    }
  })
  .catch(function(error) {
    console.error('Erro:', error);
  });
}


// função de excluir usuário 
function deleteItem(ItemID) {
  fetch('/items/delete/' + ItemID, {
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
        loadItems();

        // Exibir uma mensagem de sucesso
       
      } else {
        throw new Error('Erro ao excluir usuário.');
      }
    })
    .catch(function(error) {
      console.error('Erro:', error);
      
    });
}

function createItemContainer(item) {
  const itemContainer = document.createElement('div');
  itemContainer.classList.add('item-container');
  const subitemList = item.Subitems && Array.isArray(item.Subitems) && item.Subitems.length > 0
  ? `<ul class="subitem-list" style="display: none;">
        ${generateSubitemList(item, item.Subitems)}
    </ul><br>
    <button class="mostrar-subitens"><i class="bx bxs-chevron-down-circle" style="color:var(--star-color)"></i></button>`
  : '';


  itemContainer.innerHTML = `
    <p>${item.Codigo}${item.CodigoSub ? ` (Código: ${item.CodigoSub})` : ''}</p>
    <h3>${item.ItemName} <span class="subitem-count">
    ${item.Subitems ? item.Subitems.length : 0} Subitens</span></h3>
    ${subitemList}
    

    <div class="item-actions">
    <button class="edit-item-btn" data-item-ItemID="${item.ItemID}"><i class='bx bxs-pencil'></i></button>
      <button class="add-subitem-btn" data-item-ItemID="${item.ItemID}" style="display: inline-block;">
      <i class="bx bxs-plus-circle icon" style="color:hsl(120, 100%, 24%); font-size: 20px; vertical-align: middle"></i>
      </button>

      <button class="delete-item-btn" data-item-ItemID="${item.ItemID}"><i class='bx bxs-trash-alt'></i></button>
    </div>
  `;

  var mostrarSubitensButton = itemContainer.querySelector('.mostrar-subitens');
  var subitemListUl = itemContainer.querySelector('.subitem-list');
  var subitemCount = itemContainer.querySelector('.subitem-count');
  var addSubitemButton = itemContainer.querySelector('.add-subitem-btn');
  
  if (subitemListUl) {
    mostrarSubitensButton.addEventListener('click', function() {
      var itemContainer = this.closest('.item-container');

      if (subitemListUl.style.display === 'none') {
        subitemListUl.style.display = 'block';
        itemContainer.classList.add('expanded');
        mostrarSubitensButton.innerHTML = `<i class='bx bxs-chevron-up-circle' style='color:var(--star-color)' ></i>`;

        // Ocultar a contagem de subitens
        if (subitemCount) {
          subitemCount.style.display = 'none';
        }
      } else {
        subitemListUl.style.display = 'none';
        itemContainer.classList.remove('expanded');
        mostrarSubitensButton.innerHTML = `<i class='bx bxs-chevron-down-circle' style='color:var(--star-color)' ></i>`;

        // Exibir a contagem de subitens
        if (subitemCount) {
          subitemCount.style.display = 'inline';
        }
      }
    });
  }

  return itemContainer;
}
function generateSubitemList(item, subitems) {
  let subitemListHTML = '';
  subitems.forEach(function(subitem) {
    const subitemID = subitem.SubItemID; // ID do subitem
    const codigoSubID = subitem.CodigoSubID; // ID do código sub

    subitemListHTML += `<li class="suubi" style="font-size: 15px;">
      <p class="subitem-name" data-subitem-id="${subitemID}" contenteditable="true">${subitem.SubItemName || ''}</p>
      <p class="codigo-sub" data-codigo-sub-ID="${codigoSubID}" contenteditable="true">${subitem.CodigoSub || ''}</p>
    </li>`;
  });

  // Adicione um único botão de "Salvar" fora do loop
  subitemListHTML += `<li class="suubi" style="font-size: 15px;">
    <button class="save-btn">Salvar</button>
  </li>`;

  return subitemListHTML;
}

document.addEventListener('click', function(event) {
  var target = event.target;

  if (target.classList.contains('save-btn')) {
    var itemContainer = target.closest('.item-container');
    var subitemElements = itemContainer.querySelectorAll('.suubi');

    subitemElements.forEach(function(subitemElement) {
      var subitemNameElement = subitemElement.querySelector('.subitem-name');
      var codigoSubElement = subitemElement.querySelector('.codigo-sub');

      // Obter os valores dos campos contenteditable
      var newSubitemName = subitemNameElement.textContent;
      var newCodigoSub = codigoSubElement.textContent;
      var SubItemID = subitemNameElement.getAttribute('data-subitem-id');

      // Envie os dados para o servidor Python para cada subitem
      fetch('/update-item-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SubItemID: SubItemID,
          newSubitemName: newSubitemName,
          newCodigoSub: newCodigoSub,
        }),
      })
        .then(function(response) {
          if (response.ok) {
            // Atualização bem-sucedida
            console.log('Dados atualizados com sucesso para SubItemID:', SubItemID);
          } else {
            // Erro ao atualizar
            console.error('Erro ao atualizar dados para SubItemID:', SubItemID);
          }
        })
        .catch(function(error) {
          console.error('Erro:', error);
        });
    });
  }
});



// Função para exibir o modal de confirmação antes de excluir o usuário
function openDeleteModal(ItemID) {
  var modalElement = document.getElementById('modal_confirm');
  modalElement.style.display = 'block';

  // Definir o ID do usuário a ser excluído no campo oculto do modal
  var deleteItemItemIDInput = document.getElementById('delete-item-ItemID');
  if (deleteItemItemIDInput) {
    deleteItemItemIDInput.value = ItemID;
  }

  // Associar a função deleteUser diretamente ao botão "Excluir" no modal
  var deleteButton = document.querySelector('#modal_confirm .modal-footer .btn-danger');
  deleteButton.addEventListener('click', function() {
    // Chamar diretamente a função deleteUser passando o ID do usuário
    deleteItem(ItemID);
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



// Função para vincular eventos de clique aos botões de edição e exclusão
function bindEditDeleteEvents() {
  const editButtons = document.getElementsByClassName('edit-item-btn');
  for (const button of editButtons) {
    button.addEventListener('click', function() {
      const itemItemID = this.getAttribute('data-item-ItemID');
      openEditItemModal(itemItemID);
    });
  }

  const deleteButtons = document.getElementsByClassName('delete-item-btn');
  for (const button of deleteButtons) {
    button.addEventListener('click', function() {
      const itemItemID = this.getAttribute('data-item-ItemID');
      openDeleteModal(itemItemID);
    });
  }

  const mostrarSubitensButtons = document.getElementsByClassName('mostrar-subitens');
  for (const button of mostrarSubitensButtons) {
    button.addEventListener('click', function() {
      const subitemListUl = this.parentElement.previousElementSibling.querySelector('.subitem-list');
      if (subitemListUl.style.display === 'none' || subitemListUl.style.display === '') {
        subitemListUl.style.display = 'block';
        this.innerHTML = `<i class='bx bxs-chevron-up-circle' style='color:var(--star-color)' ></i> Ocultar Subitens`;
      } else {
        subitemListUl.style.display = 'none';
        this.innerHTML = `<i class='bx bxs-chevron-down-circle' style='color:var(--star-color)' ></i> Mostrar Subitens`;
      }
    });
  }

  // Vincular evento de clique ao botão para adicionar subitens
  const addSubitemButtons = document.getElementsByClassName('add-subitem-btn');
  for (const button of addSubitemButtons) {
    button.addEventListener('mousedown', function (event) {
      // Impedir o comportamento padrão do botão (para evitar seleção de texto)
      event.preventDefault();

      // Obter o ID do item associado a este botão
      const itemItemID = this.getAttribute('data-item-ItemID');

      // Chamar a função para abrir o modal de adicionar subitem
      openAddSubitemModal(itemItemID);
    });
  }
}




// Função para limpar a lista de usuários
function clearItemsList() {
  console.log('Limpando a lista de itens'); // Adicione este log
  const itemContainer = document.getElementById('item-list');
  itemContainer.innerHTML = '';
}



// Função para atualizar a lista de itens na página
function updateItemsList(items) {
  console.log('Atualizando lista de itens');
  clearItemsList(); // Limpar a lista atual

  for (const item of items) {
    const itemDiv = createItemContainer(item); // Chamando a função createItemContainer para criar o conteúdo de cada item
    console.log('Item criado:', itemDiv); // Log para depuração
    const itemContainer = document.getElementById('item-list');
    itemContainer.appendChild(itemDiv);

    // Verifique se há subitens e se são um array
    if (item.SubItems && Array.isArray(item.SubItems) && item.SubItems.length > 0) {
      console.log('Subitens encontrados:', item.SubItems); // Log para depuração
      // Chame a função generateSubitemList para criar a lista de subitens
      const subitemList = generateSubitemList(item.SubItems);
      // Atualize a contagem de subitens no HTML
      const subitemCount = itemDiv.querySelector('.subitem-count');
      if (subitemCount) {
        subitemCount.textContent = `${item.SubItems}`; // Correção aqui
      }
      // Adicione a lista de subitens ao itemDiv
      const subitemListUl = itemDiv.querySelector('.subitem-list');
      if (subitemListUl) {
        subitemListUl.innerHTML = subitemList;
      }
      
      // Crie e vincule o botão "Mostrar Subitens"
      const mostrarSubitensButton = document.createElement('button');
      mostrarSubitensButton.className = 'mostrar-subitens';
      mostrarSubitensButton.innerHTML = `<i class='bx bxs-chevron-down-circle' style='color:var(--star-color)' ></i> `;
      
      mostrarSubitensButton.addEventListener('click', function() {
        var itemContainer = this.closest('.item-container');
        var subitemListUl = itemContainer.querySelector('.subitem-list');
      
        if (subitemListUl) {
          if (subitemListUl.style.display === 'none' || subitemListUl.style.display === '') {
            subitemListUl.style.display = 'block';
            itemContainer.classList.add('expanded');
            mostrarSubitensButton.innerHTML = `<i class='bx bxs-chevron-up-circle' style='color:var(--star-color)' ></i>`;
            
            // Ocultar a contagem de subitens
            if (subitemCount) {
              subitemCount.style.display = 'none';
            }
          } else {
            subitemListUl.style.display = 'none';
            itemContainer.classList.remove('expanded');
            mostrarSubitensButton.innerHTML = `<i class='bx bxs-chevron-down-circle' style='color:var(--star-color)' ></i>`;
            
            // Exibir a contagem de subitens
            if (subitemCount) {
              subitemCount.style.display = 'inline';
            }
          }
        }
      });
      

      // Adicione o botão "Mostrar Subitens" ao itemDiv
      itemDiv.appendChild(mostrarSubitensButton);
    }
  }

  bindEditDeleteEvents(); // Vincular eventos de clique novamente após a atualização da lista de itens
}




function searchItems(query) {
  console.log("Pesquisando por:", query);
  fetch(`/search2?f=${query}`)
    .then(response => response.json())
    .then(data => {
      console.log("Dados recebidos:", data);

      // Verificar se a resposta inclui a chave 'items'
      if ('items' in data) {
        const items = data.items;

        // Certifique-se de que os subitens sejam um array mesmo que haja apenas um subitem
        items.forEach(item => {
          if (item.Subitems && !Array.isArray(item.Subitems)) {
            item.Subitems = [item.Subitems];
          }
        });

        console.log("Itens após verificação:", items); // Adicione este log

        // Vincule os eventos de edição/exclusão e atualize a lista
        bindEditDeleteEvents();
        updateItemsList(items); // Esta função substitui a lista existente pelos itens pesquisados

        // Adicionar botão "Mostrar Subitens" para cada item
        const mostrarSubitensButtons = document.querySelectorAll('.mostrar-subitens');
        for (const button of mostrarSubitensButtons) {
          button.style.display = 'block';

          // Adicione novamente o evento de clique para expandir/contrair os subitens
          button.addEventListener('click', function() {
            const itemContainer = this.closest('.item-container');
            const subitemListUl = itemContainer.querySelector('.subitem-list');
          
            if (subitemListUl) {
              if (subitemListUl.style.display === 'none') {
                subitemListUl.style.display = 'block';
                itemContainer.classList.add('expanded');
                this.innerHTML = `<i class='bx bxs-chevron-up-circle' style='color:var(--star-color)' ></i>`;
              } else {
                subitemListUl.style.display = 'none';
                itemContainer.classList.remove('expanded');
                this.innerHTML = `<i class='bx bxs-chevron-down-circle' style='color:var(--star-color)' ></i>`;
              }
            } else {
              console.error('Elemento .subitem-list não encontrado.');
            }
          });
          
        }
      } else {
        console.error('A resposta do servidor não contém a chave "items".', data);
      }
    })
    .catch(error => console.error('Erro ao buscar itens:', error));
}

// Event listener para o formulário de busca
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const searchInput = document.querySelector('.search-input');
  const searchQuery = searchInput.value;
  searchItems(searchQuery);
});



     
// Função para carregar usuários
function loadItems() {
  fetch('/items')
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erro ao obter a lista de usuários.');
      }
    })
    .then(function(data) {
      var itemList = document.getElementById('item-list');
      itemList.innerHTML = '';
      data.items.forEach(function(item) {
        var itemContainer = createItemContainer(item);
        itemList.appendChild(itemContainer);
      });

   // Vincule eventos para adicionar subitem
var addSubitemButtons = document.getElementsByClassName('add-subitem-btn');
for (var i = 0; i < addSubitemButtons.length; i++) {
  addSubitemButtons[i].addEventListener('click', function() {
    var itemID = this.getAttribute('data-item-ItemID');
    openAddSubitemModal(itemID); // Vincule o evento de clique aqui
  });
}





var editButtons = document.getElementsByClassName('edit-item-btn');
for (var i = 0; i < editButtons.length; i++) {
  var button = editButtons[i];
  button.addEventListener('click', function() {
    var itemItemID = this.getAttribute('data-item-ItemID');
    openEditItemModal(itemItemID);
  });
}

        // função de editar usuário 
        if (document.getElementById('edit-item-form') !== null) { 
        document.getElementById('edit-item-form').addEventListener('submit', function(event) {
          event.preventDefault();
          
        var itemItemID = this.getAttribute('data-item-ItemID');
        var ItemName = document.getElementById('edit-ItemName').value;
        var Codigo = document.getElementById('edit-Codigo').value;

        
        var formData = new FormData();
        formData.append('ItemName', ItemName);
        formData.append('Codigo', Codigo);
        
                
          updateItem(itemItemID, formData);
        });
      }
// Variável de estado para acompanhar a ordem atual

        // função de excluir usuário 
        var deleteButtons = document.getElementsByClassName('delete-item-btn');
for (var i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', function() {
    var itemItemID = this.getAttribute('data-item-ItemID');
    openDeleteModal(itemItemID);
  });
}
      })
      .catch(function(error) {
        console.error('Erro:', error);
       
      });
  }


// função de editar usuário MODAL
function openEditItemModal(ItemID) {
  fetch('/items/' + ItemID)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erro ao obter os dados do item.');
      }
    })
    .then(function(data) {
      var editItemModal = document.getElementById('edit-item-modal');
      if (editItemModal) {
        editItemModal.style.display = 'block';
        document.getElementById('edit-ItemName').value = data.ItemName;
        document.getElementById('edit-Codigo').value = data.Codigo;

        document.getElementById('edit-item-form').setAttribute('data-item-ItemID', ItemID);
      } else {
        console.error('Modal de edição de item não encontrado.');
      }
    })
    .catch(function(error) {
      console.error('Erro:', error);
    });
}



  
  
  // função de editar usuário
  function updateItem(ItemID, itemData) {
    fetch('/items/' + ItemID, {
      method: 'POST',
      body: itemData,
    })
      .then(function(response) {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Erro ao atualizar item.');
        }
      })
      .then(function(data) {
        if (data === 'Success') {
          var editItemModal = document.getElementById('edit-item-modal');
          editItemModal.style.display = 'none';
          location.reload();
          loadItems();
        } else {
          throw new Error('Erro ao atualizar item.');
        }
      })
      .catch(function(error) {
        console.error('Erro:', error);
      });
  }
  
  
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('edit-item-form').addEventListener('submit', function(event) {
      event.preventDefault();
      var itemItemID = this.getAttribute('data-item-ItemID');
      var ItemName = document.getElementById('edit-ItemName').value;
      var Codigo = document.getElementById('edit-Codigo').value;

      
      var formData = new FormData();
      formData.append('ItemName', ItemName);
      formData.append('Codigo', Codigo);

  
      updateItem(itemItemID, formData);
    });
 
  });  

// Carregar os usuários ao abrir a página
loadItems();
  
});
 





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

  
     function fecharPopUp() {
      var editItemModal = document.getElementById("edit-item-modal");
      editItemModal.style.display = "none";
    }
    function fecharSubitemModal() {
      var addSubitemModal = document.getElementById("add-subitem-modal");
      addSubitemModal.style.display = "none";
    }
        
var closeModal = document.querySelector(".close");
var editItemModal = document.getElementById("edit-item-modal");

closeModal.addEventListener("click", function () {
  editItemModal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == editItemModal) {
    editItemModal.style.display = "none";
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





    