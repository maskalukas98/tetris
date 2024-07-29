import styled from "styled-components";
import {TetrisGrid} from "../grid/TetrisGrid";
import {TetrisScore} from "../score/TetrisScore";
import {useState} from "react";
import {NextItem} from "../nextItem/NextItem";
import {GridSquare} from "../../../util/grid";
import {GameOver} from "../gameOver/GameOver";

const StyledContentDiv = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    height: 700px;
    display: flex;
`

const StyledRightPanelDiv = styled.div`
    margin-left: 20px;
    & > * {
        margin-bottom: 20px;
    }
`


export const TetrisGame = () => {
    const [score, setScore] = useState(0)
    const [nextItemTrigger, setNextItemTrigger] = useState(false)
    const [nextTetrisBlockItem, setNextTetrisBlockItem] = useState<GridSquare | undefined>()
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [gameId, setGameId] = useState<number>(0)

    const reset = () => {
        setScore(0)
        setNextItemTrigger(false)
        setNextTetrisBlockItem(undefined)
        setGameOver(false)
        setGameId(prevState => prevState + 1)
    }

    return <StyledContentDiv>
        <TetrisGrid
            key={gameId}
            nextTetrisBlockItem={nextTetrisBlockItem}
            setScore={setScore}
            setNextItemTrigger={setNextItemTrigger}
            setGameOver={setGameOver}
        />

        <StyledRightPanelDiv>
            <TetrisScore score={score} />
            <NextItem nextItemTrigger={nextItemTrigger} setNextItemTrigger={setNextItemTrigger} setNextTetrisBlockItem={setNextTetrisBlockItem}/>
        </StyledRightPanelDiv>

        {
            gameOver ? <GameOver reset={reset} /> : <></>
        }

    </StyledContentDiv>
}