import { Enemy } from '@/enemy'
import { Entity, Vector2D, IGraphNode } from '@/utils'
import { NodeDrawComponent } from './components'

export class Node extends Entity implements IGraphNode {
  public IsOnPath = false
  public Enemy: Enemy | null = null
  public IsCorrupted = false

  public get Size(): Vector2D {
    return new Vector2D(
      this.End.x - this.Start.x,
      this.End.y - this.Start.y
    )
  }

  public get Center(): Vector2D {
    return new Vector2D(
      this.Start.x + this.Size.x / 2,
      this.Start.y + this.Size.y / 2
    )
  }

  public get Position(): Vector2D {
    return this.Index
  }

  constructor(
    public readonly Start: Vector2D,
    public readonly End: Vector2D,
    public readonly Index: Vector2D,
    public readonly Neighbors: Node[]
  ) {
    super()
  }

  public Awake(): void {
    this.AddComponent(new NodeDrawComponent())

    super.Awake()
  }

  public Occupies(point: Vector2D): boolean {
    if (point.x < this.Start.x) {
      return false
    }

    if (point.x > this.End.x) {
      return false
    }

    if (point.y < this.Start.y) {
      return false
    }

    if (point.y > this.End.y) {
      return false
    }

    return true
  }
}
