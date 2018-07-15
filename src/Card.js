import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Textfit from './textfit';
import staff from './assets/staff.jpeg';
import classnames from 'classnames';
import card from './assets/magic-item.png';
import cardDefault from './assets/card--default.png';
import cardLong from './assets/card--long.png';
import './Card.css';

const cards = {
  default: cardDefault,
  long: cardLong,
}

const noop = () => {};
export default class Card extends Component {
  static propTypes = {}

  static defaultProps = {
    cardType: 'default',
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
        <ReactMarkdown source={this.props[property]} />
      </Textfit>
    )
  }

  render() {
    const {
      cardType,
      needsAttunement,
      imagePreviewUrl,
      onRef,
    } = this.props;
    const containerClass = classnames(
      'card',
      `card--${cardType}`
    );
    return (
      <div className={containerClass} ref={onRef || noop}>
        <div className="card__icon">
          <img src={imagePreviewUrl || staff} alt="icon" />
        </div>
        <img src={cards[cardType]} className="card__img" alt="card" />
        <div className={`card__attunement ${needsAttunement}`} />
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
    );
  }
}
