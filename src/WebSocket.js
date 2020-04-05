import {Client} from "@stomp/stompjs"
import * as React from "react";

class WebSocket extends React.Component{
    constructor(props) {
        super(props);
        this.state  = {
            messages : [],
            text: null,
            id: this.props.idChat,
            author: this.props.author
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event)
    {
        const target = event.target;
        const name = target.name;
        const value =  target.value;
        this.setState({[name]:value});
    }
    clickHandler = () => {
        let mes = {
            'idChat' : this.state.id,
            'message' : {
                'author' : this.state.author,
                'message' : this.state.text
            }
        };
        this.setState({text:''});

    }
    render(){
        return (
            <div>
                <div className="chat">
                    <div className="inputMessage">
                        <input name="text" value={this.state.text} onChange={this.handleChange} type="text"/>
                        <button className="sendMessageBtn" onClick={this.clickHandler}>Send</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default WebSocket;