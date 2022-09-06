import { Vector2D } from '@/utils'
import { Node } from '@/node'
import { EnemyLocomotionComponent } from './locomotion'
import { Settings } from '@/settings'

export class EnemyLocomotionAnimatedComponent extends EnemyLocomotionComponent {
  private _currentPosition: Vector2D
  private _startPosition: Vector2D
  private _timeStarted: number
  private _isInProgress = false

  public get Position(): Vector2D {
    return this._currentPosition
  }

  constructor(node: Node) {
    super(node)
    this._currentPosition = this._node.Center
  }

  public Update(deltaTime: number): void {
    if (!this._node) {
      return
    }

    if (this._isInProgress && this.Entity.CurrentPath.length < 1) {
      this._isInProgress = false

      return
    }

    const next = this.Entity.CurrentPath[0]
    if (this._isInProgress && next) {
      return this.Locomote(this._node, next)
    }

    this._isInProgress = true
    this._startPosition = this._node.Center
    this._timeStarted = Date.now()
  }

  private Locomote(node: Node, next: Node): void {
    const targetPosition = next.Center
    const progress = (Date.now() - this._timeStarted) / Settings.enemy.locomotion.duration
    node.Enemy = null

    this.Entity.ClearDraw()
    this._previousPosition = this._currentPosition
    if (progress >= 1) {
      this.Entity.CurrentPath.shift()
      next.IsOnPath = false

      this._isInProgress = false
      this._previousPosition = this._currentPosition
      this._currentPosition = targetPosition
      this.Node = next
    } else {
      this._currentPosition = Vector2D.Lerp(this._startPosition, targetPosition, progress)
    }
  }

  public Stop(): void {
    this._isInProgress = false
  }
}
