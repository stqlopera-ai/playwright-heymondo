import { APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_URL;

export async function registerUser(request: APIRequestContext) {
  const ts = Date.now();
  const email = `pw_${ts}@mailinator.com`;
  const password = `Pw${ts}!Aa`;

  const response = await request.post(`${API_URL}/users/register`, {
    data: {
      first_name: 'PW',
      last_name: 'Test',
      email,
      password,
      phone: '0612345678',
    },
  });

  if (!response.ok()) {
    throw new Error(`Failed to register user: ${response.status()}`);
  }

  return { email, password };
}
