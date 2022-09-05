import { Entity, Vector2D } from '@/utils'
import { EnemyDrawComponent, EnemyLocomotionAnimatedComponent } from './components'
import { Node } from '@/node'
import { Grid } from '@/grid'
import { EnemyController } from '@/enemy-controller'
import { Settings } from '@/settings'
import { Pathfinder } from '@/pathfinder'

export class Enemy extends Entity {
  private readonly _locomotionComponent: EnemyLocomotionAnimatedComponent
  private readonly _enemyDrawComponent: EnemyDrawComponent
  private _lastOccupationStarted = 0
  private _pathfinder: Pathfinder
  private _currentPath: Node[] = []
  private _beingDestroyed = false
  public get BeingDestroyed(): boolean {
    return this._beingDestroyed
  }

  public get CurrentPath(): Node[] {
    return this._currentPath
  }

  public get Grid(): Grid {
    return this._controller.Grid
  }

  public get Node(): Node {
    return this._locomotionComponent.Node
  }

  public get Position(): Vector2D | null {
    return this._locomotionComponent.Position
  }

  constructor(node: Node, private readonly _controller: EnemyController) {
    super()

    this._pathfinder = new Pathfinder(this.Grid, Grid.Heuristic)

    this._locomotionComponent = new EnemyLocomotionAnimatedComponent(node)
    this._enemyDrawComponent = new EnemyDrawComponent()
  }

  public Awake(): void {
    this.AddComponent(this._locomotionComponent)
    this.AddComponent(this._enemyDrawComponent)

    super.Awake()
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)

    if(this.Node.IsCorrupted && this._currentPath.length < 1){
      this.DeterminePathToNext(this.Node)
    }

    if(this.Node && !this._lastOccupationStarted){
      this._lastOccupationStarted = +(new Date())

      return
    }

    const currentTime = +(new Date())
    if(currentTime - this._lastOccupationStarted >= Settings.enemy.occupationTime){
      this.Node.Corrupt()
      this.Kill(false)
    }
  }

  public DeterminePathToNext(node: Node): void {
    this._currentPath.forEach(item => item.IsOnPath = false)
    this._currentPath = this._pathfinder.CalculatePath(node) as Node[]
    this._currentPath.forEach(item => item.IsOnPath = true)
  }

  public ResetCorruptionTimer(): void {
    this._lastOccupationStarted = 0
  }

  public ClearDraw(): void {
    this._enemyDrawComponent.Clear()
  }

  public Kill(violently: boolean): void {
    this.Node.Enemy = null
    this._currentPath = []

    this.ResetCorruptionTimer()

    if(violently){
      this._beingDestroyed = true
      this.RemoveComponent(EnemyLocomotionAnimatedComponent)
    } else {
      this.ClearDraw()
      this._controller.Destroy(this)
    }
  }
}
