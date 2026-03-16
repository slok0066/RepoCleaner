import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  created_at: string;
  owner: {
    login: string;
  };
}

export interface FetchReposResponse {
  repos: Repository[];
  error?: string;
}

export interface DeleteRepoResponse {
  success: boolean;
  error?: string;
}

export async function fetchUserRepositories(token: string): Promise<FetchReposResponse> {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/user/repos?per_page=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    return {
      repos: response.data,
    };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Failed to fetch repositories';
    
    return {
      repos: [],
      error: errorMessage,
    };
  }
}

export async function deleteRepository(
  token: string,
  owner: string,
  repo: string
): Promise<DeleteRepoResponse> {
  try {
    await axios.delete(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Failed to delete repository';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export function validateToken(token: string): { valid: boolean; error?: string } {
  if (!token || token.trim().length === 0) {
    return {
      valid: false,
      error: 'Token cannot be empty',
    };
  }

  // GitHub tokens start with ghp_ or github_pat_
  if (!token.match(/^(ghp_|github_pat_)/)) {
    return {
      valid: false,
      error: 'Invalid token format. GitHub tokens should start with ghp_ or github_pat_',
    };
  }

  return { valid: true };
}
