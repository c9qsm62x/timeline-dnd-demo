import React, { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useDrag } from "./DragContext";
import { useDragRow } from "./DragTimelineRow";

import styled from "styled-components";

const StyledDiv = styled.div<{ isMouseDown: boolean }>`
  cursor: ${({ isMouseDown }) => (isMouseDown ? "grabbing" : "grab")};
  user-select: none;
  -webkit-user-select: none;

  * > {
    user-select: none;
    -webkit-user-select: none;
  }
`;

type DragTimelineEventProps = {
  id?: string;
  ghost?: React.ComponentType;
  mouseDownDelay?: number;

  style: React.CSSProperties;
  extraData?: unknown;
  timelineProps: {
    startDate: Date;
    endDate: Date;
    widthPx: string;
    offsetPx: string;
  };
  children: (active: boolean) => React.ReactElement;
};
const DragTimelineEvent: React.FC<DragTimelineEventProps> = ({
  id = null,
  children,
  mouseDownDelay = 1000,
  timelineProps,
  style = {},
  ghost,
  extraData = {},
}) => {
  const { updateDragState, uuid: activeUuid } = useDrag();
  const row = useDragRow();
  const uuidRef = useRef(id);
  const timeoutRef = useRef(0);
  const getUUID = () => {
    if (uuidRef.current === null) {
      uuidRef.current = uuid();
    }
    return uuidRef.current;
  };
  const [isMouseDown, setMouseDown] = useState(false);
  const defaultGhost: React.FC<{ text?: string }> = ({ text }) => {
    return (
      <div
        style={{
          width: timelineProps.widthPx,
          ...style,
          margin: 0,
          transform: "none",
          top: 0,
          left: 0,
          userSelect: "none",
        }}
      >
        {text}
        {children(getUUID() === activeUuid)}
      </div>
    );
  };
  const GhostComponent = ghost || defaultGhost;
  return (
    <StyledDiv
      isMouseDown={isMouseDown}
      onMouseDown={(event) => {
        setMouseDown(true);
        timeoutRef.current = window.setTimeout(() => {
          updateDragState({
            originRow: row,
            data: {
              ...timelineProps,
              extraData,
            },
            uuid: getUUID(),
            isDragging: true,
            GhostComponent,
            position: {
              top: event.clientY,
              left: event.clientX,
            },
          });
        }, mouseDownDelay);
      }}
      onMouseUp={() => {
        setMouseDown(false);
        window.clearTimeout(timeoutRef.current);
      }}
      style={{
        userSelect: "none",
        marginLeft: timelineProps.offsetPx,
        width: timelineProps.widthPx,
        visibility: getUUID() === activeUuid ? "hidden" : "visible",
        ...style,
      }}
    >
      {children(getUUID() === activeUuid)}
    </StyledDiv>
  );
};

export default DragTimelineEvent;
