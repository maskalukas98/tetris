export type GridSquare = {
    color: string,
    x: number,
    y: number,
    moving: boolean,
    target: boolean,
    currPatternIdx: number,
    pattern: number[][][],
    toDelete: boolean
}

export type Grid = (GridSquare | undefined)[][]

export const createGrid = (height: number, width: number): Grid => {
    return [...Array(height)].map(s => Array(width).fill(undefined))
}

