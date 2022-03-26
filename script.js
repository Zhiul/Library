let myLibrary;
let storedBooks = JSON.parse(localStorage.getItem("myLibrary"));

let booksContainer = document.querySelector('.books');

const addBookBtn = document.querySelector('.add-book-button');

let bookInputs = document.querySelectorAll('.book-input');

let bookEditButtons = document.querySelectorAll('.book-edit')
let bookToBeEdited;
const editBookBtn = document.querySelector('.edit-book-button');

let deleteBookButtons = document.querySelectorAll('.book-delete');

let decreaseButtons = document.querySelectorAll('.page-rest');
let increaseButtons = document.querySelectorAll('.page-add');

let readButtons;


if(storedBooks === null){
  myLibrary = [];
} else{
  myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
}

updateLibrary();

class Book{
  constructor(title, author, pages, completedPages){
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.completedPages = completedPages;
  }
}

function addBookToLibrary(titleInput, authorInput, pagesInput, completedPagesInput) {
  let book = new Book(titleInput, authorInput, pagesInput, completedPagesInput);
  if(book.pages === book.completedPages){
    book.read = true;
  }
  myLibrary.push(book);
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function updateLibrary(){
  for(let i = 0; i < myLibrary.length; i++){
      if (booksContainer.contains(document.querySelector(`.book[data-number="${i}"]`)) === false){
          booksContainer.insertAdjacentHTML("beforeend", `
          <div class="book" data-number='${i}'>
          <div class="book-panel">
              <button class='book-edit' data-modal-target='#modal2'><img src="./assets/pencil.svg" alt="Edit"></button>
              <div class="book-panel-separator"></div>
              <button class='book-delete'><img src="./assets/delete.svg" alt="Delete"></button>
          </div>

          <h2 class="book-title">${myLibrary[i].title}</h2>
          <div class="book-author">by ${myLibrary[i].author}</div>

          <div class="book-panel-number">
              <button class="page-rest"></button>
              <div class="book-panel-number-checkbox">
                  <button class='book-mark-complete'><img class='book-mark' src="./assets/checbox.svg" alt="Check Mark"></button>
                  <p>Read</p>
              </div>
              
              <button class="page-add"></button>
          </div>
          <div class="book-pages-read">
              <div><div class="pages-read">${myLibrary[i].completedPages}</div></div>
              <span>/</span>
              <div><div class="total-pages">${myLibrary[i].pages}</div></div>
          </div>
      </div>`);
      }
      if (booksContainer.contains(document.querySelector(`.book[data-number="${i}"]`)) === true && 
          myLibrary[i].read === true){
            document.querySelector(`.book[data-number="${i}"] .book-mark`).style.opacity = '1';
      }
      setTimeout(() => {
        document.querySelector(`.book[data-number="${i}"`).style.setProperty('--s', 'scale(1)')
      }, 100);
      
  }

  addBookEditButtonsEventListener();
  addDeleteBookButtonsEventListener();
  addBookNumberPanelEventListener();
  addReadButtonsEventListener();
  updateModalButtons();
}



// Input fields

class Inputs{
  constructor(bookTitle, bookAuthor, bookPages, bookCompletedPages){
    this.bookTitle = bookTitle,
    this.bookAuthor = bookAuthor,
    this.bookPages = bookPages,
    this.bookCompletedPages = bookCompletedPages
  }
}

let addInputs = new Inputs(document.querySelector('#book-title'),
                            document.querySelector('#book-author'),
                            document.querySelector('#book-pages'),
                            document.querySelector('#book-completed-pages'));

let editInputs = new Inputs(document.querySelector('#book-title-edit'),
document.querySelector('#book-author-edit'),
document.querySelector('#book-pages-edit'),
document.querySelector('#book-completed-pages-edit'));

function checkIfAFieldIsEmpty(inputs){
  if (Object.values(inputs).some(input => input.value === '')){
    return true;
  } else{
    return false;
  }
}

// Remove placeholder when focus

bookInputs.forEach(bookInput =>{
  bookInput.addEventListener('focus', () =>{
    bookInput.style.setProperty('--s', 'scale(0)');
    bookInput.placeholder;
  })
})

// Add book button

addBookBtn.addEventListener('click', () => {

  for(input in addInputs){
    if(addInputs[input].value === ''){
      addInputs[input].placeholder = 'Must not be empty';
      addInputs[input].style.setProperty('--s', 'scale(1)')
    }
  }

  if(checkIfAFieldIsEmpty(addInputs) === false){
    if(addInputs.bookCompletedPages.value <= addInputs.bookPages.value && addInputs.bookPages != 0){

      addBookToLibrary(addInputs.bookTitle.value, 
                       addInputs.bookAuthor.value, 
                       parseInt(addInputs.bookPages.value),
                       parseInt(addInputs.bookCompletedPages.value))
      updateLibrary();
  
      addInputs.bookTitle.value = '';
      addInputs.bookAuthor.value = '';
      addInputs.bookPages.value = '';
      addInputs.bookCompletedPages.value = '';
    } else if (addInputs.bookCompletedPages.value > addInputs.bookPages.value && addInputs.bookPages.value != 0){
      addInputs.bookCompletedPages.value = '';
      addInputs.bookCompletedPages.placeholder = 'Must be less'
      addInputs.bookCompletedPages.style.setProperty('--s', 'scale(1)');
    } else{
      addInputs.bookPages.value = '';
      addInputs.bookPages.placeholder = `Can't be 0`;
      addInputs.bookPages.style.setProperty('--s', 'scale(1)');
    }
  }
})

// Edit book button

editBookBtn.addEventListener('click', () => {

  for(input in editInputs){
    if(editInputs[input].value === ''){
      editInputs[input].placeholder = 'Must not be empty';
      editInputs[input].style.setProperty('--s', 'scale(1)')
    }
  }

  if(checkIfAFieldIsEmpty(editInputs) === false){
    if(editInputs.bookCompletedPages.value <= editInputs.bookPages.value && editInputs.bookPages != 0){

      editBook();

      editInputs.bookTitle.value = '';
      editInputs.bookAuthor.value = '';
      editInputs.bookPages.value = '';
      editInputs.bookCompletedPages.value = '';
      closeModal(modal);
    } else if(editInputs.bookCompletedPages.value > editInputs.bookPages.value && editInputs.bookPages != 0){
      editInputs.bookCompletedPages.value = '';
      editInputs.bookCompletedPages.placeholder = 'Must be less'
      editInputs.bookCompletedPages.style.setProperty('--s', 'scale(1)');
    } else{
      editInputs.bookPages.value = '';
      editInputs.bookPages.placeholder = `Can't be 0`;
      editInputs.bookPages.style.setProperty('--s', 'scale(1)');
    }
  }
})

function editBook(){
  myLibrary[bookToBeEdited].title = editInputs.bookTitle.value
  myLibrary[bookToBeEdited].author = editInputs.bookAuthor.value
  myLibrary[bookToBeEdited].pages = parseInt(editInputs.bookPages.value)
  myLibrary[bookToBeEdited].completedPages = parseInt(editInputs.bookCompletedPages.value);

  document.querySelector(`.book[data-number="${bookToBeEdited}"] .book-title`).textContent = 
  myLibrary[bookToBeEdited].title;

  document.querySelector(`.book[data-number="${bookToBeEdited}"] .book-author`).textContent = 
  `by ${myLibrary[bookToBeEdited].author}`;

  document.querySelector(`.book[data-number="${bookToBeEdited}"] .total-pages`).textContent = 
  myLibrary[bookToBeEdited].pages;

  document.querySelector(`.book[data-number="${bookToBeEdited}"] .pages-read`).textContent = 
  myLibrary[bookToBeEdited].completedPages;

  if(myLibrary[bookToBeEdited].pages !== myLibrary[bookToBeEdited].completedPages){
    myLibrary[bookToBeEdited].read = false;
    document.querySelector(`.book[data-number="${bookToBeEdited}"] .book-mark`).style.opacity = '0';
  } else{
    myLibrary[bookToBeEdited].read = true;
    document.querySelector(`.book[data-number="${bookToBeEdited}"] .book-mark`).style.opacity = '1';
  }

  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  closeModal(modal2);
}

// Delete book buttons

function addDeleteBookButtonsEventListener(){
  deleteBookButtons = document.querySelectorAll('.book-delete');
  deleteBookButtons.forEach(button => {
    button.removeEventListener('click', deleteBook);
    button.addEventListener('click', deleteBook);
  })
}

function deleteBook(){
  let deletedBook = parseInt(this.closest('.book').dataset.number);
  console.log(deletedBook);
  for(i = deletedBook + 1; i < myLibrary.length; i++){
    document.querySelector(`.book[data-number="${i}"`).dataset.number = 
    document.querySelector(`.book[data-number="${i}"`).dataset.number - 1;
  }
  myLibrary.splice(deletedBook, 1);
  this.closest('.book').remove();
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}


// Edit Buttons

function addBookEditButtonsEventListener(){
  bookEditButtons = document.querySelectorAll('.book-edit')
  bookEditButtons.forEach(button =>{
    button.removeEventListener('click', changeEditFieldsValues)
    button.addEventListener('click', changeEditFieldsValues)
  })
}

function changeEditFieldsValues(){
  bookToBeEdited = parseInt(this.closest('.book').dataset.number);
  editInputs.bookTitle.value = myLibrary[bookToBeEdited].title;
  editInputs.bookAuthor.value = myLibrary[bookToBeEdited].author;
  editInputs.bookPages.value = myLibrary[bookToBeEdited].pages;
  editInputs.bookCompletedPages.value = myLibrary[bookToBeEdited].completedPages;
}

// Number panel

function addBookNumberPanelEventListener(){
  decreaseButtons = document.querySelectorAll('.page-rest');
  increaseButtons = document.querySelectorAll('.page-add');

// Decrease Buttons

  decreaseButtons.forEach(button =>{
    button.removeEventListener('click', decreasePagesRead)
    button.addEventListener('click', decreasePagesRead)
  })

function decreasePagesRead(){
  let selectedButton = parseInt(this.closest('.book').dataset.number);
  if(myLibrary[selectedButton].completedPages > 0){
    myLibrary[selectedButton].completedPages = myLibrary[selectedButton].completedPages - 1;
    document.querySelector(`.book[data-number="${selectedButton}"] .pages-read`).textContent = myLibrary[selectedButton].completedPages;
    if(myLibrary[selectedButton].completedPages !== myLibrary[selectedButton].pages){
      myLibrary[selectedButton].read = false;
      document.querySelector(`.book[data-number="${selectedButton}"] .book-mark`).style.opacity = '0';
    }
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  }
}

// Increase buttons

  increaseButtons.forEach(button =>{
    button.removeEventListener('click', increasePagesRead)
    button.addEventListener('click', increasePagesRead)
  })
}

function increasePagesRead(){
  let selectedButton = parseInt(this.closest('.book').dataset.number);
  if(myLibrary[selectedButton].completedPages < myLibrary[selectedButton].pages){
    myLibrary[selectedButton].completedPages = myLibrary[selectedButton].completedPages + 1;
    document.querySelector(`.book[data-number="${selectedButton}"] .pages-read`).textContent = myLibrary[selectedButton].completedPages;
    if(myLibrary[selectedButton].completedPages == myLibrary[selectedButton].pages){
      myLibrary[selectedButton].read = true;
      document.querySelector(`.book[data-number="${selectedButton}"] .book-mark`).style.opacity = '1';
    }
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  } 
}

// Read button

function addReadButtonsEventListener(){
  readButtons = document.querySelectorAll('.book-mark-complete');
  readButtons.forEach(button => {

    button.removeEventListener('click', markButtonAsRead)
    button.addEventListener('click', markButtonAsRead)
  })
}

function markButtonAsRead(){
    let selectedButton = parseInt((this.closest('.book').dataset.number));
    myLibrary[selectedButton].completedPages = myLibrary[selectedButton].pages;
    myLibrary[selectedButton].read = true;
    document.querySelector(`.book[data-number="${selectedButton}"] .pages-read`).textContent = myLibrary[selectedButton].completedPages;
    document.querySelector(`.book[data-number="${selectedButton}"] .book-mark`).style.opacity = '1';
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// Modal

const overlay = document.getElementById('overlay')

function updateModalButtons(){
  openModalButtons = document.querySelectorAll('[data-modal-target]');
  closeModalButtons = document.querySelectorAll('[data-close-button]');

  openModalButtons.forEach(button => {
    button.removeEventListener('click', openModalButton);
    button.addEventListener('click', openModalButton);

    function openModalButton(){
      const modal = document.querySelector(button.dataset.modalTarget)
      openModal(modal);
    }
  })

  closeModalButtons.forEach(button => {
    button.removeEventListener('click', closeModalButton)
    button.addEventListener('click', closeModalButton)

    function closeModalButton(){
      const modal = button.closest('.modal')
      closeModal(modal)
    }
  })
}

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

