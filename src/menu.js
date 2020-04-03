import React from "react";
import axios from 'axios';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.joinClick = this.joinClick.bind(this);
        this.newGameClick = this.newGameClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            games: [],
            name: ''
        };
        this.tick();
    }
    handleChange(event)
    {
        this.setState({name:event.target.value});
    }
    newGameClick(){
        axios.post('https://tictactoe-task-abs.herokuapp.com/game/create',
            {name:this.state.name})
            .then(res => {
                window.location.assign('/game?id=' + res.data.id + '&name=' + this.state.name);
            })
    }
    joinClick(gameId){
        axios.post('https://tictactoe-task-abs.herokuapp.com/game/' + gameId + '/connect',
            {gameId : gameId,
                name:this.state.name})
            .then(() => {
                window.location.assign('/game?id=' + gameId + '&name=' + this.state.name);
            })
    }
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            5000
        );
    }
    tick() {
        axios.get('https://tictactoe-task-abs.herokuapp.com/games')
            .then(res => {
                const games = res.data;
                this.setState({games});
            })
    }
    render() {
        return (
            <div className="menu">
                <div className="menu-column">
            <div className="menuAttr">
                <input placeholder="Enter name" className="inputName" type="text" value={this.state.name} onChange={this.handleChange}/>
                <button onClick={() => this.newGameClick()} className="startGameBtn">Start New Game</button>
            </div>
                <div className="listGames">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Имя хоста</th>
                        <th>Действие</th>
                    </tr>
                    </thead>
                    {this.state.games.map((data, i) => (
                        <tr key={i}>
                            <td>{data.id}</td>
                            <td>{data.firstPlayer}</td>
                            <td><button onClick={() => this.joinClick(data.id)}>Присоединиться</button></td>

                        </tr>
                    ))}
                </div>
                </div>
            </div>
        )
    }
}
export default Menu;