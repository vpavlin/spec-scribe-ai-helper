
import axios from 'axios';

export interface AkashModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export const fetchAvailableModels = async (apiToken: string): Promise<AkashModel[]> => {
  const client = axios.create({
    baseURL: 'https://chatapi.akash.network/api/v1',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`
    }
  });

  const response = await client.get('/models');
  return response.data.data || [];
};
