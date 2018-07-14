import React, { Component } from 'react';
import { Textfit } from 'react-textfit';
import logo from './assets/magic-item.png';
import './App.css';

const onChange = property => function(e) {
  this.setState({
    [property]: e.target.value,
  });
}

class App extends Component {
  state = {
    title: '',
    type: '',
  }

  constructor() {
    super();
    this.onChangeTitle = onChange('title').bind(this);
    this.onChangeType = onChange('type').bind(this);
    setTimeout(() => {
      this.setState({
        title: 'Gauntlet of Thunderblasting ',
        type: 'Uncommon',
      });
    }, 50);
  }

  get titleFontSize() {
    // 18: 180
    // 19: 173
    // 20: 164
    // 21: 157
    // 22:
    const value = Math.min(
      18,
    ) * 180;
    return `${value}%`;
  }

  renderField(property, mode='single') {
    return (
      <Textfit
        className={`card__${property}`}
        autoResize
        max={500}
        forceSingleModeWidth={false}
        mode={mode}
      >
        {this.state[property]}
      </Textfit>
    )
  }

  render() {
    return (
      <div className="container">
        <div className="fields">
          <input value={this.state.title} onChange={this.onChangeTitle} />
          <input value={this.state.type} onChange={this.onChangeType} />
        </div>
        <div className="card">
          <img src={logo} className="card__img" alt="card" />
          {this.renderField('title')}
          {this.renderField('type')}
        </div>
      </div>
    );
  }
}

export default App;
