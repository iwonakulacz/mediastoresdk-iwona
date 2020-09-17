import styled from 'styled-components';
import { BackgroundColor, IconsColor } from 'styles/variables';
import { mediaFrom } from 'styles/BreakPoints';

// eslint-disable-next-line import/prefer-default-export
export const WrapStyled = styled.main`
  position: relative;
  display: flex;
  flex-grow: 1;
  min-height: 100%;

  padding: 35px 26px;

  background-color: ${BackgroundColor};
  border-top: 1px solid ${IconsColor};
  border-left: none;

  ${mediaFrom.small`
    border-left: 1px solid ${IconsColor};
    border-top: none;
    padding: 35px;

  `}
`;