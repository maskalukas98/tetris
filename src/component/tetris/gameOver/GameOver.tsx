import styled from "styled-components";

const StyledRootDiv = styled.div`
    width: 300px;
    height: 300px;
    background-color: #121212;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    border-radius: 20px;
`

const StyledTitleSpan = styled.span`
    font-size: 30px;
    color: #fff;
    margin-top: 85px;
    display: inline-block;
`

const StyledButtonSpan = styled.span`
    font-size: 25px;
    margin-top: 69px;
    display: inline-block;
    background: #2a924c;
    padding: 10px 26px;
    border-radius: 10px;
    cursor: pointer;
    
    &:hover {
        background-color: #23753e;
    }
`

type Props = {
    reset: () => void
}

export const GameOver = (props: Props) => {

    return <StyledRootDiv>
        <div>
            <StyledTitleSpan>Game over</StyledTitleSpan>
        </div>

        <div>
            <StyledButtonSpan onClick={props.reset}>Reset</StyledButtonSpan>
        </div>
    </StyledRootDiv>
}