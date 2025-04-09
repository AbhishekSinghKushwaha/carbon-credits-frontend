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
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data: T = await res.json();
      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  };