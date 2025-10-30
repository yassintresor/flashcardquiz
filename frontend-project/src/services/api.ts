// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to handle API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const api = {
  // Decks endpoints
  getDecks: () => apiRequest(`${API_BASE_URL}/decks`),
  getDeck: (id: string) => apiRequest(`${API_BASE_URL}/decks/${id}`),
  createDeck: (data: any) => apiRequest(`${API_BASE_URL}/decks`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateDeck: (id: string, data: any) => apiRequest(`${API_BASE_URL}/decks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteDeck: (id: string) => apiRequest(`${API_BASE_URL}/decks/${id}`, {
    method: 'DELETE',
  }),

  // Cards endpoints
  getCards: (deckId: string) => apiRequest(`${API_BASE_URL}/cards/deck/${deckId}`),
  getCard: (id: string) => apiRequest(`${API_BASE_URL}/cards/${id}`),
  createCard: (deckId: string, data: any) => apiRequest(`${API_BASE_URL}/cards/deck/${deckId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCard: (id: string, data: any) => apiRequest(`${API_BASE_URL}/cards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCard: (id: string) => apiRequest(`${API_BASE_URL}/cards/${id}`, {
    method: 'DELETE',
  }),

  // Quiz endpoints
  startQuiz: (data: any) => apiRequest(`${API_BASE_URL}/quiz/start`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  submitAnswer: (data: any) => apiRequest(`${API_BASE_URL}/quiz/answer`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  submitScore: (data: any) => apiRequest(`${API_BASE_URL}/quiz/submit`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};