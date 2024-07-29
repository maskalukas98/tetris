import {Component} from "react";
import styled from "styled-components";

const StyledBoxDiv = styled.div`
    background-color: #313a59;
    width: 360px;
    height: 100px;
    border-radius: 20px;
    border: 5px solid #11141f;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    
    span {
        color: #fff;
        font-size: 25px;
    }
`

type Props = {
    score: number
}

export const TetrisScore = (props: Props) => {
    return <StyledBoxDiv>
        <span>Score: </span>
        <br />
        <span>{ props.score }</span>
    </StyledBoxDiv>
}