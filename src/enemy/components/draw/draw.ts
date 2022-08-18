import { IComponent, Vector2D } from '@/utils'
import { CanvasLayer } from '@/canvas-layer'
import { Enemy } from '@/enemy'
import { Settings } from '@/settings'

export class EnemyDrawComponent implements IComponent {
  public Entity: Enemy

  private get Position(): Vector2D {
    const position = this.Entity.Position
    if (!position) {
      throw new Error('Attempt to draw a ship that has no Position')
    }

    return position
  }

  public Awake(): void {
    this.Clear()
  }

  public Update(deltaTime: number): void {
    this.Clear()
    this.Draw()
  }

  private Draw(): void {
    const color = Settings.enemy.colors.a

    CanvasLayer.Foreground.FillCircle(this.Position, Settings.enemy.radius, color)
  }

  public Clear(): void {
    CanvasLayer.Foreground.ClearRect(
      new Vector2D(
        this.Position.x - Settings.grid.nodeSize / 2,
        this.Position.y - Settings.grid.nodeSize / 2
      ),
      new Vector2D(Settings.grid.nodeSize, Settings.grid.nodeSize)
    )
  }
}
