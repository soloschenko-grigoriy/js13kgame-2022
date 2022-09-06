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
      CanvasLayer.Background.DrawImg2('grass.png', this.Entity.Center, new Vector2D(3, 3))
      CanvasLayer.Background.DrawImg2('corrupted2.png', this.Entity.Center)
      return
    }

    CanvasLayer.Background.DrawImg2('grass.png', this.Entity.Center, new Vector2D(3, 3))
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
