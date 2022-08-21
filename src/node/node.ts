import { Building, BuildingType } from '@/buildings'
import { Enemy } from '@/enemy'
import { Entity, Vector2D, IGraphNode } from '@/utils'
import { NodeDrawComponent } from './components'

export class Node extends Entity implements IGraphNode {
  public IsOnPath = false
  public Enemy: Enemy | null = null
  public get Building() : Building | null {
    return this._building
  }
  public get IsCorrupted(): boolean {
    return this._isCorrupted
  }

  private readonly _drawComponent: NodeDrawComponent
  private _building: Building | null = null
  private _isCorrupted = false

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

    this._drawComponent = new NodeDrawComponent()
  }

  public get IsGoodNextTarget(): boolean {
    return !this.Enemy && !this.IsCorrupted
  }

  public Awake(): void {
    this.AddComponent(this._drawComponent)

    super.Awake()
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)

    if(this._building){
      this._building.Update(deltaTime)
    }
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

  public Corrupt(): void {
    this._isCorrupted = true
    this._building?.Destroy()

    this._building = null
  }

  public Build(type: BuildingType): void {
    if(this._building){
      throw new Error('This node already has a building!')
    }

    this._building = new Building(type, this)
    this._building.Awake()
  }
}
