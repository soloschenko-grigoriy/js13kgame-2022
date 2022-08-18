import { IComponent, Vector2D } from '@/utils'
import { Enemy } from '@/enemy'
import { Node } from '@/node'

export class EnemyLocomotionComponent implements IComponent {
  public Entity: Enemy

  protected _node: Node
  protected _previousPosition: Vector2D | null = null

  public get Node(): Node {
    return this._node
  }

  public set Node(v: Node) {
    this._node = v
    this._node.Enemy = this.Entity
    this.Entity.ResetCorruption()
  }

  public get Position(): Vector2D {
    return this.Node.Center
  }

  constructor(node: Node) {
    this._node = node
  }

  public Awake(): void {
    this._node.Enemy = this.Entity
  }

  public Update(deltaTime: number): void {
    /* @todo */
  }
}
