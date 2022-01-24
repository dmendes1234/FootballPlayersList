let selectedRow = null; // to check if the modal box is in the add or edit mode

/*      pagination and search      */

let dataTable = $('#footballersTable').DataTable(
    {
        pageLength: 5,
        lengthMenu: [5, 10, 20],
        language: {
            searchPlaceholder: "Start typing..."
        },
        columnDefs: [
            { orderable: false, targets: [7, 8] } // disable sorting of price column
        ],
    }
);

$('#searchBox').keyup(function () {
    dataTable.search($(this).val()).draw();
})

/*      open-close modal       */

const addBtn = document.querySelector('.addBtn');
const modal = document.querySelector('.modal');
const quitBtn = document.querySelector('.quitBtn');

function openModal(modal) {
    const modalHeadline = document.getElementById('modal-headline');
    if (selectedRow == null) {    // add mode
        modalHeadline.innerHTML = 'Add player';
    }
    else { // edit mode
        modalHeadline.innerHTML = 'Edit player';
    }

    modal.style.display = 'block';
}

addBtn.addEventListener('click', () => {
    openModal(modal);
});

const hideElement = (element) => {
    element.style.display = 'none';
}

modal.addEventListener('click', (event) => {
    if (event.target == modal) {
        hideElement(modal);
        resetForm();
    }
});

quitBtn.addEventListener('click', () => {
    hideElement(modal);
    resetForm();
});

/*      submit form - insert and edit data      */

const successModal = document.querySelector('.success-modal');
function openSuccessModal() {
    successModal.style.display = 'block';
}

const contiuneBtn = document.querySelector('.continueBtn');
contiuneBtn.addEventListener('click', () => {
    hideElement(successModal);
})

const backBtn = document.querySelector('.backBtn');
backBtn.addEventListener('click', () => {
    hideElement(successModal);
    hideElement(modal);
})

function submitForm() {
    if (validate()) {
        const formData = readFormData();
        if (selectedRow == null) {
            insertNewData(formData);
            openSuccessModal();
        }
        else {
            updateData(formData);
            hideElement(modal);
        }
        resetForm();
    }
}

const saveBtn = document.querySelector('.saveBtn');
saveBtn.addEventListener('click', (event) => {
    event.preventDefault();
    submitForm();
})

function readFormData() {
    const formData = {};
    formData['firstName'] = document.getElementById('fname').value;
    formData['lastName'] = document.getElementById('lname').value;
    formData['goals'] = document.getElementById('goals').value === '' ? '-' : document.getElementById('goals').value;
    formData['assists'] = document.getElementById('assists').value === '' ? '-' : document.getElementById('assists').value;
    formData['yellows'] = document.getElementById('ycards').value === '' ? '-' : document.getElementById('ycards').value;
    formData['reds'] = document.getElementById('rcards').value === '' ? '-' : document.getElementById('rcards').value;
    formData['birth'] = document.getElementById('birth').value === '' ? '-' : document.getElementById('birth').value;
    // format price to currency output
    let price = document.getElementById('price').value;
    formData['price'] = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);

    return formData;
}

function insertNewData(data) {
    const table = document.getElementById('footballersTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.length);

    const cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.firstName;
    cell1.setAttribute('data-label', 'First name');
    const cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.lastName;
    cell2.setAttribute('data-label', 'Last name');
    const cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.goals;
    cell3.setAttribute('data-label', 'Goals');
    const cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.assists;
    cell4.setAttribute('data-label', 'Assists');
    const cell5 = newRow.insertCell(4);
    cell5.innerHTML = data.yellows;
    cell5.setAttribute('data-label', 'Yellow cards');
    const cell6 = newRow.insertCell(5);
    cell6.innerHTML = data.reds;
    cell6.setAttribute('data-label', 'Red cards');
    const cell7 = newRow.insertCell(6);
    cell7.innerHTML = data.birth;
    cell7.setAttribute('data-label', 'Birth date');
    const cell8 = newRow.insertCell(7);
    cell8.innerHTML = data.price;
    cell8.setAttribute('data-label', 'Price');
    const cell9 = newRow.insertCell(8);
    cell9.innerHTML = `<article class="tableBtns">
                            <button class="editBtn" onClick="onEdit(this)">Edit</button>
                            <button class="deleteBtn" onClick="onDelete(this)">Delete</button>
                       </article>`;
    cell9.setAttribute('data-label', 'Action');

    dataTable.row.add(newRow).draw(false);
    dataTable.order([1, 'asc']).draw();
    //dataTable.page('last').draw(false);
}

function resetForm() {
    const form = document.querySelector('.modal-form');
    form.reset();
    resetValidation();
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement.parentElement;
    document.getElementById('fname').value = selectedRow.cells[0].innerHTML;
    document.getElementById('lname').value = selectedRow.cells[1].innerHTML;
    document.getElementById('goals').value = selectedRow.cells[2].innerHTML;
    document.getElementById('assists').value = selectedRow.cells[3].innerHTML;
    document.getElementById('ycards').value = selectedRow.cells[4].innerHTML;
    document.getElementById('rcards').value = selectedRow.cells[5].innerHTML;
    document.getElementById('birth').value = selectedRow.cells[6].innerHTML;

    let priceFormated = selectedRow.cells[7].innerHTML
    let priceReversed = parseLocaleNumber(priceFormated, 'de')
    document.getElementById('price').value = priceReversed;
    openModal(modal);
}

function parseLocaleNumber(stringNumber, locale) {
    var thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(/\p{Number}/gu, '');
    var decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(/\p{Number}/gu, '');

    return parseFloat(stringNumber
        .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
        .replace(new RegExp('\\' + decimalSeparator), '.')
    );
}

function updateData(formData) {
    selectedRow.cells[0].innerHTML = formData.firstName;
    selectedRow.cells[1].innerHTML = formData.lastName;
    selectedRow.cells[2].innerHTML = formData.goals;
    selectedRow.cells[3].innerHTML = formData.assists;
    selectedRow.cells[4].innerHTML = formData.yellows;
    selectedRow.cells[5].innerHTML = formData.reds;
    selectedRow.cells[6].innerHTML = formData.birth;
    selectedRow.cells[7].innerHTML = formData.price;
}

const deleteModal = document.querySelector('.delete-confirmation-modal');
const confirmDeleteBtn = document.querySelector('.deletebtn');
const cancelDeleteBtn = document.querySelector('.cancelbtn');
function onDelete(td) {
    deleteModal.style.display = 'block';
    document.querySelector('.deletebtn').onclick = function () { // confirm deletion
        const row = td.parentElement.parentElement.parentElement;
        document.getElementById('footballersTable').deleteRow(row.rowIndex);
        dataTable.row(row).remove();
        dataTable.draw();
        deleteModal.style.display = 'none';
    }
}

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
})

/*      validate form      */

const firstNameValidationError = document.getElementById('firstNameValidationError');
const firstNameInput = document.getElementById('fname');
const lastNameValidationError = document.getElementById('lastNameValidationError');
const lastNameInput = document.getElementById('lname');
function validate() {
    let isValid = true;
    if (firstNameInput.value == '') {
        isValid = false;
        firstNameValidationError.classList.remove('hide');
        firstNameInput.style.borderColor = 'red';
    }
    else if (lastNameInput.value == '') {
        isValid = false;
        lastNameValidationError.classList.remove('hide');
        lastNameInput.style.borderColor = 'red';
    }
    else {
        isValid = true;
        resetValidation();
    }

    return isValid;
}

function resetValidation() {
    if (!firstNameValidationError.classList.contains('hide')) {
        firstNameValidationError.classList.add('hide');
        firstNameInput.style.borderColor = '#ccc'
    }
    if (!lastNameValidationError.classList.contains('hide')) {
        lastNameValidationError.classList.add('hide');
        lastNameInput.style.borderColor = '#ccc'
    }
}





