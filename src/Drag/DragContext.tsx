import React, { useCallback, useRef, useState } from "react";
import throttle from "lodash/throttle";

import styled from "styled-components";
const StyledDiv = styled.div<{ isDragging: boolean }>`
cursor: ${({ isDragging }) => (isDragging ? "grabbing" : "default")};
user-select: none;

}`;
type Position = {
  top: number;
  left: number;
};
export type Row = {
  id: string;
  name?: string;
  extraData?: unknown;
};
type DragContextState = {
  uuid: string | null;
  position: Position;
  data: {
    startDate: Date;
    endDate: Date;
    widthPx: string;
    offsetPx: string;
    extraData: unknown;
  } | null;
  isDragging: boolean;
  GhostComponent: React.ComponentType<{ text?: string }> | null;
  originRow?: Row;
  destinationRow?: Row;
};

type DropForwardEventCallback = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  dragState: DragContextState
) => {
  startDate: Date;
  endDate: Date;
};

type DragContextProps = {
  setPosition: (top: number, left: number) => void;
  getPosition: () => Position;
  updateDragState: (drag: Partial<DragContextState>) => void;
  setPositionGetter: (positionGetter: DropForwardEventCallback) => void;
} & DragContextState;

const defaultContext: DragContextProps = {
  uuid: null,
  data: null,
  position: {
    top: 0,
    left: 0,
  },
  isDragging: false,
  GhostComponent: () => null,
  setPosition: () => void 0,
  getPosition: () => ({
    top: 0,
    left: 0,
  }),
  updateDragState: () => void 0,
  setPositionGetter: () => void 0,
};
const DragContext = React.createContext<DragContextProps>(defaultContext);

export const useDrag = () => {
  return React.useContext(DragContext);
};

export type onDropEvent = Pick<
  DragContextState,
  "destinationRow" | "originRow" | "data" | "uuid"
> & {
  eventDestination: {
    startDate: Date;
    endDate: Date;
  };
};

type DragProviderProps = {
  children: React.ReactNode;
  onDrop: (onDropEvent: onDropEvent) => void;
};
const DragProvider: React.ForwardRefRenderFunction<{}, DragProviderProps> = (
  { children, onDrop },
  ref
) => {
  const position = useRef<Position>({
    top: 0,
    left: 0,
  });

  const positionGetter = useRef<DropForwardEventCallback>(() => {
    throw new Error("onDrop no defined");
  });

  const setPosition = (top: number, left: number) => {
    position.current.top = top;
    position.current.left = left;
  };

  const getPosition = () => {
    return position.current;
  };

  const [dragState, setDragState] = useState<DragContextState>({
    uuid: null,
    data: null,
    GhostComponent: null,
    position: {
      top: 0,
      left: 0,
    },
    isDragging: false,
  });

  const reset = () =>
    setDragState({
      uuid: null,
      data: null,
      GhostComponent: null,
      position: {
        top: 0,
        left: 0,
      },
      isDragging: false,
      originRow: void 0,
      destinationRow: void 0,
    });

  const updateDragState = useCallback(
    (nextState: Partial<DragContextState>) => {
      setDragState((prevState) => ({
        ...prevState,
        ...nextState,
      }));
    },
    [setDragState]
  );

  const updateDragStateThrottle = useCallback(
    throttle((top: number, left: number) => {
      updateDragState({
        position: {
          top,
          left,
        },
      });
    }, 500),
    [updateDragState]
  );

  const setPositionGetter = useCallback((getter: DropForwardEventCallback) => {
    positionGetter.current = getter;
  }, []);

  return (
    <DragContext.Provider
      value={{
        ...dragState,
        setPosition,
        getPosition,
        updateDragState,
        setPositionGetter,
      }}
    >
      <StyledDiv
        isDragging={dragState.isDragging}
        onMouseLeave={() => {
          reset();
        }}
        onMouseUp={(event) => {
          if (dragState.isDragging) {
            const eventDestination = positionGetter.current(event, dragState);
            onDrop({
              uuid: dragState.uuid,
              originRow: dragState.originRow,
              destinationRow: dragState.destinationRow,
              data: dragState.data,
              eventDestination,
            });
            reset();
          }
        }}
        onMouseMove={(event) => {
          setPosition(event.clientY, event.clientX);
          if (dragState.isDragging) {
            updateDragStateThrottle(event.clientY, event.clientX);
          }
        }}
      >
        {children}
      </StyledDiv>
    </DragContext.Provider>
  );
};

export default React.forwardRef<{}, DragProviderProps>(DragProvider);
