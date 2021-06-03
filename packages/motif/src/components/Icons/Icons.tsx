/* 1st Priority Heroicons, 2nd Boxicons */
import React from 'react';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiChevronDown,
  HiChevronUp,
  HiOutlinePlus,
  HiCheck,
  HiCheckCircle,
  HiX,
  HiOutlinePencil,
  HiOutlineDotsVertical,
  HiOutlineCog,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
  HiOutlineCamera,
  HiOutlineFilter,
  HiOutlineSearch,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArrowNarrowDown,
  HiQuestionMarkCircle,
  HiUser,
} from 'react-icons/hi';
import {
  BiLayer,
  BiBarChartAlt,
  BiAdjust,
  BiBracket,
  BiHash,
  BiTime,
  BiTrash,
  BiFullscreen,
  BiUndo,
  BiRedo,
  BiListUl,
  BiNetworkChart,
  BiSave,
  BiPlay,
  BiPause,
  BiReset,
  BiRocket,
  BiTable,
} from 'react-icons/bi';
import { BsSlash } from 'react-icons/bs';
import { VscSymbolKey, VscCircleOutline } from 'react-icons/vsc';
import { AiOutlineWarning } from 'react-icons/ai';
import { IconBaseProps } from 'react-icons';

export const Node = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <VscCircleOutline size={size} {...rest}>
    {children}
  </VscCircleOutline>
);

export const Edge = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BsSlash strokeWidth='1' size={size} {...rest}>
    {children}
  </BsSlash>
);

export const Network = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiNetworkChart size={size} {...rest}>
    {children}
  </BiNetworkChart>
);

export const Eye = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlineEye size={size} {...rest}>
    {children}
  </HiOutlineEye>
);

export const EyeOff = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlineEyeOff size={size} {...rest}>
    {children}
  </HiOutlineEyeOff>
);

export const Trash = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiTrash size={size} {...rest}>
    {children}
  </BiTrash>
);

export const ChevronDown = ({
  children,
  size = 16,
  ...rest
}: IconBaseProps) => (
  <HiChevronDown size={size} {...rest}>
    {children}
  </HiChevronDown>
);

export const ChevronUp = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiChevronUp size={size} {...rest}>
    {children}
  </HiChevronUp>
);

export const ChevronRight = ({
  children,
  size = 16,
  ...rest
}: IconBaseProps) => (
  <HiChevronRight size={size} {...rest}>
    {children}
  </HiChevronRight>
);

export const ChevronLeft = ({
  children,
  size = 16,
  ...rest
}: IconBaseProps) => (
  <HiChevronLeft size={size} {...rest}>
    {children}
  </HiChevronLeft>
);

export const Plus = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlinePlus size={size} {...rest}>
    {children}
  </HiOutlinePlus>
);

export const Tick = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiCheck size={size} {...rest}>
    {children}
  </HiCheck>
);

export const CheckCircle = ({
  children,
  size = 16,
  ...rest
}: IconBaseProps) => (
  <HiCheckCircle size={size} {...rest}>
    {children}
  </HiCheckCircle>
);

export const X = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiX size={size} {...rest}>
    {children}
  </HiX>
);

export const Pencil = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlinePencil size={size} {...rest}>
    {children}
  </HiOutlinePencil>
);

export const Layer = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiLayer size={size} {...rest}>
    {children}
  </BiLayer>
);

export const DotsVertical = ({
  children,
  size = 16,
  ...rest
}: IconBaseProps) => (
  <HiOutlineDotsVertical size={size} {...rest}>
    {children}
  </HiOutlineDotsVertical>
);

export const BarChart = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiBarChartAlt size={size} {...rest}>
    {children}
  </BiBarChartAlt>
);

export const Symbol = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <VscSymbolKey size={size} {...rest}>
    {children}
  </VscSymbolKey>
);

export const Adjust = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiAdjust size={size} {...rest}>
    {children}
  </BiAdjust>
);

export const Bracket = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiBracket size={size} {...rest}>
    {children}
  </BiBracket>
);

export const Hash = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiHash size={size} {...rest}>
    {children}
  </BiHash>
);

export const Time = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiTime size={size} {...rest}>
    {children}
  </BiTime>
);

export const Gear = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlineCog size={size} {...rest}>
    {children}
  </HiOutlineCog>
);

export const FullScreen = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiFullscreen size={size} {...rest}>
    {children}
  </BiFullscreen>
);

export const Undo = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiUndo size={size} {...rest}>
    {children}
  </BiUndo>
);

export const Redo = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiRedo size={size} {...rest}>
    {children}
  </BiRedo>
);

export const ZoomIn = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlineZoomIn size={size} {...rest}>
    {children}
  </HiOutlineZoomIn>
);

export const ZoomOut = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlineZoomOut size={size} {...rest}>
    {children}
  </HiOutlineZoomOut>
);

export const Filter = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlineFilter size={size} {...rest}>
    {children}
  </HiOutlineFilter>
);

export const Legend = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiListUl size={size} {...rest}>
    {children}
  </BiListUl>
);

export const Camera = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlineCamera size={size} {...rest}>
    {children}
  </HiOutlineCamera>
);

export const Search = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlineSearch size={size} {...rest}>
    {children}
  </HiOutlineSearch>
);

export const Save = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiSave size={size} {...rest}>
    {children}
  </BiSave>
);

export const Play = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiPlay size={size} {...rest}>
    {children}
  </BiPlay>
);

export const Pause = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiPause size={size} {...rest}>
    {children}
  </BiPause>
);

export const Reset = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiReset size={size} {...rest}>
    {children}
  </BiReset>
);

export const Rocket = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiRocket size={size} {...rest}>
    {children}
  </BiRocket>
);

export const ArrowDown = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiOutlineArrowNarrowDown size={size} {...rest}>
    {children}
  </HiOutlineArrowNarrowDown>
);

export const Table = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <BiTable size={size} {...rest}>
    {children}
  </BiTable>
);

export const QuestionMarkCircle = ({
  children,
  size = 16,
  ...rest
}: IconBaseProps) => {
  return (
    <HiQuestionMarkCircle size={size} {...rest}>
      {children}
    </HiQuestionMarkCircle>
  );
};

export const User = ({ children, size = 16, ...rest }: IconBaseProps) => (
  <HiUser size={size} {...rest}>
    {children}
  </HiUser>
);

export const WarningSign = ({
  size = 16,
  children,
  ...rest
}: IconBaseProps) => (
  <AiOutlineWarning size={size} {...rest}>
    {children}
  </AiOutlineWarning>
);
