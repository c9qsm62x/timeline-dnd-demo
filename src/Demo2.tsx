import React, { useLayoutEffect, useRef, useState } from "react";
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
  Tab,
  TabSet,
} from "@royalnavy/react-component-library";
import logo from "./logo.svg";
import "./App.css";
import DragTimelineEvent from "./Drag/DragTimelineEvent";
import DragProvider, { onDropEvent } from "./Drag/DragContext";
import DragTimeline from "./Drag/DragTimeline";
import { DragTimelineRow } from "./Drag/DragTimelineRow";
import apiData from "./data.json";
import { findIndex } from "lodash";

function DemoTwo() {
  const [dragState, setState] = useState<onDropEvent>();
  const [dataState, setData] = useState<typeof apiData>(apiData);
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

  const onDrop = (dragState: onDropEvent) => {
    setState(dragState);
    setData((oldState) => {
      if (dragState.destinationRow) {
        const prevDate = [...oldState];
        const beforeRowIndex = prevDate.findIndex(
          (row) => row.id === dragState?.originRow?.id
        );
        const beforeDataIndex = prevDate[beforeRowIndex].data.findIndex(
          (event) => event.id === dragState.uuid
        );

        const afterRowIndex = prevDate.findIndex(
          (row) => row.id === dragState?.destinationRow?.id
        );

        const movingData = prevDate[beforeRowIndex].data[beforeDataIndex];

        prevDate[beforeRowIndex] = {
          ...prevDate[beforeRowIndex],
          data: [
            ...prevDate[beforeRowIndex].data.slice(0, beforeDataIndex),
            ...prevDate[beforeRowIndex].data.slice(beforeDataIndex + 1),
          ],
        };

        prevDate[afterRowIndex] = {
          ...prevDate[afterRowIndex],
          data: [
            ...prevDate[afterRowIndex].data,
            {
              ...movingData,
              startDate: dragState.eventDestination.startDate.toISOString(),
              endDate: dragState.eventDestination.endDate.toISOString(),
            },
          ],
        };
        return [...prevDate];
      }
      return oldState;
    });
  };

  return (
    <div>
      <DragProvider onDrop={onDrop}>
        <Timeline
          range={6}
          hasSide
          startDate={new Date(2020, 0, 1)}
          className="DemoTwo"
        >
          <DragTimeline timelineClassName="DemoTwo" />
          <TimelineTodayMarker />
          <TimelineMonths />
          <TimelineWeeks />
          <TimelineDays />
          <TimelineRows>
            {dataState.map((dataRow) => {
              return (
                <DragTimelineRow
                  key={dataRow.id}
                  name={dataRow.firstName}
                  id={dataRow.id}
                  extraData={{}}
                >
                  <TimelineEvents>
                    {dataRow.data.map((event, i) => (
                      <TimelineEvent
                        key={event.id}
                        startDate={new Date(event.startDate)}
                        endDate={new Date(event.endDate)}
                        render={(
                          startDate: Date,
                          endDate: Date,
                          widthPx: string,
                          offsetPx: string
                        ) => {
                          return (
                            <DragTimelineEvent
                              id={event.id}
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
                              {(active) => <div>{event.eventName}</div>}
                            </DragTimelineEvent>
                          );
                        }}
                      />
                    ))}
                  </TimelineEvents>
                </DragTimelineRow>
              );
            })}
          </TimelineRows>
        </Timeline>
      </DragProvider>
      <Table data={data as RowProps[]}>
        <TableColumn field="state">Sate</TableColumn>
        <TableColumn field="rowName">Row Name</TableColumn>
        <TableColumn field="start">Start</TableColumn>
        <TableColumn field="end">End</TableColumn>
      </Table>
    </div>
  );
}

export default DemoTwo;
