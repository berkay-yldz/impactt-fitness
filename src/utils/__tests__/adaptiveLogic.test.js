import { describe, it, expect } from 'vitest';
import { downgradeProgramLevel } from '../adaptiveLogic';

describe('adaptiveLogic Çekirdeği Testleri', () => {
  const mockDb = {}; // Veritabanı işlemini taklit eden boş obje

  it('Advanced seviyesini Intermediate seviyesine düşürmeli', async () => {
    const newLevel = await downgradeProgramLevel('test1', 'advanced', mockDb);
    expect(newLevel).toBe('intermediate');
  });

  it('Beginner seviyesindeki kullanıcıyı aynı bırakmalı', async () => {
    const newLevel = await downgradeProgramLevel('test3', 'beginner', mockDb);
    expect(newLevel).toBe('beginner');
  });
});