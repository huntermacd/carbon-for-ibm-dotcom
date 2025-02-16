/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { customElement, property } from 'lit-element';
import ddsSettings from '@carbon/ibmdotcom-utilities/es/utilities/settings/settings.js';
import DDSCardLinkCTA from '../cta/card-link-cta';
import styles from './card-group.scss';

const { stablePrefix: ddsPrefix } = ddsSettings;

/**
 * Card Group Card Link item.
 *
 * @element dds-card-group-card-link-item
 */
@customElement(`${ddsPrefix}-card-group-card-link-item`)
class DDSCardGroupCardLinkItem extends DDSCardLinkCTA {
  /**
   * `true` if the card group is using border.
   */
  @property({ type: Boolean, reflect: true })
  border = false;

  /**
   * `true` if the card group item is empty.
   */
  @property({ type: Boolean, reflect: true })
  empty = false;

  /**
   * `true` if the card group item has the same background color as the pattern container.
   */
  @property({ type: Boolean, reflect: true })
  patternBackground = false;

  static get stableSelector() {
    return `${ddsPrefix}--card-group-card-link-item`;
  }

  /**
   * A selector that will return the child footer.
   */
  static get selectorFooter() {
    return `${ddsPrefix}-card-cta-footer`;
  }

  static styles = styles;
}

/* @__GENERATE_REACT_CUSTOM_ELEMENT_TYPE__ */
export default DDSCardGroupCardLinkItem;
