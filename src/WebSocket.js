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
    componentDidMount() {
        console.log('Component did mount');
        this.client = new Client();

        this.client.configure({
            brokerURL: 'ws://tictactoe-task-abs.herokuapp.com/chat-messaging',
            onConnect: () => {
                console.log('onConnect');

                this.client.subscribe('/chat/message/' + this.state.id, message => {
                    console.log(message);
                    const mas = this.state.messages.slice();
                    mas.push(JSON.parse(message.body));
                    this.setState({messages:mas})
                });
            },
        });

        this.client.activate();
    }
    handleChange(event)
    {
        const target = event.target;
        const name = target.name;
        const value =  target.value;
        this.setState({[name]:value});
    }
    clickHandler = () => {
        if (this.state.text !== '') {
            let mes = {
                'idChat': this.state.id,
                'message': {
                    'author': this.state.author,
                    'message': this.state.text
                }
            };
            this.setState({text: ''});
            this.client.publish({destination: '/app/message', body: JSON.stringify(mes)});
        }
    }
    render(){
        return (
            <div>
                <div className="chat">
                    {this.state.messages.map((data, i) => (
                        <div className="message">
                            <div className="authorMessage">Автор: {data.author}</div>
                            <div className="textMessage"><p>{data.message}</p></div>
                        </div>
                    ))}
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