import { IComponent, Vector2D } from '@/utils'
import { CanvasLayer } from '@/canvas-layer'
import { Settings } from '@/settings'
import { House } from '@/buildings'

export class HouseDrawComponent implements IComponent {
  public Entity: House

  public Awake(): void {
    this.Draw()
  }

  public Update(deltaTime: number): void {
    this.Draw()
  }

  private Draw(): void {
    CanvasLayer.Background.FillRect(
      this.Entity.Node.Start,
      this.Entity.Node.Size,
      Settings.buildings.house.colors.bg
    )

    CanvasLayer.Background.DrawText(
      this.Entity.Population.toString(),
      new Vector2D(this.Entity.Node.Center.x - 7, this.Entity.Node.Center.y + 3),

      Settings.buildings.house.colors.text
    )
  }
}
