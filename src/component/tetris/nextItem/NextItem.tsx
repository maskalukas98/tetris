import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import {createGrid, Grid, GridSquare} from "../../../util/grid";
import {createNewTetrisItem} from "../../../util/tetrisItems";


const StyledGridDiv = styled.div`
    background-color: #313a59;
    border: 5px solid #11141f;
    border-radius: 20px;
    height: 310px;
    
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
`


export const gridWidth = 7
export const gridHeight = 7

type Props = {
    nextItemTrigger: boolean
    setNextItemTrigger: (val: boolean) => void
    setNextTetrisBlockItem: (tetrisBlockItem: GridSquare) => void
}

export const NextItem = (props: Props) => {
    const [grid, setGrid] = useState<Grid>(createGrid(gridHeight, gridWidth));

    useEffect(() => {
        if(props.nextItemTrigger) {
            setGrid(prevState => {
                const s = prevState.map(s => s.map(ss => undefined))
                const newItem = createNewTetrisItem(s, 0, 0, true)

                if(newItem?.newGrid) {
                    props.setNextTetrisBlockItem(newItem.newCurrTetrisBlockItem[0])
                    return newItem.newGrid
                }

                return prevState
            })

            props.setNextItemTrigger(false)
        }
    }, [props.nextItemTrigger]);

    return <StyledGridDiv>
        {
            grid.map((r,i) => {
                return <StyledRowDiv key={i} className={`row`}>
                    {
                        r.map((b, si) => {
                            return <StyledBoxDiv
                                key={si}
                                className={`box`}
                                style={{
                                    backgroundColor: b && !b.target ? b.color : "",
                                }}
                            />
                        })
                    }
                </StyledRowDiv>
            })
        }
    </StyledGridDiv>
}