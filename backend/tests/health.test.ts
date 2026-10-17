import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('API health', () => {
  it('returns a healthy status without requiring a database query', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
