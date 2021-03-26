import React, { useContext, useRef, useMemo } from "react";
import {
  TimelineContext,
  TimelineRow,
  TimelineRowProps,
  useTimelinePosition,
} from "@royalnavy/react-component-library";
import { v4 as uuid } from "uuid";
import { Row, useDrag } from "./DragContext";
import styled from "styled-components";

type DragRowProps = {
  id?: string;

  extraData?: unknown;
} & TimelineRowProps;

const DragRowContext = React.createContext<Row>({ id: "" });

export const useDragRow = () => {
  return useContext(DragRowContext);
};

export const DragTimelineRow = ({ id, extraData, ...rest }: DragRowProps) => {
  const {
    state: { currentScaleOption, days },
  } = useContext(TimelineContext);
  const { isDragging, updateDragState, destinationRow } = useDrag();
  const uuidRef = useRef(id);
  const getUUID = (): string => {
    if (!uuidRef.current) {
      uuidRef.current = uuid();
    }
    return uuidRef.current;
  };

  const width = `${currentScaleOption.widths.day * days.length}px`;
  const active = getUUID() === destinationRow?.id;
  return useMemo(() => {
    const destinationRow = { id: getUUID(), extraData, name: rest.name };
    return (
      <DragRowContext.Provider value={destinationRow}>
        <div
          style={{ width }}
          onMouseLeave={() => {
            updateDragState({
              destinationRow: void 0,
            });
          }}
          onMouseOver={() => {
            if (isDragging) {
              updateDragState({
                destinationRow,
              });
            }
          }}
        >
          <TimelineRow
            {...rest}
            contentProps={{
              css: { background: active ? "yellow" : "transparent" },
            }}
          />
        </div>
      </DragRowContext.Provider>
    );
  }, [isDragging, updateDragState, active]);
};
