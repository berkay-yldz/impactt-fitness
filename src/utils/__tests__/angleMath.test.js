import { describe, it, expect } from 'vitest';
import { calculateAngle, isPostureCorrect } from '../angleMath';

describe('angleMath Çekirdeği Testleri', () => {
  it('Dik açıyı (90 derece) doğru hesaplamalı', () => {
    const pointA = { x: 0, y: 1 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: 1, y: 0 };
    expect(calculateAngle(pointA, pointB, pointC)).toBe(90);
  });

  it('Düz çizgiyi (180 derece) doğru hesaplamalı', () => {
    const pointA = { x: -1, y: 0 };
    const pointB = { x: 0, y: 0 };
    const pointC = { x: 1, y: 0 };
    expect(calculateAngle(pointA, pointB, pointC)).toBe(180);
  });
});