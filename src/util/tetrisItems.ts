import {Grid, GridSquare} from "./grid";
import {gridHeight, gridWidth} from "../component/tetris/grid/TetrisGrid";

export type TetrisBlockItem = GridSquare[]

// add more patterns
const patterns = {
    T: [
        [[1, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [1, 2], [2, 1]],
        [[0, 1], [1, 1], [2, 1], [1, 2]],
        [[1, 0], [0, 1], [1, 1], [1, 2]]
    ],
    Square: [
        [[0,0],[0,1],[1,0],[1,1]]
    ],
    I: [
        [[0,0],[0,1],[0,2],[0,3]],
        [[0,0],[1,0],[2,0],[3,0]],
    ]
}

const patternsKeys = Object.keys(patterns)
const patternStarts = {
    T: { x: 2, y: 2 },
    Square: { x: 2, y: 2 },
    I: { x: 3, y: 1 }
}


const colors = [
    "#009fff",
    "#b61212",
    "#e3cb22",
    "purple",
    "#27cb4d"
]

export enum Direction {
    Left,
    Right,
    Down
}


export const createNewTetrisItem = (
    grid: Grid, startX: number, startY: number, useStartByPattern = false
): { newGrid: Grid, newCurrTetrisBlockItem: TetrisBlockItem } | undefined => {
    const newGrid = [...grid.map(s => [...s])]
    const patternKey = patternsKeys[Math.floor(Math.random() * patternsKeys.length)]
    // @ts-ignore
    const pattern = patterns[patternKey]
    const tetrisItem = pattern[0]
    const newCurrTetrisBlockItem: GridSquare[] = []
    const color = colors[Math.floor(Math.random() * colors.length)]

    if(useStartByPattern) {
        // @ts-ignore
        const start = patternStarts[patternKey] as { x: number, y: number}
        startX = start.x
        startY = start.y
    }

    for(let i = 0; i < tetrisItem.length; i++) {
        const y = startY + tetrisItem[i][1]
        const x = startX + tetrisItem[i][0]

        if(newGrid[y][x] !== undefined) {
            return undefined
        }

        newGrid[y][x] = {
            color,
            x,
            y,
            moving: true,
            target: false,
            currPatternIdx: 0,
            pattern: pattern,
            toDelete: false
        }

        newCurrTetrisBlockItem.push(newGrid[y][x] as GridSquare)
    }

    return {
        newGrid,
        newCurrTetrisBlockItem
    }
}

export const addAlreadyCreatedTetrisItem = (
    grid: Grid,
    tetrisBlockItem: GridSquare,
    startX: number,
    startY: number
): { newGrid: Grid, newCurrTetrisBlockItem: TetrisBlockItem } | undefined => {
    const newGrid = [...grid.map(s => [...s])]
    const tetrisItem = tetrisBlockItem.pattern[tetrisBlockItem.currPatternIdx]
    const newCurrTetrisBlockItem: GridSquare[] = []
    const color = tetrisBlockItem.color

    for(let i = 0; i < tetrisItem.length; i++) {
        const y = startY + tetrisItem[i][1]
        const x = startX + tetrisItem[i][0]

        if(newGrid[y][x] !== undefined) {
            return undefined
        }

        newGrid[y][x] = {
            color,
            x,
            y,
            moving: true,
            target: false,
            currPatternIdx: 0,
            pattern: tetrisBlockItem.pattern,
            toDelete: false
        }

        newCurrTetrisBlockItem.push(newGrid[y][x] as GridSquare)
    }

    return {
        newGrid,
        newCurrTetrisBlockItem
    }
}


export const moveTetrisItemDown = (
    grid: Grid,
    currTetrisBlockItem: GridSquare[]
): { newGrid: Grid, newCurrTetrisBlockItem: TetrisBlockItem } => {
    const newGrid = [...grid.map(s => [...s].map(dd => {
        if((dd && dd.target) || !dd) {
            return undefined
        }

        return dd
    }))]
    const newCurrTetrisBlockItem = [...currTetrisBlockItem]

    for(let i = 0; i < currTetrisBlockItem.length; i++) {
        newGrid[newCurrTetrisBlockItem[i].y][newCurrTetrisBlockItem[i].x] = undefined
    }

    for(let i = 0; i < newCurrTetrisBlockItem.length; i++) {
        const newY = newCurrTetrisBlockItem[i].y+1
        newGrid[newY][newCurrTetrisBlockItem[i].x] = newCurrTetrisBlockItem[i]
        newCurrTetrisBlockItem[i].y = newY
    }

    const target = showTarget(newGrid, newCurrTetrisBlockItem)
    for(let i = 0; i < target.length; i++) {
        const square = newGrid[target[i].y][target[i].x]

        if(!square) {
            target[i].target = true
            newGrid[target[i].y][target[i].x] = target[i]
        }
    }

    return {
        newGrid,
        newCurrTetrisBlockItem
    }
}

export const moveTetrisItemSide = (
    grid: Grid,
    currTetrisBlockItem: GridSquare[],
    direction: Direction
): { newGrid: Grid, newCurrTetrisBlockItem: TetrisBlockItem } => {
    const newGrid = [...grid.map(s => [...s].map(dd => {
        if((dd && dd.target) || !dd) {
            return undefined
        }

        return dd
    }))]
    const newCurrTetrisBlockItem = [...currTetrisBlockItem]

    for(let i = 0; i < currTetrisBlockItem.length; i++) {
        newGrid[newCurrTetrisBlockItem[i].y][newCurrTetrisBlockItem[i].x] = undefined
    }

    for(let i = 0; i < newCurrTetrisBlockItem.length; i++) {
        if(direction === Direction.Left) {
            const newX = newCurrTetrisBlockItem[i].x - 1
            newGrid[newCurrTetrisBlockItem[i].y][newX] = newCurrTetrisBlockItem[i]
            newCurrTetrisBlockItem[i].x = newX
        } else if(direction === Direction.Right) {
            const newX = newCurrTetrisBlockItem[i].x + 1
            newGrid[newCurrTetrisBlockItem[i].y][newX] = newCurrTetrisBlockItem[i]
            newCurrTetrisBlockItem[i].x = newX
        } else if(direction === Direction.Down) {
            const newY = newCurrTetrisBlockItem[i].y+1
            newGrid[newY][newCurrTetrisBlockItem[i].x] = newCurrTetrisBlockItem[i]
            newCurrTetrisBlockItem[i].y = newY
        }
    }

    const target = showTarget(newGrid, newCurrTetrisBlockItem)
    for(let i = 0; i < target.length; i++) {
        const square = newGrid[target[i].y][target[i].x]

        if(!square) {
            target[i].target = true
            newGrid[target[i].y][target[i].x] = target[i]
        }
    }

    return {
        newGrid,
        newCurrTetrisBlockItem
    }
}

export const checkVerticalCollision = (grid: Grid, currTetrisBlockItem: TetrisBlockItem) => {
    for(let i = 0; i < currTetrisBlockItem.length; i++) {
        const newY = currTetrisBlockItem[i].y + 1

        if(newY >= gridHeight) {
            return true
        }

        const square = grid[newY][currTetrisBlockItem[i].x]

        if(square !== undefined && !square.moving) {
            return true
        }
    }

    return false
}

export const checkHorizontalCollision = (grid: Grid, currTetrisBlockItem: TetrisBlockItem, direction: Direction) => {
    for(let i = 0; i < currTetrisBlockItem.length; i++) {
        if(direction === Direction.Left) {
            const newX = currTetrisBlockItem[i].x - 1

            if(newX < 0) {
                return true
            }

            const square = grid[currTetrisBlockItem[i].y][newX]

            if(square !== undefined && !square.moving) {
                return true
            }
        } else if (direction === Direction.Right) {
            const newX = currTetrisBlockItem[i].x + 1

            if(newX >= gridWidth) {
                return true
            }

            const square = grid[currTetrisBlockItem[i].y][newX]

            if(square !== undefined && !square.moving) {
                return true
            }
        }
    }

    return false
}

export const finishTetrisBlockItem = (grid: Grid, tetrisBlockItem: TetrisBlockItem): Grid => {
    const newGrid = [...grid.map(s => [...s].map(dd => {
        if((dd && dd.target) || !dd) {
            return undefined
        }

        return dd
    }))]

    for(let i = 0; i < tetrisBlockItem.length; i++) {
        const square = newGrid[tetrisBlockItem[i].y][tetrisBlockItem[i].x]

        if(square) {
            square.moving = false
        }
    }

    return newGrid
}

export const showTarget = (grid: Grid, currTetrisBlockItem: GridSquare[]): TetrisBlockItem => {
    const newCurrTetrisBlockItem = [...currTetrisBlockItem].map(s => ({ ...s, moving: true }))

    while (!checkVerticalCollision(grid, newCurrTetrisBlockItem)) {
        for(let i = 0; i < newCurrTetrisBlockItem.length; i++) {
            newCurrTetrisBlockItem[i].y = newCurrTetrisBlockItem[i].y+1
        }
    }

    return newCurrTetrisBlockItem
}

export const rotate = (
    grid: Grid,
    currTetrisBlockItem: TetrisBlockItem,
    startX: number,
    startY: number
):  { newGrid: Grid, newCurrTetrisBlockItem: TetrisBlockItem } => {
    const newGrid = [...grid.map(s => [...s].map(dd => {
        if((dd && dd.target) || !dd) {
            return undefined
        }

        return dd
    }))]
    const newCurrTetrisBlockItem = [...currTetrisBlockItem]


    for(let i = 0; i < currTetrisBlockItem.length; i++) {
        newGrid[newCurrTetrisBlockItem[i].y][newCurrTetrisBlockItem[i].x] = undefined
    }


    const currPatternIdx = newCurrTetrisBlockItem[0].currPatternIdx
    const pattern = newCurrTetrisBlockItem[0].pattern
    const nextPatternIdx = currPatternIdx + 1 >= pattern.length ? 0 : currPatternIdx + 1
    const currPattern = pattern[nextPatternIdx]

    const color = newCurrTetrisBlockItem[0].color
    newCurrTetrisBlockItem.length = 0

    for(let i = 0; i < currPattern.length; i++) {
        const y = startY + currPattern[i][1]
        const x = startX + currPattern[i][0]

        newGrid[y][x] = {
            color,
            x,
            y,
            moving: true,
            target: false,
            currPatternIdx: nextPatternIdx,
            pattern,
            toDelete: false
        }

        newCurrTetrisBlockItem.push(newGrid[y][x] as GridSquare)
    }

    if(checkHorizontalCollision(newGrid, newCurrTetrisBlockItem, Direction.Left)) {
        return { newGrid: grid, newCurrTetrisBlockItem: currTetrisBlockItem }
    }

    if(checkHorizontalCollision(newGrid, newCurrTetrisBlockItem, Direction.Right)) {
        return { newGrid: grid, newCurrTetrisBlockItem: currTetrisBlockItem }
    }

    const target = showTarget(newGrid, newCurrTetrisBlockItem)
    for(let i = 0; i < target.length; i++) {
        const square = newGrid[target[i].y][target[i].x]

        if(!square) {
            target[i].target = true
            newGrid[target[i].y][target[i].x] = target[i]
        }
    }


    return {
        newGrid,
        newCurrTetrisBlockItem
    }
}


export const completeRows = (grid: Grid): { newGrid: Grid, rowsDeleted: number } => {
    const newGrid = [...grid.map(s => [...s])]
    let numberOfRowsToDelete = 0
    let lastRowIdxToDelete: number | undefined
    const move: number[] = []
    let lastMoveVal = 0

    for(let r = newGrid.length - 1; r >= 0; r--) {
        let complete = true

        for(let s = 0; s < newGrid[r].length; s++) {
            if(grid[r][s] === undefined) {
                complete = false
                break
            }
        }

        if(complete) {
            numberOfRowsToDelete++
            lastRowIdxToDelete = r

            for(let s = 0; s < newGrid[r].length; s++) {
                grid[r][s] = undefined
            }

            move[r] = 0
            lastMoveVal++
        } else {
            move[r] = lastMoveVal
        }
    }

    if(lastRowIdxToDelete !== undefined) {
        for(let i = gridHeight - 1; i >= 0; i--) {
            for(let x = 0; x < gridWidth; x++) {
               newGrid[i + move[i]][x] = grid[i][x]
            }
        }
    }

    return {
        newGrid,
        rowsDeleted: numberOfRowsToDelete
    }
}
