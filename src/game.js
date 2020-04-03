import React from "react";
import API from "API";

class Square extends React.Component {

    render() {
        return (
            <button className="square"
                    onClick={() => this.props.onClick( )}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(361).fill(null),
            id : this.props.id,
            name : this.props.name,
            mark : 'N',
            enemyMark: 'N',
            lastMove : this.props.lastMove,
            localLastMove: null,
            data : []
        };
        this.tick();
        this.exitClick = this.exitClick.bind(this);
    }
    handleClick(i){
        API.post('/game/' + this.state.id + '/move',
            {cell:i,
            name:this.state.name})
            .then(res =>{
                if (res.data.successful)
                    this.moveTo(i);
            });
    }
    exitClick() {
        API.post('/game/' + this.state.id + '/exit',
            {name:this.state.name})
            .then(() =>{
                window.location.assign('/menu');
            })
    }
    moveTo(i, b = false){
        const squares = this.state.squares.slice();
        if (!b)
        squares[i]=this.state.mark;
        else squares[i]=this.state.enemyMark;
        this.setState({
            squares:squares,
            localLastMove:i
        });
    }
    renderSquare(i) {
        let val;
        if (this.state.squares[i]===1)
            val = 'X';
        else if (this.state.squares[i]===2)
            val = 'O';
        return (<Square
                value={val}
                onClick={() => this.handleClick(i)}
            />
        );
    }
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick() {
        API.get('/game/' + this.state.id + '/state')
            .then(res => {
                let binary_string = window.atob(res.data.squares);
                let respondedSquares = new Int8Array(361);
                for (let i=0;i<361;i++)
                    respondedSquares[i]=binary_string.charCodeAt(i);
                this.setState({squares:respondedSquares});
                if (this.state.mark==='N')
                    if (this.state.name===res.data.firstPlayer) {
                        this.setState({mark: '1', enemyMark:'2'});
                    }
                    else {
                        this.setState({mark: '2', enemyMark:'1'});
                    }
                else if (res.data.secondPlayer == null)
                    this.setState({info:'Ожидаем второго игрока.'});
                else if (res.data.currentMove!=null)
                    this.setState({info:'Время ходить, ' + res.data.currentMove});
                else if (res.data.winner!=null) {
                    this.setState({info: 'Победил ' + res.data.winner});
                    clearInterval(this.timerID);
                }
                if (res.data.lastMove!==-1 && res.data.lastMove!==this.state.localLastMove)
                   this.moveTo(res.data.lastMove, true);
            });
    }
    render() {
        const table = [];
        for (let i = 0; i < 19; i++) {
            const children = [];
            for (let k = 0; k < 19; k++)
                children.push(this.renderSquare(19*i+k));
            table.push(<div className={'board-row'}>{children}</div>);
        }
        return (
            <div>
                <div className="game-info">
                    <p>{this.state.info}</p>
                </div>
            <div>
                {table}
            </div>
                <div className="exitGame">
                    <button onClick={() => this.exitClick()} className="exitBtn">Выйти</button>
                </div>
            </div>
        );
    }
}
class Game extends React.Component {
    constructor(props)
    {
        super(props);
        const params = new URLSearchParams(props.location.search);
        this.state = {
            id : params.get('id'),
            name : params.get('name')
        };
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board id={this.state.id} name={this.state.name} />
                </div>
            </div>
        );
    }
}
export default Game;