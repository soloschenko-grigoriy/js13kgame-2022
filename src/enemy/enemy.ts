import { Entity, Vector2D } from '@/utils'
import {EnemyDrawComponent, EnemyLocomotionAnimatedComponent } from './components'
import { Node } from '@/node'
import { Grid } from '@/grid'

export class Enemy extends Entity {
  private readonly _locomotionComponent: EnemyLocomotionAnimatedComponent
  public AllowToMove = false

  public get Grid(): Grid {
    return this._grid
  }

  public get Node(): Node {
    return this._locomotionComponent.Node
  }

  public get Position(): Vector2D | null {
    return this._locomotionComponent.Position
  }

  constructor(node: Node, private readonly _grid: Grid) {
    super()

    this._locomotionComponent = new EnemyLocomotionAnimatedComponent(node)
  }

  public Awake(): void {
    this.AddComponent(this._locomotionComponent)
    this.AddComponent(new EnemyDrawComponent())

    super.Awake()
  }
}
