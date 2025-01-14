/**
 * Copyright IBM Corp. 2016, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import ddsSettings from '@carbon/ibmdotcom-utilities/es/utilities/settings/settings';
import { HorizontalRule } from '../HorizontalRule';
import PropTypes from 'prop-types';
import settings from 'carbon-components/es/globals/js/settings';
import TOCDesktop from './TOCDesktop';
import TOCMobile from './TOCMobile';

const { stablePrefix } = ddsSettings;
const { prefix } = settings;

/**
 * loops into the array of elements and returns the values
 *
 * @private
 * @returns {Array} returns element name and data title
 */
const _findMenuItems = () => {
  const eles = document.querySelectorAll('a[name]');
  const menuItems = [];
  eles.forEach(element => {
    if (element.getAttribute('name') !== 'menuLabel') {
      menuItems.push({
        id: element.getAttribute('name'),
        title: element.getAttribute('data-title') || '',
      });
    }
  });
  return menuItems;
};

/**
 * Table of Contents pattern.
 */
const TableOfContents = ({
  menuItems,
  children,
  menuLabel,
  theme,
  stickyOffset,
  menuRule,
  headingContent,
}) => {
  const [useMenuItems, setUseMenuItems] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');

  useEffect(() => {
    setUseMenuItems(menuItems?.length ? [...menuItems] : _findMenuItems());
  }, [children, menuItems]);

  useEffect(() => {
    let id = useMenuItems[0] ? useMenuItems[0].id : '';
    let title = useMenuItems[0] ? useMenuItems[0].title : '';
    if (id === 'menuLabel' && useMenuItems[1]) {
      id = useMenuItems[1].id;
      title = useMenuItems[1].title;
    }

    setSelectedId(id);
    setSelectedTitle(title);
  }, [useMenuItems]);

  useEffect(() => {
    /**
     * Function to be added to eventListener and cleaned later on
     */
    const handleRAF = () => {
      window.requestAnimationFrame(setSelectedItem);
    };

    window.addEventListener('scroll', handleRAF);
    return () => window.removeEventListener('scroll', handleRAF);
  });

  /**
   * Set selected id & title
   *
   */
  const setSelectedItem = () => {
    const elems = getElemsInView();
    if (elems) {
      const id = elems || useMenuItems[0].id;
      const filteredItems = useMenuItems.filter(menu => {
        if (id !== 'undefined') {
          return menu.id === id;
        }
      });
      const title = filteredItems[0]?.title;
      if (title !== undefined) {
        setSelectedId(id);
        setSelectedTitle(title);
      }
    }
  };

  /**
   * Check whether provided anchor tags are in visible viewport
   *
   * @returns {string} name attribute
   */
  const getElemsInView = () => {
    const items = [...document.querySelectorAll('a[name]')]
      .map((elem, index, arr) => ({
        elem,
        height: arr[index + 1]
          ? arr[index + 1].getBoundingClientRect().y -
            elem.getBoundingClientRect().y
          : null,
        position: elem.getBoundingClientRect().y,
      }))
      .filter((elem, index, arr) =>
        elem.height === null
          ? arr[index - 1].position < arr[index - 1].height
          : elem.position - 50 - stickyOffset > -elem.height
      );

    // Sets last section as active at the end of page in case there is not enough height for it to dynamically activate
    const bottomReached =
      document.documentElement.scrollTop +
        document.documentElement.clientHeight ===
      document.documentElement.scrollHeight;
    return !bottomReached
      ? items[0].elem.getAttribute('name')
      : items[items.length - 1].elem.getAttribute('name');
  };

  /**
   * Sets the selected menu item
   *
   * @param {*} id selected id of menu item
   * @param {*} title selected title of menu item
   */
  const updateState = (id, title) => {
    setSelectedId(id);
    setSelectedTitle(title);
  };

  /**
   * Validate if the Menu Items has Id and Title filled
   *
   * @param {Array} menuItems array of Items
   * @returns {Array} filtered array of items
   */
  const validateMenuItems = menuItems =>
    menuItems.filter(
      item => item?.title?.trim().length && item?.id?.trim().length
    );

  /**
   * Props for TOCDesktop and TOCMobile
   *
   * @type {{
   * updateState: Function,
   * selectedId: string,
   * menuItems: Array,
   * selectedTitle: string,
   * menuLabel: string
   * children: object
   * }}
   */
  const props = {
    menuItems: validateMenuItems(useMenuItems),
    selectedId,
    selectedTitle,
    menuLabel,
    updateState,
    children: children.length > 1 ? children[0] : null,
  };

  /**
   * Render TableOfContents pattern
   *
   * @returns {*} JSX Object
   */
  return (
    <section
      data-autoid={`${stablePrefix}--tableofcontents`}
      className={classNames(`${prefix}--tableofcontents`, {
        [`${prefix}--tableofcontents--${theme}`]: theme,
      })}>
      <div className={`${stablePrefix}-ce--table-of-contents__container`}>
        <div className={`${prefix}--tableofcontents__sidebar`}>
          {headingContent && (
            <div className={`${prefix}--tableofcontents__desktop__children`}>
              {headingContent}

              {menuRule && <HorizontalRule />}
            </div>
          )}
          <div className={`${prefix}--tableofcontents__mobile-top`}></div>
          <div
            style={{
              position: 'sticky',
              top: stickyOffset ? `${stickyOffset}px` : 0,
            }}>
            <TOCDesktop
              menuRule={menuRule}
              headingContent={headingContent}
              {...props}
            />
            <TOCMobile {...props} />
          </div>
        </div>
        <div className={`${prefix}--tableofcontents__content`}>
          <div className={`${prefix}--tableofcontents__content-wrapper`}>
            {headingContent !== undefined ? (
              <>
                <div className={`${prefix}--tableofcontents__children__mobile`}>
                  {headingContent}
                </div>
                {children}
              </>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

TableOfContents.propTypes = {
  /**
   * Array of menu item objects to render within the side nav.
   * Each items has the following structure:
   *
   * | Properties Name | Data Type | Description     |
   * | --------------- | --------- | --------------- |
   * | title           | String    | Menu title text |
   * | id              | String    | Menu id         |
   *
   * If `menuItems` is not passed in as a prop, the menu items are dynamically
   * generated based on anchor links that exist on the page. The anchor links should
   * follow the following format:
   *
   * ```html
   * <a name="name-of-section" data-title="Lorem Ipsum"></a>
   * ```
   */
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ),

  /**
   * Content to display next to the side nav.
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),

  /**
   * Placeholder value for menu label.
   */
  menuLabel: PropTypes.string,

  /**
   * Defines the color theme for the pattern. Choose from:
   *
   * | Name            | Description                              |
   * | --------------- | ---------------------------------------- |
   * | white / default | White theme applied to pattern           |
   * | g10             | Gray 10 (g10) theme applied to pattern   |
   * | g100            | Gray 100 (g100) theme applied to pattern |
   */
  theme: PropTypes.oneOf(['white', 'g10', 'g100']),

  /**
   * Defines the offset for the sticky column.
   */
  stickyOffset: PropTypes.number,

  /**
   * Defines if the menu ruler will be rendered.
   */
  menuRule: PropTypes.bool,

  /**
   * Content to be displayed above the navigation menu.
   */
  headingContent: PropTypes.node,
};

TableOfContents.defaultProps = {
  menuItems: null,
  menuLabel: 'Jump to',
  theme: 'white',
  stickyOffset: null,
};

export default TableOfContents;
