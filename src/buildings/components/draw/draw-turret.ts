import { IComponent, Vector2D } from '@/utils'
import { CanvasLayer } from '@/canvas-layer'
import { Settings } from '@/settings'
import { Turret } from '@/buildings/turret'

export class TurretDrawComponent implements IComponent {
  public Entity: Turret

  public Awake(): void {
    this.Draw()
  }

  public Update(deltaTime: number): void {
    this.Draw()
  }

  private Draw(): void {
    CanvasLayer.Background.StrokeCircle(
      this.Entity.Node.Center,
      Settings.buildings.turret.radius,
      Settings.buildings.turret.colors.bg
    )

    CanvasLayer.Background.FillSector(
      this.Entity.Node.Center,
      Settings.buildings.turret.radius,
      Settings.buildings.turret.colors.bg,
      -90,
      this.DegreeForCharge,
      true
    )

    CanvasLayer.Background.DrawText(
      this.Entity.Population.toString(),
      new Vector2D(this.Entity.Node.Center.x - 2, this.Entity.Node.Center.y + 3),
      Settings.buildings.turret.colors.text
    )
  }

  private get DegreeForCharge(): number {
    if(this.Entity.Charge === 4){
      return 270
    }

    if(this.Entity.Charge === 3){
      return 0
    }

    if(this.Entity.Charge === 2){
      return 90
    }

    if(this.Entity.Charge === 1){
      return 180
    }

    return -90
  }
}
