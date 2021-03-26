import React, { useRef, useState } from "react";
import "@royalnavy/css-framework/dist/styles.css";
import "@royalnavy/fonts";
import {
  Timeline,
  TimelineTodayMarker,
  TimelineMonths,
  TimelineWeeks,
  TimelineDays,
  TimelineRows,
  RowProps,
  TimelineEvents,
  TimelineEvent,
  Table,
  TableColumn,
} from "@royalnavy/react-component-library";
import logo from "./logo.svg";
import "./App.css";
import DragTimelineEvent from "./Drag/DragTimelineEvent";
import DragProvider, { onDropEvent } from "./Drag/DragContext";
import DragTimeline from "./Drag/DragTimeline";
import { DragTimelineRow } from "./Drag/DragTimelineRow";

function DemoOne() {
  const [dragState, setState] = useState<onDropEvent>();
  const data = [
    {
      state: "Before",
      id: "before",
      rowID: dragState?.originRow?.id,
      rowName: dragState?.originRow?.name,
      start: dragState?.data?.startDate.toString(),
      end: dragState?.data?.endDate.toString(),
    },
    {
      state: "After",
      id: "after",
      rowID: dragState?.destinationRow?.id,
      rowName: dragState?.destinationRow?.name,
      start: dragState?.eventDestination?.startDate.toString(),
      end: dragState?.eventDestination?.endDate.toString(),
    },
  ];
  return (
    <div>
      <DragProvider onDrop={setState}>
        <Timeline
          className="DemoOne"
          range={6}
          hasSide
          startDate={new Date(2020, 3, 1)}
          today={new Date(2020, 3, 15)}
        >
          <DragTimeline timelineClassName="DemoOne" />
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            <DragTimelineRow name="Row 1" extraData={{}}>
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 6)}
                  endDate={new Date(2020, 3, 10)}
                  render={(
                    startDate: Date,
                    endDate: Date,
                    widthPx: string,
                    offsetPx: string
                  ) => {
                    return (
                      <DragTimelineEvent
                        timelineProps={{
                          startDate,
                          endDate,
                          widthPx,
                          offsetPx,
                        }}
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "black",
                          color: "white",
                        }}
                      >
                        {(active) => <div>Event 1</div>}
                      </DragTimelineEvent>
                    );
                  }}
                />

                <TimelineEvent
                  startDate={new Date(2020, 3, 16)}
                  endDate={new Date(2020, 3, 20)}
                  render={(
                    startDate: Date,
                    endDate: Date,
                    widthPx: string,
                    offsetPx: string
                  ) => {
                    return (
                      <DragTimelineEvent
                        timelineProps={{
                          startDate,
                          endDate,
                          widthPx,
                          offsetPx,
                        }}
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "black",
                          color: "white",
                        }}
                      >
                        {(active) => <div>Event 2</div>}
                      </DragTimelineEvent>
                    );
                  }}
                />
              </TimelineEvents>
            </DragTimelineRow>
            <DragTimelineRow name="Row 2">
              <TimelineEvents>
                <TimelineEvent
                  startDate={new Date(2020, 3, 15)}
                  endDate={new Date(2020, 3, 19)}
                  render={(
                    startDate: Date,
                    endDate: Date,
                    widthPx: string,
                    offsetPx: string
                  ) => {
                    return (
                      <DragTimelineEvent
                        timelineProps={{
                          startDate,
                          endDate,
                          widthPx,
                          offsetPx,
                        }}
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "black",
                          color: "white",
                        }}
                      >
                        {(active) => <div>Event 3</div>}
                      </DragTimelineEvent>
                    );
                  }}
                />

                <TimelineEvent
                  startDate={new Date(2020, 3, 22)}
                  endDate={new Date(2020, 3, 24)}
                  render={(
                    startDate: Date,
                    endDate: Date,
                    widthPx: string,
                    offsetPx: string
                  ) => {
                    return (
                      <DragTimelineEvent
                        timelineProps={{
                          startDate,
                          endDate,
                          widthPx,
                          offsetPx,
                        }}
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "black",
                          color: "white",
                        }}
                      >
                        {(active) => <div>Event 4</div>}
                      </DragTimelineEvent>
                    );
                  }}
                />
              </TimelineEvents>
            </DragTimelineRow>
            <DragTimelineRow name="Row 3">{}</DragTimelineRow>
          </TimelineRows>
        </Timeline>
      </DragProvider>
      <Table data={data as RowProps[]}>
        <TableColumn field="state">State</TableColumn>
        <TableColumn field="rowName">Row Name</TableColumn>
        <TableColumn field="start">Start</TableColumn>
        <TableColumn field="end">End</TableColumn>
      </Table>
    </div>
  );
}

export default DemoOne;
