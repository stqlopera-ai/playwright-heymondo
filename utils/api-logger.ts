import { APIResponse } from '@playwright/test';

export async function logAndParse(response: APIResponse): Promise<any> {
  const text = await response.text();
  console.log(`\n[${response.status()}] ${response.url()}`);
  console.log(text);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
