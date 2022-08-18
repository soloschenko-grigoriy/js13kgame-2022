import { IRange } from '@/utils'

export function random(from: number, to: number): number
export function random(range: IRange): number
export function random(fromOrRange: number | IRange, possibleTo?: number): number {
  let from, to: number
  if (typeof fromOrRange === 'number') {
    from = fromOrRange as number
    to = possibleTo as number
  } else {
    from = fromOrRange.from
    to = fromOrRange.to
  }

  return Math.floor(Math.random() * to) + from
}
