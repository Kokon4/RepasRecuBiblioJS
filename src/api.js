const API_URL = 'http://localhost:3000/';

export async function getCars() {
  const response = await fetch(API_URL + 'cars');
  return await response.json();
}

export async function getOrigins() {
  const response = await fetch(API_URL + 'origins');
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
  