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
    CanvasLayer.Background.DrawImg2(
      'house.png',
      this.Entity.Node.Center,
    )

    CanvasLayer.Background.DrawText(
      this.Entity.Population.toString(),
      new Vector2D(this.Entity.Node.Center.x - 10, this.Entity.Node.Center.y - 10),
      Settings.buildings.house.colors.text,
      16
    )
  }

  public Clear(): void {
    CanvasLayer.Background.ClearRect(this.Entity.Node.Start, this.Entity.Node.Size)
  }
}
