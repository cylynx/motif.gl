// @ts-nocheck
import React, { FC } from 'react';
import { useStyletron } from 'baseui';

export type CardProps = {
  children: React.ReactNode;
  $style?: React.HTMLAttributes<HTMLDivElement>['style'];
};

const Card: FC<CardProps> = ({ children, $style }) => {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        backgroundColor: theme.colors.backgroundSecondary,
        paddingTop: theme.sizing.scale300,
        paddingBottom: theme.sizing.scale300,
        paddingLeft: theme.sizing.scale300,
        paddingRight: theme.sizing.scale300,
        borderBottomLeftRadius: theme.borders.radius200,
        borderBottomRightRadius: theme.borders.radius200,
        borderTopLeftRadius: theme.borders.radius200,
        borderTopRightRadius: theme.borders.radius200,
        ...$style,
      })}
    >
      {children}
    </div>
  );
};

export default Card;
