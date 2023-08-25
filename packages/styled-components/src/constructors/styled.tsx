import createStyledComponent from '../models/StyledComponent';
import { WebTarget } from '../types';
// html 标签列表
import domElements from '../utils/domElements';
import constructWithOptions, { Styled } from './constructWithOptions';

// 创建基础的 styled 方法
const baseStyled = <Target extends WebTarget>(tag: Target) =>
  constructWithOptions<'web', Target>(createStyledComponent, tag);

const styled = baseStyled as typeof baseStyled & {
  [E in keyof JSX.IntrinsicElements]: Styled<'web', E, JSX.IntrinsicElements[E]>;
};

// 实现通过 styled[domElement] 和 styled(domElement) 都能创建样式化组件
domElements.forEach(domElement => {
  styled[domElement] = baseStyled<typeof domElement>(domElement);
});

export default styled;
