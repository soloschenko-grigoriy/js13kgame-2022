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

    return new Vector2D(position.x - Settings.grid.nodeSize / 2, position.y - Settings.grid.nodeSize / 2)
  }

  public Awake(): void {
    // this.Clear()
  }

  public Update(deltaTime: number): void {
    // this.Clear()
    this.Draw()
  }

  private Draw(): void {
    CanvasLayer.Foreground.DrawImg('tank.png', this.Position, this.Entity.Node.Size)

    if(this.Entity.BeingDestroyed){
      CanvasLayer.Foreground.DrawImg('explosion.png', new Vector2D(this.Position.x + 12, this.Position.y + 5))
      return
    }
  }

  public Clear(): void {
    CanvasLayer.Foreground.ClearRect(
      this.Position,
      new Vector2D(Settings.grid.nodeSize, Settings.grid.nodeSize)
    )
  }
}
