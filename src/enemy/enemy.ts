import { Entity, Vector2D } from '@/utils'
import { EnemyDrawComponent, EnemyLocomotionAnimatedComponent, EnemyExplosionComponent } from './components'
import { Node } from '@/node'
import { Grid } from '@/grid'
import { EnemyController } from '@/enemy-controller'
import { Settings } from '@/settings'
import { Pathfinder } from '@/pathfinder'
import { EnemyState } from './state'
import { Game } from '@/game'

export class Enemy extends Entity {
  private readonly _locomotionComponent: EnemyLocomotionAnimatedComponent
  private readonly _enemyDrawComponent: EnemyDrawComponent
  private _lastOccupationStarted = 0
  private _pathfinder: Pathfinder
  private _currentPath: Node[] = []
  private _state = EnemyState.Running
  private _attackedFrom: Node | null = null

  public get State(): EnemyState {
    return this._state
  }

  public get CurrentPath(): Node[] {
    return this._currentPath
  }

  public get Node(): Node {
    return this._locomotionComponent.Node
  }

  public get Position(): Vector2D | null {
    return this._locomotionComponent.Position
  }

  public get AttackedFrom():Node | null {
    return this._attackedFrom
  }

  constructor(node: Node, private readonly _controller: EnemyController) {
    super()

    this._pathfinder = new Pathfinder(Game.GetInstance().Grid, Grid.Heuristic)

    this._locomotionComponent = new EnemyLocomotionAnimatedComponent(node)
    this._enemyDrawComponent = new EnemyDrawComponent()
  }

  public Awake(): void {
    this.AddComponent(this._locomotionComponent)
    this.AddComponent(this._enemyDrawComponent)
    this.AddComponent(new EnemyExplosionComponent())

    super.Awake()
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)

    if(this._state === EnemyState.Exploding){
      return
    }

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
      this.Kill()
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

  public Kill(): void {
    this.Node.Enemy = null
    this.ResetCorruptionTimer()
    this.ClearDraw()
    this.RemoveComponent(EnemyDrawComponent)
    this.RemoveComponent(EnemyLocomotionAnimatedComponent)

    this._controller.Destroy(this)
  }

  public Attack(from: Node): void {
    this._attackedFrom = from
    this.Node.Enemy = null
    this._currentPath = []
    this._locomotionComponent.Stop()
    this._state = EnemyState.Exploding
  }
}
