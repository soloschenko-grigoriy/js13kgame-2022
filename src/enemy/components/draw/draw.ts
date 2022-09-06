import { IComponent, Vector2D } from '@/utils'
import { CanvasLayer } from '@/canvas-layer'
import { Enemy, EnemyState } from '@/enemy'
import { Settings } from '@/settings'
import { Direction, Grid } from '@/grid'

export class EnemyDrawComponent implements IComponent {
  public Entity: Enemy

  private _lastRotation = this.CalcDirectionToAngle(Direction.Left)

  private get Position(): Vector2D {
    const position = this.Entity.Position
    if (!position) {
      throw new Error('E') // Attempt to draw a ship that has no Position
    }

    return position
  }

  private get LookAt(): Direction | null {
    const entity = this.Entity
    if(entity.AttackedFrom){
      return Grid.CalcRotationToLooAt(entity.Node, entity.AttackedFrom)
    }

    if(entity.CurrentPath[0]){
      return Grid.CalcRotationToLooAt(entity.Node, entity.CurrentPath[0])
    }

    return null
  }

  public Awake(): void {
    // this.Clear()
  }

  public Update(deltaTime: number): void {
    this.Clear()
    // const rotation = this._timeSinceRotation * 90

    let rotation = this._lastRotation
    if(this.LookAt !== null){
      rotation = this.CalcDirectionToAngle(this.LookAt)
      this._lastRotation = rotation
    }

    CanvasLayer.Foreground.DrawImg2(
      'tank.png',
      this.Position,
      new Vector2D(0.75, 0.75),
      rotation
    )

    // this._timeSinceRotation += deltaTime
    // if(this._timeSinceRotation > 0.5){
    //   this._timeSinceRotation = 1
    // }

    if(this.Entity.State === EnemyState.Exploding){
      CanvasLayer.Foreground.DrawImg2('explosion.png', this.Position, new Vector2D(0.75, 0.75))
      return
    }
  }

  public Clear(): void {
    CanvasLayer.Foreground.ClearRect(
      new Vector2D(this.Position.x - Settings.grid.nodeSize / 2, this.Position.y - Settings.grid.nodeSize / 2),
      new Vector2D(Settings.grid.nodeSize, Settings.grid.nodeSize)
    )
  }

  private CalcDirectionToAngle(direction: Direction): number {
    switch(direction){
      case Direction.Up: return 180
      case Direction.Right: return -90
      case Direction.Down: return 0
      case Direction.Left: return 90
    }
  }
}
