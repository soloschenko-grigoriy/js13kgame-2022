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
    // this.Clean()
    this.Draw()
    this.DrawDebugInfo()
  }

  private Draw(): void {
    if(this.Entity.IsCorrupted){
      CanvasLayer.Background.DrawImg('grass.png', this.Entity.Start, this.Entity.Size)
      CanvasLayer.Background.DrawImg2('corrupted2.png', this.Entity.Center)
    } else {
      CanvasLayer.Background.DrawImg('grass.png', this.Entity.Start, this.Entity.Size)
    }

    // CanvasLayer.Foreground.ClearRect(this.Entity.Start, this.Entity.Size)
    if(this.Entity.isHovered){
      CanvasLayer.Background.DrawRect(this.Entity.Start, new Vector2D(this.Entity.Size.x - 2, this.Entity.Size.y - 2), Settings.grid.color.hover)
      // CanvasLayer.Foreground.FillRect(this.Entity.Start, new Vector2D(this.Entity.Size.x - 2, this.Entity.Size.y - 2), Settings.grid.color.hover)
    }
  }

  private Clean(): void {
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
