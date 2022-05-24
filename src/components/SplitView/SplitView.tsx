import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useState,
  MouseEvent,
} from "react";
import { useResizeDetector } from "react-resize-detector";

const sum = (...values: number[]) =>
  values.reduce((partialSum, value) => partialSum + value, 0);

export interface HandleOptions {
  focusedColor: string;
  defaultColor: string;
  focusedSize: number;
  defaultSize: number;
}

export type Direction = "row" | "column";

interface HandleProperties {
  position: number;
  direction: Direction;
  options: HandleOptions;
  onMouseDown: (e: MouseEvent<HTMLElement>) => void;
}

function Handle({
  position,
  direction,
  options,
  onMouseDown,
}: HandleProperties) {
  const [focused, setFocused] = useState(false);

  const handleSize: number = focused
    ? options.focusedSize || 5
    : options.defaultSize || 1;
  const handlePosition = position - handleSize / 2;

  const color: string = focused
    ? options.focusedColor || "#0D6EFD"
    : options.defaultColor || "lightgray";

  const directionIsColumn = direction === "column";

  return (
    <div
      onMouseDown={(e) => {
        setFocused(true);
        onMouseDown(e);
      }}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        zIndex: 100,
        background: color,
        position: "absolute",
        top: directionIsColumn ? handlePosition : 0,
        left: !directionIsColumn ? handlePosition : 0,
        width: directionIsColumn ? "100%" : handleSize,
        height: !directionIsColumn ? "100%" : handleSize,
        cursor: directionIsColumn ? "row-resize" : "col-resize",
      }}
    ></div>
  );
}

class ViewOptionsUtils {
  static convertToPixels(
    measure: string | number | undefined,
    length: number
  ): string {
    const value = ViewOptionsUtils.getValue(measure);
    if (ViewOptionsUtils.getUnit(measure) === "%") {
      return `${(length * value) / 100}px`;
    } else {
      return `${value}px`;
    }
  }

  static getValue(measure: string | number | undefined): number {
    if (measure === undefined) return 0;
    measure = measure.toString();
    if (measure.endsWith("%")) return +measure.substring(0, measure.length - 1);
    else if (measure.endsWith("px"))
      return +measure.substring(0, measure.length - 2);
    else return +measure;
  }

  static getUnit(measure: string | number | undefined): string {
    if (measure === undefined) return "px";
    measure = measure.toString();
    if (measure.endsWith("%")) return "%";
    else return "px";
  }

  static getSumOfSizes(viewsOptions: ViewOptions[]): number {
    return (
      sum(
        ...viewsOptions.map((option: ViewOptions) =>
          ViewOptionsUtils.getValue(option.size)
        )
      ) || 0
    );
  }
}

interface ViewOptions {
  size?: string;
  minSize?: string;
  maxSize?: string;
}

/* eslint-disable no-unused-vars */
// for some unknown reason, this isn't detected as "being used"
enum OverflowDirection {
  LeftOrUp,
  RightOrDown,
}
/* eslint-enable no-unused-vars */

export interface SplitViewProperties {
  children: ReactNode;
  style: CSSProperties;
  direction: Direction;
  handleOptions: HandleOptions;
}

function SplitView({
  children,
  style = {},
  direction = "row",
  handleOptions = {
    focusedSize: 5,
    focusedColor: "#0D6EFD",
    defaultSize: 1,
    defaultColor: "lightgray",
  },
}: SplitViewProperties) {
  const directionIsColumn = direction === "column";

  const [selectedHandle, setSelectedHandle] = useState<number | undefined>();
  const [handlePosition, setHandlePosition] = useState<number | undefined>();
  const [viewsOptions, setViewsOptions] = useState(
    [].concat(children as any).map((node: JSX.Element) => {
      const defaultMaxSize = Infinity;
      const defaultMinSize = "0px";

      return directionIsColumn
        ? ({
            maxSize: node.props.style?.maxHeight || defaultMaxSize,
            minSize: node.props.style?.minHeight || defaultMinSize,
            size: node.props.style?.height,
          } as ViewOptions)
        : ({
            maxSize: node.props.style?.maxWidth || defaultMaxSize,
            minSize: node.props.style?.minWidth || defaultMinSize,
            size: node.props.style?.width,
          } as ViewOptions);
    })
  );

  const { ref: mainContainerRef } = useResizeDetector({
    handleHeight: directionIsColumn,
    handleWidth: !directionIsColumn,
    onResize: useCallback((width?: number, height?: number) => {
      if (width === undefined || height === undefined) return;

      viewsOptions.map((viewOptions: ViewOptions) => {
        // convert the % styles to pixels
        Object.entries(viewOptions).forEach(
          ([key, value]: [string, string | number]) => {
            Object.defineProperty(viewOptions, key, {
              value: ViewOptionsUtils.convertToPixels(
                value,
                directionIsColumn ? height! : width!
              ),
            });
          }
        );

        return viewOptions;
      });

      // distribute the remaining space evenly (should really only happen the first time)
      const used = sum(
        ...viewsOptions.map((options: ViewOptions) =>
          ViewOptionsUtils.getValue(options.size)
        )
      );
      const available = Math.max(
        0,
        (directionIsColumn ? height! : width!) - used
      );
      const undefinedSizesIndices = viewsOptions
        .map(
          (options: ViewOptions, index: number) =>
            [options, index] as [ViewOptions, number]
        )
        .filter(
          ([options]: [ViewOptions, number]) =>
            !ViewOptionsUtils.getValue(options.size)
        )
        .map(([_, index]: [ViewOptions, number]) => index);

      const averageSize = available / undefinedSizesIndices.length;
      undefinedSizesIndices.forEach((index: number) => {
        // TODO: it is possible that the 'averageSize' is lesser/greater than the min/max values of the view.
        viewsOptions[index].size = `${averageSize}px`;
      });

      // scale all values to fit within the window's size (ex. when the splitview is resized)
      const currentSize = ViewOptionsUtils.getSumOfSizes(viewsOptions);
      if (currentSize !== 0) {
        const ratio = (directionIsColumn ? height : width) / currentSize;
        viewsOptions.forEach(({ size }: ViewOptions, index: number) => {
          // TODO: it is possible that the scaled size is smaller/greater than the min/max values of the view.
          viewsOptions[index].size = `${
            ViewOptionsUtils.getValue(size) * ratio
          }px`;
        });
      }

      setViewsOptions(viewsOptions);
    }, []),
  });

  return (
    <div
      ref={mainContainerRef}
      style={{
        height: "100%",
        width: "100%",
        ...style,
        position: "relative",
      }}
      // onMouseDown is on the Handler
      onMouseMove={(e) => resizeView(e)}
      onMouseUp={() => unselectView()}
    >
      {renderView([].concat(children as any)[0], 0)}
      {[]
        .concat(children as any)
        .slice(1)
        .map((view: JSX.Element, index: number) => [
          <Handle
            key={`handle-${index}`}
            position={getPosition(index + 1, viewsOptions)}
            direction={direction}
            options={handleOptions}
            onMouseDown={(e: any) => selectHandle(e, index + 1)}
          />,
          renderView(view, index + 1),
        ])}
    </div>
  );

  function renderView(children: JSX.Element, index: number) {
    return (
      <div key={`view-${index}`} style={getViewStyle(index)}>
        {React.cloneElement(children, {
          style: {
            ...children.props.style,
            minHeight: null,
            maxHeight: null,
            minWidth: null,
            maxWidth: null,
            width: "100%",
            height: "100%",
          },
        })}
      </div>
    );
  }

  function getViewStyle(viewIndex: number): React.CSSProperties {
    const size = `${viewsOptions[viewIndex].size}`;
    const position = getPosition(viewIndex, viewsOptions);

    return {
      overflow: "auto",
      position: "absolute",
      top: directionIsColumn ? position : null,
      left: !directionIsColumn ? position : null,
      height: directionIsColumn ? size : "100%",
      width: !directionIsColumn ? size : "100%",
    } as React.CSSProperties;
  }

  function getPosition(viewIndex: number, viewsOptions: ViewOptions[]): number {
    return sum(
      ...viewsOptions
        .slice(0, viewIndex)
        .map((options: ViewOptions) => ViewOptionsUtils.getValue(options.size))
    );
  }

  function selectHandle(e: any, index: number) {
    e.preventDefault(); // prevents the dragging of the view instead of the handle
    setSelectedHandle(index);
    setHandlePosition(directionIsColumn ? e.clientY : e.clientX);
  }

  function resize(
    direction: OverflowDirection,
    viewIndex: number,
    distance: number
  ) {
    if (!(0 <= viewIndex && viewIndex < viewsOptions.length) || distance === 0)
      return 0;

    const currentSize = ViewOptionsUtils.getValue(viewsOptions[viewIndex].size);
    const desiredSize =
      currentSize +
      (direction === OverflowDirection.LeftOrUp ? -distance : +distance);

    const { maxSize, minSize } = viewsOptions[viewIndex];
    const possibleSize = Math.min(
      ViewOptionsUtils.getValue(maxSize) || Infinity,
      Math.max(ViewOptionsUtils.getValue(minSize), desiredSize)
    );

    const sizeDiff = possibleSize - desiredSize;
    let gained = possibleSize - currentSize;

    if (sizeDiff !== 0) {
      gained += resize(
        direction,
        viewIndex + (direction === OverflowDirection.LeftOrUp ? -1 : 1),
        direction === OverflowDirection.LeftOrUp ? sizeDiff : -sizeDiff
      );
    }

    viewsOptions[viewIndex].size = `${possibleSize}px`;
    return gained;
  }

  function resizeView({ clientX, clientY, currentTarget, buttons }: any) {
    if (selectedHandle === undefined || handlePosition === undefined) return;
    if (buttons !== 1) return unselectView();

    // get the mouse displacement/delta
    const mousePosition = directionIsColumn ? clientY : clientX;
    const delta = handlePosition - mousePosition;

    // get new views dimensions
    const priorTotalSize = ViewOptionsUtils.getSumOfSizes(viewsOptions);
    resize(OverflowDirection.LeftOrUp, selectedHandle - 1, delta);
    resize(OverflowDirection.RightOrDown, selectedHandle, delta);
    const posteriorTotalSize = ViewOptionsUtils.getSumOfSizes(viewsOptions);
    const totalSizeDelta = posteriorTotalSize - priorTotalSize;

    // remove the difference in container size to the "growing view" size.
    // if there is a difference, it means that all of the "shrinking views" have reached their minSize, but the "growing view" didn't stop growing. (it might be a hack)
    //  shrinking view: the view that's losing screen estate
    //  growing view: the view that's gaining screen estate
    const viewIndex = delta < 0 ? selectedHandle - 1 : selectedHandle;
    const size = ViewOptionsUtils.getValue(viewsOptions[viewIndex].size);
    viewsOptions[viewIndex].size = `${size! - totalSizeDelta}px`;

    // get new handle position
    const { top, left } = currentTarget.getBoundingClientRect();
    const parentOffset = directionIsColumn ? top : left;
    const relativeHandlePosition = getPosition(selectedHandle, viewsOptions);

    setHandlePosition(relativeHandlePosition + parentOffset);
    setViewsOptions(viewsOptions);
  }

  function unselectView() {
    setSelectedHandle(undefined);
    setHandlePosition(undefined);
  }
}

export default SplitView;
