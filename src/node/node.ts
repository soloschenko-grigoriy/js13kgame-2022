import { IBuilding, BuildingType } from '@/buildings'
import { House, Turret } from '@/buildings'
import { Enemy } from '@/enemy'
import { Game } from '@/game'
import { Nation } from '@/nation'
import { Entity, Vector2D, IGraphNode } from '@/utils'
import { NodeDrawComponent } from './components'

export class Node extends Entity implements IGraphNode {
  public IsOnPath = false
  public Enemy: Enemy | null = null
  public get Building() : IBuilding | null {
    return this._building
  }
  public get IsCorrupted(): boolean {
    return this._isCorrupted
  }

  private readonly _drawComponent: NodeDrawComponent
  private _building: IBuilding | null = null
  private _isCorrupted = false
  private _templateBuildEml: HTMLElement
  private _templateCorruptedEml: HTMLElement
  private _buildTowerBtn: HTMLButtonElement
  // private _onBuildTower = ():void => this.Build(BuildingType.Turret, this._n)

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

    this._templateBuildEml = document.body.querySelector('#build') as HTMLElement
    this._templateCorruptedEml = document.body.querySelector('#corrupted') as HTMLElement
    this._buildTowerBtn = this._templateBuildEml.querySelector('#buildTowerBtn') as HTMLButtonElement

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

  public Build(type: BuildingType, nation: Nation): void {
    if(this._building){
      throw new Error('This node already has a building!')
    }

    switch(type){
      case BuildingType.Turret:
        this._building = new Turret(this, nation)
        break

      default: this._building = new House(this, nation)
    }

    this._building.Awake()
  }

  public ShowModal(): void {
    if(this._building){
      this._building.ShowModal()
      return
    }

    if(this._isCorrupted){
      return
    }

    Game.GetInstance().ShowModal(this._templateBuildEml)
  }

  private HideModal(): void {
    Game.GetInstance().HideModal()
  }
}
