import React, { useContext, useEffect, useRef } from "react";
import { useDrag } from "./DragContext";
import styled from "styled-components";
import { TimelineContext } from "@royalnavy/react-component-library";
import { addDays, differenceInMilliseconds, lightFormat } from "date-fns";
import { addMilliseconds } from "date-fns";

const GhostWrapper = styled.div`
  user-select: none;
  pointer-events: none;
  will-change: all;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0.5;
  z-index: 10000;
`;
const DragTimeline: React.FC<{ timelineClassName?: string }> = ({
  timelineClassName = "",
}) => {
  const {
    GhostComponent,
    isDragging,
    getPosition,
    position,
    data,
    setPositionGetter,
  } = useDrag();
  const {
    state: { currentScaleOption },
  } = useContext(TimelineContext);

  const ghostRef = useRef<HTMLDivElement>(null);

  const timelineInner = useRef<{
    element: HTMLDivElement | null;
    rect: DOMRect | null;
  }>({ element: null, rect: null });

  const calculateDate = (day: number, startDate: Date, endDate: Date) => {
    const newStart = addDays(currentScaleOption.from, day);
    return {
      startDate: newStart,
      endDate: addMilliseconds(
        newStart,
        differenceInMilliseconds(endDate, startDate)
      ),
    };
  };

  useEffect(() => {
    timelineInner.current.element = document.querySelector(
      `.${timelineClassName} .timeline__inner`
    );
    timelineInner.current.rect =
      timelineInner.current.element?.getBoundingClientRect() || null;

    setPositionGetter((event, snapshotDragState) => {
      timelineInner.current.rect =
        timelineInner.current.element?.getBoundingClientRect() || null;
      console.log(timelineInner.current.element?.scrollLeft);
      const relativeX =
        event.clientX -
        timelineInner.current.rect!.x +
        (timelineInner.current.element?.scrollLeft || 0);
      const dayInYear = Math.floor(relativeX / currentScaleOption.widths.day);

      return calculateDate(
        dayInYear,
        snapshotDragState.data!.startDate,
        snapshotDragState.data!.endDate
      );
    });
  }, [currentScaleOption.widths.day]);

  //Start polling position and set the transform directly
  React.useLayoutEffect(() => {
    let run = isDragging;
    const raf = () => {
      if (GhostComponent && ghostRef.current) {
        const pos = getPosition();
        ghostRef.current.style.transform = `translate(${pos.left}px, ${pos.top}px)`;
        window.requestAnimationFrame(raf);
      }
    };
    const startRaf = () => {
      if (run) {
        window.requestAnimationFrame(raf);
      }
      return () => {
        run = false;
      };
    };
    return startRaf();
  }, [GhostComponent, isDragging, ghostRef]);

  if (!GhostComponent) {
    return null;
  }
  let text = "";
  if (position && isDragging) {
    const relativeX =
      position.left -
      timelineInner.current.rect!.x +
      (timelineInner.current.element?.scrollLeft || 0);
    const dayInYear = Math.floor(relativeX / currentScaleOption.widths.day);
    const destinationDate = calculateDate(
      dayInYear,
      data!.startDate,
      data!.endDate
    );
    text = `${lightFormat(
      destinationDate.startDate,
      "dd-MM-yyyy"
    )}  -  ${lightFormat(destinationDate.endDate, "dd-MM-yyyy")}`;
  }
  return (
    <GhostWrapper ref={ghostRef}>
      <GhostComponent text={text} />
    </GhostWrapper>
  );
};

export default DragTimeline;
