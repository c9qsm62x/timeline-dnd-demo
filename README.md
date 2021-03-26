# Timeline Drag and Drop Demo 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

##  Brief

The timeline components give a developer enough information to roll their own drag and drop implementation over the existing Timeline component.
The purpose of this demo is to work the design system on a recipe of how project can implement their own version. 
 
##  How it works

### Drag Provider
The Drag Provider wraps the Timeline components in a element attaches Mouse events to track movements.
This also setup the context so Event and Row can notify the DragContext on the elements and row position.
The onDrop event to perform the data manipulation. 
```tsx 
<DragProvider onDrop={setState}>
  <Timeline
      range={6}
      hasSide
      startDate={new Date(2020, 3, 1)}
      today={new Date(2020, 3, 15)}
    >
    {/* Timeline components */}
</Timeline>
</DragProvider>

```

### Drag Timeline Row
The Drag Timeline Row is a drop in replacement for TimelineRow it takes all the props and an optional id and extraData props.
The id and extraData is reported back in the onDrop event. The extra data is used for any extra data that will be useful to perform the operation.
```tsx 

type DragRowProps = {
  id?: string;
  extraData?: unknown;
} & TimelineRowProps;

<DragTimelineRow name="Row 1" extraData={{}}>
  <TimelineEvents />
</DragTimelineRow>

```


### Drag Timeline Event
The Drag Timeline Event is custom Timeline Event it takes a child as a function to render the developers component. 
DragTimelineEvent use the DragContext to notify that the event is in drag mode. Extra data can also be passed to help with data manipulation.
Custom ghost components and a mouseDownDelay can be adjusted (defaults to 1000ms)
```tsx 

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
        {(active: boolean) => <div>Event 1</div>}
      </DragTimelineEvent>
    );
  }}
/>

```

### Drag Timeline 
The Drag Timeline `<DragTimeline />` component that calculates the the day selection using the Timeline context and `.timeline_inner`  element 
If the class is removed this is not possible. 
```tsx 

<DragProvider onDrop={setState}>
    <Timeline
      range={6}
      hasSide
      startDate={new Date(2020, 3, 1)}
      today={new Date(2020, 3, 15)}
    >
      <DragTimeline />
      <TimelineTodayMarker />
      <TimelineMonths />
      <TimelineWeeks />
      <TimelineDays />
      <TimelineRows>
      <TimelineRow>{}</TimelineRow>
      </TimelineRows>
      </Timeline>
</DragProvider>

```