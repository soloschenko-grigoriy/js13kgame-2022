import { IAwake, Vector2D, Color } from '@/utils'

export class Canvas implements IAwake {
  private _elm: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _images: Record<string, HTMLImageElement> = {}
  private _atlasImg: HTMLImageElement

  private _atlasCoords = [{
    filename: 'corrupted2.png',
    frame: {x:32,y:102,w:32,h:33},
    },
    {
    filename: 'explosion.png',
    frame: {x:40,y:58,w:23,h:33},
    },
    {
    filename: 'grass.png',
    frame: {x:46,y:0,w:16,h:16},
    },
    {
    filename: 'house7.png',
    frame: {x:0,y:102,w:32,h:38},
    },
    {
    filename: 'tank.png',
    frame: {x:0,y:58,w:40,h:44},
    },
    {
    filename: 'turret3.png',
    frame: {x:0,y:0,w:46,h:58},
  }]

  public get Element(): HTMLCanvasElement {
    return this._elm
  }

  public get Context(): CanvasRenderingContext2D {
    return this._ctx
  }

  constructor(public readonly Size: Vector2D) { }

  public Awake(): void {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', `${this.Size.x}px`)
    canvas.setAttribute('height', `${this.Size.y}px`)

    document.body.appendChild(canvas)
    this._elm = canvas

    const ctx = this._elm.getContext('2d')
    if (!ctx) {
      throw new Error('E') // Context identifier is not supported
    }

    this._ctx = ctx
    // atlas is so small and will be local so we can run away with pretending as if it loads instantly. Dirty hack, ofc
    this._atlasImg = new Image()
    this._atlasImg.src = 'pack.png'
  }

  public FillRect(start: Vector2D, size: Vector2D, color: Color): void {
    this._ctx.beginPath()
    this._ctx.fillStyle = color.AsString()
    this._ctx.rect(start.x, start.y, size.x, size.y)
    this._ctx.fill()
  }

  public DrawRect(start: Vector2D, size: Vector2D, color: Color, width = 2): void {
    this._ctx.beginPath()
    this._ctx.lineWidth = width
    this._ctx.strokeStyle = color.AsString()
    this._ctx.rect(start.x, start.y, size.x, size.y)
    this._ctx.stroke()
  }

  public ClearRect(start: Vector2D, size: Vector2D): void {
    this._ctx.clearRect(start.x, start.y, size.x, size.y)
  }

  public FillCircle(center: Vector2D, radius: number, color: Color): void {
    this._ctx.beginPath()
    this._ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)
    this._ctx.fillStyle = color.AsString()
    this._ctx.fill()
  }

  public StrokeCircle(center: Vector2D, radius: number, color: Color): void {
    this._ctx.beginPath()
    this._ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)
    this._ctx.strokeStyle = color.AsString()
    this._ctx.stroke()
  }

  public FillSector(center: Vector2D, radius: number, color: Color, startAngle: number, endAngle: number, isCounterClockwise = false): void {
    this._ctx.beginPath()
    this._ctx.moveTo(center.x, center.y)
    this._ctx.arc(center.x, center.y, radius, this.DegreeToRadians(startAngle), this.DegreeToRadians(endAngle), isCounterClockwise)
    this._ctx.lineTo(center.x, center.y)
    this._ctx.fillStyle = color.AsString()
    this._ctx.fill()
  }

  public DrawImg(filename: string, position: Vector2D, size?: Vector2D): void {
    const data = this._atlasCoords.find(item => item.filename === filename)
    if(!data){
      return
    }

    this._ctx.drawImage(
      this._atlasImg,
      data.frame.x,
      data.frame.y,
      data.frame.w,
      data.frame.h,
      position.x,
      position.y,
      size ? size.x : data.frame.w,
      size ? size.y : data.frame.h
    )
  }

  public DrawImg2(filename: string, center: Vector2D, scale = new Vector2D(1, 1), rotation?: number): void {
    const data = this._atlasCoords.find(item => item.filename === filename)
    if(!data){
      return
    }

    const { frame } = data
    const size = new Vector2D(frame.w * scale.x, frame.h * scale.y)
    const start = new Vector2D(center.x - size.x / 2, center.y - size.y / 2)
    const pivot = new Vector2D(center.x, center.y)

    if(rotation){
      const angle = this.DegreeToRadians(rotation)
      this._ctx.translate(pivot.x, pivot.y)
      this._ctx.rotate(angle)
      this._ctx.translate(-pivot.x, -pivot.y)
    }

    this._ctx.drawImage(
      this._atlasImg,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      start.x,
      start.y,
      size.x,
      size.y
    )

    if(rotation){
      this._ctx.translate(pivot.x, pivot.y)
      this._ctx.rotate(-this.DegreeToRadians(rotation))
      this._ctx.translate(-pivot.x, -pivot.y)
    }
  }

  public SetStyle(style: Partial<CSSStyleDeclaration>): void {
    for (const key in style) {
      if (!Object.hasOwnProperty.call(style, key)) {
        continue
      }

      if (!style[key]) {
        continue
      }

      this._elm.style[key] = style[key] as string
    }
  }

  public CalcLocalPointFrom(globalPoint: Vector2D): Vector2D | null {
    const canvasRect = this._elm.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    const offset = {
      top: canvasRect.top + scrollTop,
      left: canvasRect.left + scrollLeft
    }

    const x = globalPoint.x - offset.left
    const y = globalPoint.y - offset.top

    if (x < 0 || y < 0) {
      return null
    }

    if (x > offset.left + canvasRect.width || y > offset.top + canvasRect.height) {
      return null
    }

    return new Vector2D(x, y)
  }

  public DrawText(
    text: string,
    position: Vector2D,
    color: Color = new Color(255, 255, 255, 1),
    fontSize = 10,
    font = 'Arial'
  ): void {
    this._ctx.font = `${fontSize}px ${font}`
    this._ctx.fillStyle = color.AsString()
    this._ctx.fillText(text, position.x, position.y)
  }

  private DegreeToRadians(deg: number): number {
    return deg * Math.PI / 180
  }
}

