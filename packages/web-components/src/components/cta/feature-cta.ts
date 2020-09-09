/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, property, customElement } from 'lit-element';
import settings from 'carbon-components/es/globals/js/settings';
import ddsSettings from '@carbon/ibmdotcom-utilities/es/utilities/settings/settings';
import ifNonNull from 'carbon-web-components/es/globals/directives/if-non-null';
import PlayVideo from '@carbon/ibmdotcom-styles/icons/svg/play-video.svg';
import {
  formatVideoCaption,
  formatVideoDuration,
} from '@carbon/ibmdotcom-utilities/es/utilities/formatVideoCaption/formatVideoCaption';
import DDSFeatureCard from '../feature-card/feature-card';
import CTAMixin from './mixins/cta';
import DDSFeatureCTAFooter from './feature-cta-footer';
import { CTA_TYPE } from './shared-enums';
import styles from './cta.scss';

const { prefix } = settings;
const { stablePrefix: ddsPrefix } = ddsSettings;

/**
 * Feature CTA.
 *
 * @element dds-feature-cta
 */
@customElement(`${ddsPrefix}-feature-cta`)
class DDSFeatureCTA extends CTAMixin(DDSFeatureCard) {
  protected _renderCopy() {
    const {
      videoDuration,
      videoName,
      _hasCopy: hasCopy,
      formatVideoCaption: formatCaptionInEffect,
      formatVideoDuration: formatDurationInEffect,
    } = this;
    const caption = hasCopy
      ? undefined
      : formatCaptionInEffect({
          duration: formatDurationInEffect({ duration: !videoDuration ? videoDuration : videoDuration * 1000 }),
          name: videoName,
        });
    return html`
      <div ?hidden="${!hasCopy && !caption}" class="${prefix}--card__copy">
        <slot @slotchange="${this._handleSlotChange}"></slot>${caption}
      </div>
    `;
  }

  protected _renderImage() {
    const { type, videoName, videoThumbnailUrl, _hasImage: hasImage } = this;
    const thumbnail =
      hasImage || type !== CTA_TYPE.VIDEO
        ? undefined
        : html`
            <dds-image alt="${ifNonNull(videoName)}" default-src="${ifNonNull(videoThumbnailUrl)}">
              ${PlayVideo({ slot: 'icon' })}
            </dds-image>
          `;
    return html`
      <slot name="image" @slotchange="${this._handleSlotChange}"></slot>${thumbnail}
    `;
  }

  /**
   * The formatter for the video caption, composed with the video name and the video duration.
   * Should be changed upon the locale the UI is rendered with.
   */
  @property({ attribute: false })
  formatVideoCaption = formatVideoCaption;

  /**
   * The formatter for the video duration.
   * Should be changed upon the locale the UI is rendered with.
   */
  @property({ attribute: false })
  formatVideoDuration = formatVideoDuration;

  /**
   * The CTA type.
   */
  @property({ reflect: true })
  type = CTA_TYPE.REGULAR;

  /**
   * The video duration.
   */
  @property({ type: Number, attribute: 'video-duration' })
  videoDuration?: number;

  /**
   * The video name.
   */
  @property({ attribute: 'video-name' })
  videoName?: string;

  /**
   * The video thumbnail URL.
   */
  @property({ attribute: 'video-thumbnail-url' })
  videoThumbnailUrl?: string;

  updated(changedProperties) {
    super.updated(changedProperties);
    const { selectorFooter } = this.constructor as typeof DDSFeatureCTA;
    if (changedProperties.has('type')) {
      const { type } = this;
      const footer = this.querySelector(selectorFooter);
      if (footer) {
        (footer as DDSFeatureCTAFooter).type = type;
      }
    }
  }

  /**
   * A selector that will return the child footer.
   */
  static get selectorFooter() {
    return `${ddsPrefix}-feature-cta-footer`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default DDSFeatureCTA;