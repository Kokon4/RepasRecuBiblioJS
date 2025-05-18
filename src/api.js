const API_URL = 'http://localhost:3000/';

export async function getAutores() {
  const response = await fetch(API_URL + 'autores');
  return await response.json();
}

export async function getTema(idCategoria) {
  const response = await fetch(API_URL + 'temas?categoria=' + idCategoria);
  const tema = await response.json();
  return tema.nombre;
}

export async function addLlibre(libro) {
  const response = await fetch(API_URL + 'libros', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(libro)
  });
  return await response.json();
}
export async function borrarLibro(id) {
  const response = await fetch(API_URL + 'libros/' + id, {
    method: 'DELETE'
  });
  return await response.json();
}

export async function getTemas() {
  const response = await fetch(API_URL + 'temas');
  return await response.json();
}

export async function getLibrosAutor(autorId){
  const response = await (fetch(API_URL + 'libros?autor=' + autorId));
  return await response.json();
}

export async function getCar(id) {
  const response = await fetch(API_URL + 'cars/' + id);
  return await response.json();
}

export async function getNoValidatedCars() {
  const response = await fetch(API_URL + 'cars?validated=false');
  return await response.json();
}

export async function validateCar(id) {
  const response = await fetch(API_URL + 'cars/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      validated: true
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error('Error validant: ' + text);
  }

  return await response.json();
}

export async function deleteCar(id) {
  const response = await fetch(API_URL + 'cars/' + id, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error('Error eliminant: ' + text);
  }

  return true;
}

export async function updateCar(car) {
    const response = await fetch(API_URL + 'cars/' + car.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(car)
    });
  
    if (!response.ok) {
      const text = await response.text();
      throw new Error('Error actualitzant: ' + text);
    }
  
    return await response.json();
  }
  