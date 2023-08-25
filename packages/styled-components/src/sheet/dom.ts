import { SC_ATTR, SC_ATTR_ACTIVE, SC_ATTR_VERSION, SC_VERSION } from '../constants';
import styledError from '../utils/error';
import getNonce from '../utils/nonce';

/** Find last style element if any inside target */
const findLastStyleTag = (target: HTMLElement): void | HTMLStyleElement => {
  const arr = Array.from(target.querySelectorAll<HTMLStyleElement>(`style[${SC_ATTR}]`));

  return arr[arr.length - 1];
};

/** Create a style element inside `target` or <head> after the last */
export const makeStyleTag = (target?: HTMLElement | undefined): HTMLStyleElement => {
  const head = document.head;
  const parent = target || head;
  const style = document.createElement('style');
  // style 标签的插入位置
  const prevStyle = findLastStyleTag(parent);
  const nextSibling = prevStyle !== undefined ? prevStyle.nextSibling : null;

  // 自定义属性 data-set
  style.setAttribute(SC_ATTR, SC_ATTR_ACTIVE);
  style.setAttribute(SC_ATTR_VERSION, SC_VERSION);

  const nonce = getNonce();

  // 设置 style 标签的 nonce 属性：一种加密的随机数（一次使用的数字）
  if (nonce) style.setAttribute('nonce', nonce);

  // 在父节点里的最后一个子节点的位置插入新的 style 节点
  parent.insertBefore(style, nextSibling);

  return style;
};

/** Get the CSSStyleSheet instance for a given style element */
export const getSheet = (tag: HTMLStyleElement): CSSStyleSheet => {
  if (tag.sheet) {
    return tag.sheet as any as CSSStyleSheet;
  }

  // Avoid Firefox quirk where the style element might not have a sheet property
  const { styleSheets } = document;
  for (let i = 0, l = styleSheets.length; i < l; i++) {
    const sheet = styleSheets[i];
    if (sheet.ownerNode === tag) {
      return sheet as any as CSSStyleSheet;
    }
  }

  throw styledError(17);
};
