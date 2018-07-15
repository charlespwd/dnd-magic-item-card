import React, { Component } from 'react';
import Textfit from './textfit';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import './App.css';

import staff from './assets/staff.jpeg';
import logo from './assets/magic-item.png';

const onChange = property => function({ target }) {
  const value = target.type === 'checkbox' ? target.checked : target.value;

  this.setState({
    [property]: value,
  });
}

const defaultDesc = `Holding this staff grants a +1 bonus to armor class.

The staff contains 10 charges used to fuel the spells within it. While holding the staff, it can be used to cast one of the following spells if the spell is on your class’s spell list:
- Mage Armor (1 charge)
- Shield (2 charges)

The staff regains 1d6+4 expended charges each day at dawn. If the last staffs charge is expended, roll a d20. On a 1, the staff shatters and is destroyed.`

class App extends Component {
  state = {
    title: '',
    type: '',
    description: '',
    value: '',
    needsAttunement: false,
  }

  constructor() {
    super();
    this.onChangeTitle = onChange('title').bind(this);
    this.onChangeType = onChange('type').bind(this);
    this.onChangeDescription = onChange('description').bind(this);
    this.onChangeValue = onChange('value').bind(this);
    this.onChangeNeedsAttunement = onChange('needsAttunement').bind(this);
  }

  componentDidMount() {
    this.setState({
      title: 'Gauntlet of Thunderblasting',
      type: 'Uncommon',
      description: defaultDesc,
      value: '100',
    });
    setTimeout(() => this.forceUpdate(), 100);
  }

  onSave = () => {
    html2canvas(this.ref).then(canvas => {
      const href = canvas.toDataURL("image/png");
      this.setState({ href });
    })
  }

  renderField(property, props={}) {
    return (
      <Textfit
        className={`card__${property}`}
        autoResize
        max={1500}
        forceSingleModeWidth={false}
        mode='single'
        { ...props }
      >
        <ReactMarkdown source={this.state[property]} />
      </Textfit>
    )
  }

  render() {
    return (
      <div className="container">
        <div className="fields">
          <input value={this.state.title} onChange={this.onChangeTitle} />
          <input value={this.state.type} onChange={this.onChangeType} />
          <input value={this.state.value} onChange={this.onChangeValue} />
          <textarea value={this.state.description} onChange={this.onChangeDescription} />
          <div>
            <input type="checkbox" checked={this.state.needsAttunement} onChange={this.onChangeNeedsAttunement} />
            Needs Attunement?
          </div>
          <button onClick={this.onSave}>
            Save
          </button>
          {this.state.href && <a download="image.png" href={this.state.href}>Download</a>}
        </div>
        <div className="card" ref={ref => { this.ref = ref; }}>
          <div className="card__icon">
            <img src={staff} alt="icon" />
          </div>
          <img src={logo} className="card__img" alt="card" />
          <div className={`card__attunement ${this.state.needsAttunement}`} />
          {this.renderField('title')}
          {this.renderField('type')}
          {this.renderField('value', {
            forceSingleModeWidth: true,
            max: 241,
          })}
          {this.renderField('description', {
            mode: 'multi',
            max: 140,
          })}
        </div>
      </div>
    );
  }
}

export default App;
