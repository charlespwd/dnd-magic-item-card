import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import Card from './Card';
import './App.css';

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
    cardType: 'long',
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

  onImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
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
          <button onClick={this.onSave}>
            Save
          </button>
          {href && <a download="image.png" href={href}>Download</a>}
        </div>
        <Card key={cardType} onRef={ref => this.ref = ref} {...this.state} />
      </div>
    );
  }
}

export default App;
