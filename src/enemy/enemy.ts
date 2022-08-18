import { Entity, Vector2D } from '@/utils'
import { EnemyDrawComponent, EnemyLocomotionAnimatedComponent } from './components'
import { Node } from '@/node'
import { Grid } from '@/grid'
import { EnemyController } from '@/enemy-controller'

export class Enemy extends Entity {
  private readonly _locomotionComponent: EnemyLocomotionAnimatedComponent
  private readonly _enemyDrawComponent: EnemyDrawComponent
  private _lastOccupationStarted = 0
  public AllowToMove = false

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
    if(this.Node && !this._lastOccupationStarted){
      this._lastOccupationStarted = +(new Date())

      return
    }

    const currentTime = +(new Date())
    if(currentTime - this._lastOccupationStarted > 1000 * 5){
      this.Node.IsCorrupted = true
      this.Kill()
    }
  }

  public ResetCorruption(): void {
    this._lastOccupationStarted = 0
  }

  private Kill(): void {
    this._enemyDrawComponent.Clear()
    this.ResetCorruption()
    this._controller.Destroy(this)
  }
}
