import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {createGrid, Grid, GridSquare} from "../../../util/grid";
import styled from "styled-components";
import {
    addAlreadyCreatedTetrisItem,
    checkHorizontalCollision,
    checkVerticalCollision, completeRows,
    createNewTetrisItem,
    Direction,
    finishTetrisBlockItem,
    moveTetrisItemDown,
    moveTetrisItemSide, rotate
} from "../../../util/tetrisItems";
import {IntervalId, useInterval} from "../../../util/useInterval";
import {calculateIntervalDelay} from "../../../util/score";

const StyledGridDiv = styled.div`
    background-color: #313a59;
    border: 5px solid #11141f;
    border-radius: 20px;
    
    .row:first-child > .box:first-child {
        border-top-left-radius: 14px;
    }

    .row:first-child > .box:last-child {
        border-top-right-radius: 14px;
    }

    .row:last-child > .box:first-child {
        border-bottom-left-radius: 14px;
    }

    .row:last-child > .box:last-child {
        border-bottom-right-radius: 14px;
    }
`

const StyledRowDiv = styled.div`
    display: flex;
`

const StyledBoxDiv = styled.div`
    width: 50px;
    height: 49.5px;
    padding: 3px;
    
    &.target {
        background-color: #43507d;
    }

    & > div {
        width: 100%;
        height: 100%;
    }
`

const increasingScore = 5
export const gridWidth = 12
export const gridHeight = 14

type Props = {
    nextTetrisBlockItem?: GridSquare
    setScore: Dispatch<SetStateAction<number>>
    setNextItemTrigger: (val: boolean) => void
    setGameOver: Dispatch<SetStateAction<boolean>>
}

export const TetrisGrid = (props: Props) => {
    const [grid, setGrid] = useState<Grid>(createGrid(gridHeight, gridWidth));
    const currTetrisBlockItem= useRef<GridSquare[]>([])
    const startX = useRef<number>(5)
    const startY = useRef(0)
    const onKeyDown = useRef<(e: KeyboardEvent) => void>()
    const isGameOver = useRef<boolean>(false)
    const delay = useRef<number>(500)
    const intervalIdRef = useRef<number>()

    const gameOver = () => {
        isGameOver.current = true
        props.setGameOver(true)

        if(onKeyDown.current) {
            window.removeEventListener("keydown", onKeyDown.current)
        }
    }

    const updateScore = (rowsDeleted: number) => {
        props.setScore(prevState => {
            const newScore = prevState + (increasingScore * rowsDeleted)
            const newDelay = calculateIntervalDelay(newScore)

            if(delay.current !== newDelay) {
                clearInterval(intervalIdRef.current)
                delay.current = newDelay
            }

            return newScore
        })
    }

    const moveDown = (intervalId: IntervalId) => {
        intervalIdRef.current = intervalId

        setGrid(prevGrid => {
            if(isGameOver.current) {
                return prevGrid
            }

            if (currTetrisBlockItem.current) {
                if (!checkVerticalCollision(prevGrid, currTetrisBlockItem.current)) {
                    startY.current++
                    const movedTetrisBlockItem = moveTetrisItemDown(prevGrid, currTetrisBlockItem.current);
                    currTetrisBlockItem.current = movedTetrisBlockItem.newCurrTetrisBlockItem;
                    return movedTetrisBlockItem.newGrid;
                } else {
                    // optimize
                    const completedRowsGrid = completeRows(prevGrid)

                    if(completedRowsGrid.rowsDeleted) {
                        updateScore(completedRowsGrid.rowsDeleted)
                    }
                    //forDelete.current = completedRowsGrid
                    const newFinishedGrid = finishTetrisBlockItem(completedRowsGrid.newGrid, currTetrisBlockItem.current);
                    startX.current = 5
                    startY.current = 0
                    //const newTetrisItem = createNewTetrisItem(newFinishedGrid, startX.current, startY.current);
                    const newTetrisItem = addAlreadyCreatedTetrisItem(
                        newFinishedGrid,
                        props.nextTetrisBlockItem as any,
                        startX.current,
                        startY.current
                    );
                    props.setNextItemTrigger(true)

                    if (newTetrisItem) {
                        currTetrisBlockItem.current = newTetrisItem.newCurrTetrisBlockItem;
                        return newTetrisItem.newGrid;
                    } else {
                        gameOver()

                        if (intervalId) {
                            clearInterval(intervalId);
                        }
                        return newFinishedGrid;
                    }
                }
            }

            return prevGrid;
        });
    }

    useEffect(() => {
        const newTetrisItem = createNewTetrisItem(grid, startX.current, startY.current)
        props.setNextItemTrigger(true)

        if(newTetrisItem) {
            currTetrisBlockItem.current = newTetrisItem.newCurrTetrisBlockItem
            //const n = addTest(newTetrisItem.newGrid)
            //setGrid(n)
            setGrid(newTetrisItem.newGrid)
        } else {
            gameOver()
        }
    }, []);

    useInterval(moveDown, delay.current)


    useEffect(() => {
        onKeyDown.current = (e: KeyboardEvent) => {
            if(isGameOver.current) {
                return
            }

            if (currTetrisBlockItem.current) {
                setGrid(prevGrid => {
                    let movedItem;
                    switch (e.code) {
                        case "ArrowLeft":
                            if(!checkHorizontalCollision(prevGrid, currTetrisBlockItem.current, Direction.Left)) {
                                startX.current--
                                movedItem = moveTetrisItemSide(prevGrid, currTetrisBlockItem.current, Direction.Left);
                                currTetrisBlockItem.current = movedItem.newCurrTetrisBlockItem;
                                return movedItem.newGrid;
                            } else {
                                return prevGrid
                            }
                            break;
                        case "ArrowRight":
                            if(!checkHorizontalCollision(prevGrid, currTetrisBlockItem.current, Direction.Right)) {
                                startX.current++
                                movedItem = moveTetrisItemSide(prevGrid, currTetrisBlockItem.current, Direction.Right);
                                currTetrisBlockItem.current = movedItem.newCurrTetrisBlockItem;
                                return movedItem.newGrid;
                            } else {
                                return prevGrid
                            }
                            break;
                        case "ArrowDown":
                            if (!checkVerticalCollision(prevGrid, currTetrisBlockItem.current)) {
                                startY.current++
                                movedItem = moveTetrisItemDown(prevGrid, currTetrisBlockItem.current);
                                currTetrisBlockItem.current = movedItem.newCurrTetrisBlockItem;
                                return movedItem.newGrid;
                            } else {
                                const completedRowsGrid = completeRows(prevGrid)
                                if(completedRowsGrid.rowsDeleted) {
                                    updateScore(completedRowsGrid.rowsDeleted)
                                }
                                const newFinishedGrid = finishTetrisBlockItem(completedRowsGrid.newGrid, currTetrisBlockItem.current)
                                startX.current = 5
                                startY.current = 0
                               // const newTetrisItem = createNewTetrisItem(newFinishedGrid, startX.current, startY.current);
                                const newTetrisItem = addAlreadyCreatedTetrisItem(
                                    newFinishedGrid,
                                    props.nextTetrisBlockItem as any,
                                    startX.current,
                                    startY.current
                                );
                                props.setNextItemTrigger(true)

                                if (newTetrisItem) {
                                    movedItem = newTetrisItem
                                    currTetrisBlockItem.current = movedItem.newCurrTetrisBlockItem;
                                    return movedItem.newGrid;
                                }  else {
                                    gameOver()
                                    return prevGrid
                                }
                            }

                            break;
                        case "ArrowUp": {
                            const rotated = rotate(prevGrid, currTetrisBlockItem.current, startX.current, startY.current)
                            currTetrisBlockItem.current = rotated.newCurrTetrisBlockItem
                            return rotated.newGrid

                            break;
                        }
                        default:
                            return prevGrid;
                    }
                });
            }
        };

        window.addEventListener("keydown", onKeyDown.current)

        return () => {
            if(onKeyDown.current) {
                window.removeEventListener("keydown", onKeyDown.current)
            }
        }
    }, [currTetrisBlockItem.current]);



    return <StyledGridDiv>
        {
            grid.map((r,i) => {
                return <StyledRowDiv key={i} className={`row ${r[0]?.toDelete ? 'delete' : ''}`}>
                    {
                        r.map((b, si) => {
                            return <StyledBoxDiv
                                key={si}
                                className={`box ${b?.target ? 'target' : ''} ${r[0]?.toDelete ? 'delete' : ''}`}
                            >
                                <div style={{
                                    backgroundColor: b && !b.target ? b.color : "",
                                }}></div>
                            </StyledBoxDiv>
                        })
                    }
                </StyledRowDiv>
            })
        }
    </StyledGridDiv>
}