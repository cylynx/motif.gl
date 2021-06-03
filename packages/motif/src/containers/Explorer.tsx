/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
  MutableRefObject,
  ForwardedRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseProvider, ThemeProvider } from 'baseui';
import { Theme } from 'baseui/theme';
import { Block } from 'baseui/block';

import { ToasterContainer, PLACEMENT } from 'baseui/toast';
import Graphin from '@cylynx/graphin';
import DataTableModal from './DataTableModal';
import ImportWizardModal from './ImportWizardModal';
import { defaultWidgetList } from './widgets';
import {
  Overrides,
  getTooltipOverride,
  getWidgetOverride,
} from '../utils/overrides';
import { UISlices } from '../redux/ui';
import { MotifLightTheme, MotifDarkTheme } from '../theme';
import { WidgetSelectors, WidgetSlices, WidgetItem } from '../redux/widget';
import { GraphSlices, Accessors, StyleOptions } from '../redux/graph';
import SideNavBars from './SideNavBar';
import Graph, { GraphRefContext } from './Graph';
import Tooltip from './Tooltip';
import { LEFT_LAYER_WIDTH } from '../constants/widget-units';
import { GraphLayer } from './widgets/layer';

export interface WidgetContainerProps {
  children: ReactNode;
  graphRef: MutableRefObject<Graphin>;
  theme: Theme;
}

export type ExplorerProps = {
  name: string;
  accessors: Accessors;
  overrides?: Overrides;
  styleOptions?: StyleOptions;
  primaryTheme?: Theme;
  secondaryTheme?: Theme;
};

export const WidgetContainer = (props: WidgetContainerProps) => {
  const { children, theme, graphRef } = props;

  if (graphRef?.current?.graph) {
    return (
      <ThemeProvider theme={theme}>
        <ToasterContainer placement={PLACEMENT.top}>
          <GraphRefContext.Provider value={graphRef.current}>
            {children}
          </GraphRefContext.Provider>
        </ToasterContainer>
      </ThemeProvider>
    );
  }
  return null;
};

const Explorer = React.forwardRef<Graphin, ExplorerProps>(
  // MutableRefObject clashing with ForwardRef types in React.
  // @ts-ignore
  (props, ref: MutableRefObject<Graphin>) => {
    const {
      name,
      accessors,
      overrides,
      primaryTheme,
      secondaryTheme,
      styleOptions = GraphSlices.initialState.styleOptions,
    } = props;
    const localRef = useRef<Graphin>(null);
    const graphRef: ForwardedRef<Graphin> | MutableRefObject<Graphin> =
      ref || localRef;
    const [tooltip, setTooltip] = useState(null);
    const [leftLayerWidth, setLeftLayerWidth] =
      useState<string>(LEFT_LAYER_WIDTH);

    const dispatch = useDispatch();
    const widgetState = useSelector((state) =>
      WidgetSelectors.getWidget(state),
    );
    const widgetStateIds = useMemo(() => {
      return Object.values(widgetState);
    }, [widgetState]);

    const UserTooltip = getTooltipOverride(overrides, Tooltip);
    const widgetList = getWidgetOverride(overrides, defaultWidgetList);
    const activeWidgetList: WidgetItem[] =
      widgetList.filter((x: WidgetItem) => widgetStateIds.includes(x.id)) || [];

    const isMainWidgetExpanded: boolean = useMemo(() => {
      return widgetState.main !== null;
    }, [widgetState.main]);

    useEffect(() => {
      if (isMainWidgetExpanded) {
        setLeftLayerWidth(LEFT_LAYER_WIDTH);
        return;
      }

      setLeftLayerWidth('0px');
    }, [isMainWidgetExpanded]);

    useEffect(() => {
      // Filter out components
      const widgetProp = widgetList.map((x) => {
        return {
          id: x.id,
          group: x.group,
          position: x.position,
          active: x.active,
        };
      });
      if (accessors) {
        dispatch(GraphSlices.setAccessors(accessors));
      }
      if (name) {
        dispatch(UISlices.setName(name));
      }
      dispatch(WidgetSlices.setWidget(widgetProp));
      dispatch(GraphSlices.overrideStyles(styleOptions));
    }, [accessors, overrides?.widgetList, name]);

    return (
      <BaseProvider
        theme={primaryTheme || MotifLightTheme}
        overrides={{
          AppContainer: {
            style: { position: 'relative', height: '100%', width: '100%' },
          },
        }}
      >
        <DataTableModal />
        <ImportWizardModal overrideTabs={overrides?.Tabs} />
        <GraphLayer
          isMainWidgetExpanded={isMainWidgetExpanded}
          leftLayerWidth={leftLayerWidth}
          graphRef={graphRef}
        >
          <Graph ref={graphRef} setTooltip={setTooltip} />
        </GraphLayer>
        <WidgetContainer
          graphRef={graphRef}
          theme={secondaryTheme || MotifDarkTheme}
        >
          <SideNavBars />
          {tooltip && <UserTooltip tooltip={{ ...tooltip, leftLayerWidth }} />}
          {activeWidgetList.length > 0 &&
            activeWidgetList.map((item) => (
              <Block key={item.id}>{item.widget}</Block>
            ))}
        </WidgetContainer>
      </BaseProvider>
    );
  },
);

export default Explorer;
