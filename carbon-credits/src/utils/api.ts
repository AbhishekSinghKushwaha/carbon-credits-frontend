interface ApiResponse<T> {
    data?: T;
    error?: string;
  }
  
  export const apiCall = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: object
  ): Promise<ApiResponse<T>> => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
  
      const data: T = await res.json();
      
      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };