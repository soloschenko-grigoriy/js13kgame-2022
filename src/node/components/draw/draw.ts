import { IComponent, Color, Vector2D } from '@/utils'
import { Node } from '@/node'
import { Settings } from '@/settings'
import { CanvasLayer } from '@/canvas-layer'

export class NodeDrawComponent implements IComponent {
  public Entity: Node

  public Awake(): void {
    this.Draw()
  }

  public Update(deltaTime: number): void {
    this.Draw()
    this.DrawDebugInfo()
  }

  private Draw(): void {
    if(this.Entity.IsCorrupted){
      CanvasLayer.Foreground.ClearRect(this.Entity.Start, this.Entity.Size)
      CanvasLayer.Background.ClearRect(this.Entity.Start, this.Entity.Size)

      CanvasLayer.Background.DrawImg('grass.png', this.Entity.Start, this.Entity.Size)
      CanvasLayer.Background.DrawImg('corrupted2.png', new Vector2D(this.Entity.Start.x + 8, this.Entity.Start.y + 10))
    } else {
      CanvasLayer.Background.DrawImg('grass.png', this.Entity.Start, this.Entity.Size)
    }
  }

  private GetColor(): Color {
    // if(this.Entity.IsOnPath){
    //   return Settings.grid.color.onPath
    // }

    if(this.Entity.IsCorrupted){
      return Settings.grid.color.corrupted
    }

    return Settings.grid.color.regular
  }

  private Clear(): void {
    CanvasLayer.Background.ClearRect(this.Entity.Start, this.Entity.Size)
  }

  private DrawDebugInfo(): void {
    if (!Settings.debugMode) {
      return
    }

    const entity = this.Entity
    CanvasLayer.Background.DrawText(
      entity.Index.AsString(),
      entity.Start,
      new Color(255, 0, 0, 1)
    )
  }
}
