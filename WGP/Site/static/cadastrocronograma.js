

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


  