import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Menu from './menu';
import Game from './game';

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/menu" component={Menu} />
                        <Route path="/game" component={Game} />
                        <Route component={Error}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;