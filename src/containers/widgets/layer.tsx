import React, { PureComponent, ReactNode, createRef } from 'react';
import { Block } from 'baseui/block';
import { SIDE_NAVBAR_WIDTH } from '../../constants/widget-units';

export const BottomRightLayer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Block
    position='fixed'
    bottom='10px'
    right='10px'
    width='500px'
    backgroundColor='backgroundTertiary'
    paddingTop='scale600'
    paddingLeft='scale600'
    paddingRight='scale600'
  >
    {children}
  </Block>
);

export const LeftLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Block
      position='fixed'
      top='0px'
      bottom='0px'
      left={SIDE_NAVBAR_WIDTH}
      width='310px'
      paddingTop='scale600'
      paddingBottom='scale200'
      paddingLeft='scale550'
      paddingRight='scale550'
      backgroundColor='backgroundPrimary'
      overflow='auto'
    >
      {children}
    </Block>
  );
};

export const TopRightLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Block
      display='flex'
      flexDirection='column'
      position='fixed'
      top='10px'
      right='10px'
    >
      {children}
    </Block>
  );
};

type GraphLayerProps = {
  isMainWidgetExpanded: boolean;
  children: ReactNode;
  leftLayerWidth: string;
  graphRef: any;
};

export class GraphLayer extends PureComponent<GraphLayerProps> {
  private blockRef = createRef<HTMLDivElement>();

  componentDidMount() {
    const { graphRef } = this.props;
    const { graph } = graphRef.current;
    const { innerWidth, innerHeight } = this.getInnerDimension();
    graph.changeSize(innerWidth, innerHeight);
  }

  componentDidUpdate(prevProps: GraphLayerProps) {
    const { isMainWidgetExpanded } = this.props;
    const { isMainWidgetExpanded: prevMainWidgetExpanded } = prevProps;
    if (isMainWidgetExpanded !== prevMainWidgetExpanded) {
      const { graphRef } = this.props;

      const { graph } = graphRef.current;

      // width (310) + padding (14 * 2)
      const leftLayerWidthPx = 338;

      const { innerWidth, innerHeight } = this.getInnerDimension();

      if (isMainWidgetExpanded) {
        const deductedInnerWidth: number = innerWidth - leftLayerWidthPx;
        graph.changeSize(deductedInnerWidth, innerHeight);
      } else {
        const addedInnerWidth: number = innerWidth + leftLayerWidthPx;
        graph.changeSize(addedInnerWidth, innerHeight);
      }

      this.centerView();
    }
  }

  private getInnerDimension = () => {
    const { clientWidth, clientHeight } = this.blockRef.current;

    // to prevent the browser round off decimals to cause overflow
    const innerWidth: number = Math.floor(clientWidth - 1);
    const innerHeight: number = Math.floor(clientHeight - 1);

    return { innerWidth, innerHeight };
  };

  private centerView = () => {
    const { graphRef } = this.props;
    const { graph } = graphRef.current;

    const padding = graph.get('fitViewPadding');
    const width: number = graph.get('width');
    const height: number = graph.get('height');

    const viewCenter = {
      x: (width - padding - padding) / 2 + padding,
      y: (height - padding - padding) / 2 + padding,
    };

    const bbox = graph.get('group').getCanvasBBox();
    if (bbox.width === 0 || bbox.height === 0) return;
    const groupCenter = {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2,
    };

    graph.translate(viewCenter.x - groupCenter.x, viewCenter.y - groupCenter.y);
  };

  render() {
    const { leftLayerWidth, children } = this.props;

    return (
      <Block
        ref={this.blockRef}
        position='absolute'
        width={`calc(100% - (${SIDE_NAVBAR_WIDTH} + ${leftLayerWidth}))`}
        height='100%'
        left={`calc(${SIDE_NAVBAR_WIDTH} + ${leftLayerWidth})`}
        overrides={{
          Block: {
            style: {
              overflowX: 'hidden',
            },
          },
        }}
      >
        {children}
      </Block>
    );
  }
}
