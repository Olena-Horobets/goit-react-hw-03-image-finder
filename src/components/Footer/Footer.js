import s from './Footer.module.css';

import { Component } from 'react';
import { ReactComponent as ReactSprite } from 'images/svg/sprite.svg';

class Footer extends Component {
  render() {
    return (
      <footer className={s.footer}>
        <ReactSprite />
        <p>&#169; All rights reserved. Images source</p>
        <a
          href="https://pixabay.com/"
          className={s.logo}
          target="_blank"
          noreferrer="true"
          rel="noreferrer"
        >
          <svg width="150" height="40">
            <use href="#icon-pixabay"></use>
          </svg>
        </a>
      </footer>
    );
  }
}

export { Footer };
