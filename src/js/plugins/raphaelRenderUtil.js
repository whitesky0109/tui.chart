/**
 * @fileoverview Util for raphael rendering.
 * @author NHN Ent.
 *         FE Development Lab <dl_javascript@nhnent.com>
 */

import snippet from 'tui-code-snippet';
import renderUtil from '../helpers/renderUtil';
import raphael from 'raphael';

/**
 * Util for raphael rendering.
 * @module raphaelRenderUtil
 * @private
 */
const raphaelRenderUtil = {

    /**
     * Make line path.
     * @memberOf module:raphaelRenderUtil
     * @param {{top: number, left: number}} fromPos from position
     * @param {{top: number, left: number}} toPos to position
     * @param {number} width width
     * @returns {string} path
     */
    makeLinePath(fromPos, toPos, width = 1) {
        const fromPoint = [fromPos.left, fromPos.top];
        const toPoint = [toPos.left, toPos.top];
        const additionalPoint = (width % 2 / 2);

        fromPoint.forEach((from, index) => {
            if (from === toPoint[index]) {
                fromPoint[index] = toPoint[index] = Math.round(from) - additionalPoint;
            }
        });

        return ['M', ...fromPoint, 'L', ...toPoint];
    },

    /**
     * Render line.
     * @memberOf module:raphaelRenderUtil
     * @param {object} paper raphael paper
     * @param {string} path line path
     * @param {string} color line color
     * @param {number} strokeWidth stroke width
     * @returns {object} raphael line
     */
    renderLine(paper, path, color, strokeWidth) {
        const line = paper.path([path]);
        const strokeStyle = {
            stroke: color,
            'stroke-width': (snippet.isUndefined(strokeWidth) ? 2 : strokeWidth),
            'stroke-linecap': 'butt'
        };
        if (color === 'transparent') {
            strokeStyle.stroke = '#fff';
            strokeStyle['stroke-opacity'] = 0;
        }

        line.attr(strokeStyle).node.setAttribute('class', 'auto-shape-rendering');

        return line;
    },

    /**
     * text ellipsis for fixed width
     * @param {string} text - target text
     * @param {number} fixedWidth - width for elipsis
     * @param {object} theme - lable theme
     * @returns {string}
     */
    getEllipsisText(text, fixedWidth, theme) {
        const textArray = text.split('');
        const textLength = textArray.length;
        const dotWidth = this.getRenderedTextSize('.', theme.fontSize, theme.fontFamily).width;
        let newString = '';
        let textWidth = dotWidth * 2;

        for (let i = 0; i < textLength; i += 1) {
            textWidth += this.getRenderedTextSize(textArray[i], theme.fontSize, theme.fontFamily).width;
            if (textWidth >= fixedWidth) {
                newString += '..';
                break;
            }
            newString += textArray[i];
        }

        return newString;
    },

    /**
     * Render text
     * @param {object} paper - Raphael paper object
     * @param {{left: number, top: number}} pos - text object position
     * @param {string} text - text content
     * @param {object} [attributes] - text object's attributes
     * @returns {object}
     */
    renderText(paper, pos, text, attributes) {
        const textObj = paper.text(pos.left, pos.top, snippet.decodeHTMLEntity(String(text)));

        if (attributes) {
            if (attributes['dominant-baseline']) {
                textObj.node.setAttribute('dominant-baseline', attributes['dominant-baseline']);
            } else {
                textObj.node.setAttribute('dominant-baseline', 'central');
            }

            textObj.attr(attributes);
        }

        return textObj;
    },

    /**
     * Render area graph.
     * @param {object} paper raphael paper
     * @param {string} path path
     * @param {object} fillStyle fill style
     *      @param {string} fillStyle.fill fill color
     *      @param {?number} fillStyle.opacity fill opacity
     *      @param {string} fillStyle.stroke stroke color
     *      @param {?number} fillStyle.stroke-opacity stroke opacity
     * @returns {Array.<object>} raphael object
     */
    renderArea(paper, path, fillStyle) {
        const area = paper.path(path);

        fillStyle = Object.assign({
            'stroke-opacity': 0
        }, fillStyle);
        area.attr(fillStyle);

        return area;
    },

    /**
     * Render circle.
     * @param {object} paper - raphael object
     * @param {{left: number, top: number}} position - position
     * @param {number} radius - radius
     * @param {object} attributes - attributes
     * @returns {object}
     */
    renderCircle(paper, position, radius, attributes) {
        const circle = paper.circle(position.left, position.top, radius);

        if (attributes) {
            circle.attr(attributes);
        }

        return circle;
    },

    /**
     * Render rect.
     * @param {object} paper - raphael object
     * @param {{left: number, top: number, width: number, height, number}} bound - bound
     * @param {object} attributes - attributes
     * @returns {*}
     */
    renderRect(paper, bound, attributes) {
        const rect = paper.rect(bound.left, bound.top, bound.width, bound.height);

        if (attributes) {
            rect.attr(attributes);
        }

        return rect;
    },

    /**
     * Update rect bound
     * @param {object} rect raphael object
     * @param {{left: number, top: number, width: number, height: number}} bound bound
     */
    updateRectBound(rect, bound) {
        rect.attr({
            x: bound.left,
            y: bound.top,
            width: bound.width,
            height: bound.height
        });
    },

    /**
     * Render items of line type chart.
     * @param {Array.<Array.<object>>} groupItems group items
     * @param {function} funcRenderItem function
     */
    forEach2dArray(groupItems, funcRenderItem) {
        if (groupItems) {
            groupItems.forEach((items, groupIndex) => {
                items.forEach((item, index) => {
                    funcRenderItem(item, groupIndex, index);
                });
            });
        }
    },

    /**
     * Make changed luminance color.
     * @param {string} hex hax color
     * @param {number} lum luminance
     * @returns {string} changed color
     */
    makeChangedLuminanceColor(hex, lum) {
        hex = hex.replace('#', '');
        lum = lum || 0;

        const changedHex = snippet.range(3).map(index => {
            const hd = parseInt(hex.substr(index * 2, 2), 16);
            let newHd = hd + (hd * lum);

            newHd = Math.round(Math.min(Math.max(0, newHd), 255)).toString(16);

            return renderUtil.formatToZeroFill(newHd, 2);
        }).join('');

        return `#${changedHex}`;
    },

    /**
     * Get rendered text element size
     * @param {string} text text content
     * @param {number} fontSize font-size attribute
     * @param {string} fontFamily font-family attribute
     * @returns {{
     *     width: number,
     *     height: number
     * }}
     */
    getRenderedTextSize(text, fontSize, fontFamily) {
        const paper = raphael(document.body, 100, 100);
        const textElement = paper.text(0, 0, text).attr({
            'font-size': fontSize,
            'font-family': fontFamily
        });
        const bBox = textElement.getBBox();

        textElement.remove();
        paper.remove();

        return {
            width: bBox.width,
            height: bBox.height
        };
    },

    /**
     * Animate given element's opacity
     * @param {object} element element
     * @param {number} startOpacity endOpacity default is '0'
     * @param {number} endOpacity endOpacity default is '1'
     * @param {number} duration endOpacity default is '600'
     */
    animateOpacity(element, startOpacity, endOpacity, duration) {
        const animationDuration = isNumber(duration) ? duration : 600;
        const animationStartOpacity = isNumber(startOpacity) ? startOpacity : 0;
        const animationEndOpacity = isNumber(endOpacity) ? endOpacity : 1;
        const animation = raphael.animation({
            opacity: animationEndOpacity
        }, animationDuration);

        element.attr({
            opacity: animationStartOpacity
        });

        element.animate(animation);
    }
};

/**
 * Return boolean value for given parameter is number or not
 * @param {*} numberSuspect number suspect
 * @returns {boolean}
 */
function isNumber(numberSuspect) {
    return snippet.isExisty(numberSuspect) && typeof numberSuspect === 'number';
}

export default raphaelRenderUtil;
