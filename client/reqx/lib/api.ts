import { Friend } from './db';

const API_BASE_URL = 'https://reqx.up.railway.app';

export async function getFriends(): Promise<Friend[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/friends`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw new Error(`Network error: ${error.message}`);
    }
    throw error;
  }
}

export async function getFriend(email: string): Promise<Friend> {
  const response = await fetch(`${API_BASE_URL}/friend?id=${email}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    credentials: 'omit'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function addFriend(friend: Friend): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/friend`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    credentials: 'omit',
    body: JSON.stringify(friend),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function updateFriend(friend: Friend): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/friend`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    credentials: 'omit',
    body: JSON.stringify(friend),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function deleteFriend(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/friend?id=${email}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    credentials: 'omit'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
