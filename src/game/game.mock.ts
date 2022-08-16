import { Game } from '@/game'
import { mockGridFactory } from '@/grid'

export const mockGameFactory = (
  grid = mockGridFactory(),
): Game => new Game(grid)
