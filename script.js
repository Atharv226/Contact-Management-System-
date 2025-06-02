let editIndex = null;

function toggleTheme() {
  document.body.classList.toggle('light-mode');
}

function loadContacts() {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  const filter = document.getElementById('search').value.toLowerCase();
  const list = document.getElementById('contactList');
  list.innerHTML = '';

  contacts.forEach((contact, i) => {
    if (contact.name.toLowerCase().includes(filter)) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${contact.name}</h3>
        <p>📞 ${contact.phone}</p>
        <p>📧 ${contact.email}</p>
        <button onclick="editContact(${i})">Edit</button>
        <button onclick="deleteContact(${i})">Delete</button>
      `;
      list.appendChild(card);
    }
  });
}

function validateEmail(email) {
  return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\d{7,15}$/.test(phone);
}

function addContact() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !validatePhone(phone) || !validateEmail(email)) {
    alert("Please enter valid name, phone (7–15 digits), and email.");
    return;
  }

  let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');

  if (editIndex !== null) {
    contacts[editIndex] = { name, phone, email };
    editIndex = null;
  } else {
    contacts.push({ name, phone, email });
  }

  localStorage.setItem('contacts', JSON.stringify(contacts));
  clearForm();
  loadContacts();
}

function editContact(i) {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  const c = contacts[i];
  document.getElementById('name').value = c.name;
  document.getElementById('phone').value = c.phone;
  document.getElementById('email').value = c.email;
  editIndex = i;
}

function deleteContact(i) {
  let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  if (confirm('Delete this contact?')) {
    contacts.splice(i, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    loadContacts();
  }
}

function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';
  editIndex = null;
}

function exportCSV() {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  let csv = "Name,Phone,Email\n" + contacts.map(c =>
    `${c.name},${c.phone},${c.email}`).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "contacts.csv";
  link.click();
}

// CSV Import
document.getElementById('csvFile').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const rows = e.target.result.split('\n').slice(1);
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');

    rows.forEach(row => {
      const [name, phone, email] = row.split(',');
      if (name && phone && email && validatePhone(phone.trim()) && validateEmail(email.trim())) {
        contacts.push({ name: name.trim(), phone: phone.trim(), email: email.trim() });
      }
    });

    localStorage.setItem('contacts', JSON.stringify(contacts));
    loadContacts();
  };
  reader.readAsText(file);
});

window.onload = loadContacts;
