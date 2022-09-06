import { Vector2D } from '@/utils'

export interface IGraphNode {
  Position: Vector2D
  IsGoodNextTarget: boolean
  IsAccessible: boolean
}
