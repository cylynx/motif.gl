import React, { FC } from 'react';
import { useStyletron } from 'baseui';

export type CardProps = {
  children: React.ReactNode;
};

const Card: FC<CardProps> = ({ children }) => {
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
      })}
    >
      {children}
    </div>
  );
};

export default Card;
