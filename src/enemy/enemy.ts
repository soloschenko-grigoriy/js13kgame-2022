import { Entity, Vector2D } from '@/utils'
import { EnemyDrawComponent, EnemyLocomotionAnimatedComponent } from './components'
import { Node } from '@/node'
import { Grid } from '@/grid'
import { EnemyController } from '@/enemy-controller'
import { Settings } from '@/settings'

export class Enemy extends Entity {
  private readonly _locomotionComponent: EnemyLocomotionAnimatedComponent
  private readonly _enemyDrawComponent: EnemyDrawComponent
  private _lastOccupationStarted = 0
  public Next: Node | null

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

    if(this.Node.IsCorrupted && this._controller.Grid.CurrentPath.length < 1){
      this._controller.Grid.DeterminePathToNext(this.Node)
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

  public ResetCorruptionTimer(): void {
    this._lastOccupationStarted = 0
  }

  public ClearDraw(): void {
    this._enemyDrawComponent.Clear()
  }

  public Kill(): void {
    this.ClearDraw()

    this.Node.Enemy = null

    this.ResetCorruptionTimer()

    this._controller.Destroy(this)
  }
}
