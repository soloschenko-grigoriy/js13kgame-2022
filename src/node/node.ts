import { IBuilding, BuildingType } from '@/buildings'
import { House, Turret } from '@/buildings'
import { Enemy } from '@/enemy'
import { Game } from '@/game'
import { Nation } from '@/nation'
import { Settings } from '@/settings'
import { Entity, Vector2D, IGraphNode, random } from '@/utils'
import { NodeDrawComponent } from './components'

export enum Decoration {
  None,
  Tree,
  Forest
}

export class Node extends Entity implements IGraphNode {
  public isOnPath = false
  public isHovered = false
  public Enemy: Enemy | null = null

  private readonly _drawComponent: NodeDrawComponent
  private _building: IBuilding | null = null
  private _isCorrupted = false
  private _templateBuildEml: HTMLElement
  private _templateCorruptedEml: HTMLElement
  private _buildTowerBtn: HTMLButtonElement
  private _decoration: Decoration = Decoration.None
  private _onBuildTower = ():void => this.BuildTower()

  public get Building() : IBuilding | null {
    return this._building
  }

  public get IsCorrupted(): boolean {
    return this._isCorrupted
  }

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

  public get IsGoodNextTarget(): boolean {
    return !this.Enemy && !this.IsCorrupted
  }


  public get Decoration(): Decoration {
    return this._decoration
  }

  public get IsAccessible(): boolean {
    return !this._building || !(this._building instanceof Turret)
  }

  constructor(
    public readonly Start: Vector2D,
    public readonly End: Vector2D,
    public readonly Index: Vector2D,
    public readonly Neighbors: Node[],
  ) {
    super()

    this._drawComponent = new NodeDrawComponent()
  }

  public Awake(): void {
    this.AddComponent(this._drawComponent)

    super.Awake()

    this._templateBuildEml = document.body.querySelector('#build') as HTMLElement
    this._templateCorruptedEml = document.body.querySelector('#corrupted') as HTMLElement

    if(Math.random() > 0.85){
      this._decoration = random(1, 2)
    }
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
  }

  public Release(): void {
    this._building = null
  }

  public Build(type: BuildingType): IBuilding | null{
    if(this._building){
      throw new Error('E') // This node already has a building!
    }

    switch(type){
      case BuildingType.Turret:
        this.TryBuildTower(Game.GetInstance().Nation)
        break
      case BuildingType.House: this._building = new House(this, Game.GetInstance().Nation)
        break
    }

    this._building?.Awake()

    return this._building
  }

  public ShowModal(): void {
    if(this._building){
      this._building.ShowModal()
      return
    }

    if(this._isCorrupted){
      Game.GetInstance().ShowModal(this._templateCorruptedEml)
      return
    }

    if(this.Enemy){
      this.Enemy.ShowModal()
      return
    }

    Game.GetInstance().ShowModal(this._templateBuildEml, () => this.OnModalClose())

    this._buildTowerBtn = this._templateBuildEml.querySelector('#buildTowerBtn') as HTMLButtonElement
    this._buildTowerBtn.addEventListener('click', this._onBuildTower)

    if(!Game.GetInstance().Nation.GetRandomHouseWithPopulation(Settings.buildings.turret.population)){
      this._buildTowerBtn.setAttribute('disabled', 'disabled')
    } else {
      this._buildTowerBtn.removeAttribute('disabled')
    }
  }

  private TryBuildTower(nation: Nation): void {
    const house = nation.GetRandomHouseWithPopulation(Settings.buildings.turret.population)
    if(!house){
      return
    }

    this._building = new Turret(this, nation, house)
  }

  private BuildTower(): void {
    this.HideModal()

    this.Build(BuildingType.Turret)
  }

  private HideModal(): void {
    this.OnModalClose()
    this._buildTowerBtn.removeAttribute('disabled')

    Game.GetInstance().HideModal()
  }

  private OnModalClose(): void {
    this._buildTowerBtn.removeEventListener('click', this._onBuildTower)
  }
}
