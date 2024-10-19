const API_BASE_URL = "http://localhost:8081/tarjeta";


async function consumirAPI(endpoint, metodo = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const opciones = {
    method: metodo,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (data) {
    opciones.body = JSON.stringify(data);
  }

  try {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    return await respuesta.json();
  } catch (error) {
    console.error('Error al consumir la API:', error);
  }
}

async function obtenerUsuarios() {
  const users = await consumirAPI('/consulta');
  const userList = document.getElementById('user-list');

  
  userList.innerHTML = '';

  
  users.forEach(user => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${user.nombre}</td>
      <td>${user.email}</td>
      <td>${user.telefono}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${user.id})">Eliminar</button>
      </td>
    `;

    userList.appendChild(row);
  });
}

async function eliminarUsuario(userId) {
  if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    await consumirAPI(`/eliminar-cliente/${userId}`, 'DELETE');
    
    // Actualizar la lista de usuarios después de eliminar
    obtenerUsuarios();
  }
}

document.getElementById('user-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const newUser = {
    nombre: document.getElementById('name').value,
    email: document.getElementById('email').value,
    cedula: document.getElementById('cedula').value,
    telefono: document.getElementById('telefono').value
  };

  await consumirAPI('/registrar-cliente', 'POST', newUser);

  
  document.getElementById('user-form').reset();

  obtenerUsuarios();
});
obtenerUsuarios();
