import React, { Component, Fragment } from 'react';
import * as R from 'ramda';
import html2canvas from 'html2canvas';
import Card from './Card';
import './App.css';
import debounce from 'lodash.debounce';
import classnames from 'classnames';

const onChange = property => function({ target }) {
  const value = target.type === 'checkbox' ? target.checked : target.value;

  this.setState({
    [property]: value,
  }, this.saveState);
}

const localStorage = window.localStorage;

const defaultTitle = 'Circlet of Blasting'

const defaultDesc = `While wearing this circlet, you can use an action to cast the Scorching Ray spell with it. When you make the spell's attacks, you do so with an **Attack bonus of +5**. The circlet can't be used this way again until the next dawn.`

const defaultState = {
  cartType: 'default',
  description: defaultDesc,
  needsAttunement: false,
  title: 'Gauntlet of Thunderblasting',
  type: 'Uncommon',
  imagePreviewUrl: undefined,
  value: '100',
};

const saveData = debounce((key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
}, 500);

const getSavedDate = (key) => {
  const data = localStorage.getItem(key);
  if (!data) return undefined;
  return JSON.parse(data);
}

class CardEditor extends Component {
  static defaultProps = {
    localStorageKey: 'card',
  }

  state = {
    cardType: 'default',
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
    this.onChangeCardType = onChange('cardType').bind(this);
  }

  componentDidMount() {
    const cachedState = getSavedDate(this.props.localStorageKey);
    this.setState(cachedState || defaultState);
    setTimeout(() => this.forceUpdate(), 100);
  }

  saveState = () => {
    saveData(this.props.localStorageKey, this.state);
  }

  onReset = () => {
    this.setState(defaultState, this.saveState);
  }

  onSave = () => {
    html2canvas(this.ref).then(canvas => {
      const href = canvas.toDataURL("image/png");
      this.setState({ href });
    })
  }

  onImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      }, this.saveState);
    }

    reader.readAsDataURL(file)
  }

  get cardTypeOptions() {
    return [
      'default',
      'long',
    ];
  }

  render() {
    const {
      cardType,
      description,
      href,
      needsAttunement,
      title,
      type,
      value,
    } = this.state;
    return (
      <div className="container">
        <div className="fields">
          <select value={cardType} onChange={this.onChangeCardType}>
            {this.cardTypeOptions.map(option => (
              <option value={option}>{option}</option>
            ))}
          </select>
          <input value={title} onChange={this.onChangeTitle} />
          <input value={type} onChange={this.onChangeType} />
          <input value={value} onChange={this.onChangeValue} />
          <textarea value={description} onChange={this.onChangeDescription} />
          <div>
            <input type="checkbox" checked={needsAttunement} onChange={this.onChangeNeedsAttunement} />
            Needs Attunement?
          </div>
          <input
            className="fileInput"
            accept="image/png,image/jpeg"
            type="file"
            onChange={this.onImageChange}
          />
          <div className="buttons">
            <button onClick={this.onReset}>
              Reset
            </button>
            <button onClick={this.onSave}>
              Save
            </button>
          </div>
          {href && <a download="image.png" href={href}>Download</a>}
        </div>
        <Card key={cardType} onRef={ref => this.ref = ref} {...this.state} />
      </div>
    );
  }
}

class App extends Component {
  state = {
    printMode: false,
  }

  onClick = () => this.setState({ printMode: !this.state.printMode });

  onSave = () => {
    html2canvas(this.ref).then(canvas => {
      const href = canvas.toDataURL("image/png");
      this.setState({ href });
    })
  }

  render() {
    const { href, printMode } = this.state;
    const classes = classnames({
      'app-container--print': this.state.printMode,
      'app-container': true,
    });

    return (
      <Fragment>
        <button className="print-mode" onClick={this.onClick}>Print Mode</button>
        {printMode && <button className="download-all" onClick={this.onSave}>Create Image</button>}
        {href && <a className="download-cards" download="cards.png" href={href}>Download Image</a>}
        <div className={classes} ref={ref => this.ref = ref}>
          {R.range(0, 9).map(i => (
            <CardEditor key={i} localStorageKey={`card${i}`} />
          ))}
        </div>
      </Fragment>
    );
  }
}

export default App;
