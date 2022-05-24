# Handle Split Views like it's 2022

![downloads](https://img.shields.io/npm/dm/react-better-splitviews?style=flat-square) ![minzip size](https://badgen.net/bundlephobia/minzip/react-better-splitviews?style=flat-square) ![tree shaking](https://badgen.net/bundlephobia/tree-shaking/react-better-splitviews?style=flat-square)

### [Live demo](http://1amchris.github.io/react-better-splitviews/)

Nowadays, split views are everywhere, and yet it looked like there wasn't a great one, with an easy-to-use API, for React -- so I made one. I've fetched great inspiration from the [Visual Studio Code](https://code.visualstudio.com) split views. They're discrete, and they feel great.

🐥 Tiny <a href="https://bundlephobia.com/result?p=react-better-splitviews" target="__blank">~4kb</a>

🐼 Written in TypeScript

🦁 Use standard CSS properties to customize the SplitView and it's views

🦄 A simple, easy-to-use API, and a beautiful SplitView! No redundancy! All hail the unicorns!

## Installation

```ssh
npm i react-better-splitviews
// OR
yarn add react-better-splitviews
```

and

```jsx
import SplitView from "react-better-splitviews";
```

## Examples

There are 2 orientations you can use for your `SplitView`: `rows` or `columns`.

### 1. Rows (default orientation)

```jsx
import SplitView from "react-better-splitviews";

const CustomComponent = () => {
  return (
    <SplitView style={{ height: "500px" }}>
      <div>First View</div>
      <div>Second View</div>
      <div>Third View</div>
    </SplitView>
  );
};
```

<details><summary>With constraints</summary>

```jsx
import SplitView from "react-better-splitviews";

const CustomComponent = () => {
  return (
    <SplitView style={{ height: "500px" }}>
      {/* Width will start at 10 pixels */}
      <div style={{ width: "10px" }}>First View</div>

      {/*
        Width will start at 50% of the SplitView's 
        It can't be shrunk under 110 pixels
      */}
      <div style={{ width: "50%", minWidth: 110 }}>Second View</div>

      {/* 
        Width will take all remaining space 
        It can't be shrunk under 100 pixels
        It can't be stretched above 300 pixels
      */}
      <div style={{ minWidth: 100, maxWidth: 300 }}>Third View</div>
    </SplitView>
  );
};
```

</details>

### 2. Columns

```jsx
import SplitView from "react-better-splitviews";

const CustomComponent = () => {
  return (
    <SplitView style={{ height: "500px" }} direction="column">
      <div>First View</div>
      <div>Second View</div>
      <div>Third View</div>
    </SplitView>
  );
};
```

<details><summary>With constraints</summary>

```jsx
import SplitView from "react-better-splitviews";

const CustomComponent = () => {
  return (
    <SplitView style={{ height: "500px" }} direction="column">
      {/* Height will start at 10 pixels */}
      <div style={{ height: "10px" }}>First View</div>

      {/*
        Height will start at 50% of the SplitView's 
        It can't be shrunk under 110 pixels
      */}
      <div style={{ height: "50%", minHeight: 110 }}>Second View</div>

      {/* 
        Height will take all remaining space 
        It can't be shrunk under 100 pixels
        It can't be stretched above 300 pixels
      */}
      <div style={{ minHeight: 100, maxHeight: 300 }}>Third View</div>
    </SplitView>
  );
};
```

</details>

### 3. Combine them

Support for various combinations of Splitviews is supported. For example, this looks a bit like the [Visual Studio Code layout](https://code.visualstudio.com/api/ux-guidelines/overview).

```jsx
import SplitView from "react-better-splitviews";

const CustomComponent = () => {
  return (
    <SplitView id="vs-code__container">
      <SplitView
        id="side-bar__explorer"
        style={{ width: "25%" }}
        direction="column"
      >
        <Workspace style={{ minHeight: 24 }} />
        <Outline style={{ minHeight: 24 }} />
        <TimeLine style={{ minHeight: 24 }} />
      </SplitView>
      <SplitView
        id="editors_panel__wrapper"
        style={{ minWidth: 100 }}
        direction="column"
      >
        <SplitView id="editors" style={{ minWidth: 100 }} direction="row">
          <Editor style={{ width: 250 }} />
          <Editor style={{ minWidth: 100 }} />
          <Editor style={{ minWidth: 100 }} />
        </SplitView>
        <Panel style={{ height: "25%" }} />
      </SplitView>
    </SplitView>
  );
};
```

Please let me know if the examples above don't fit your needs.

## Contributing

While we are confident this library will work for most use cases, it is still young. We welcome any feedback, recommendations, pull requests to make it even better!

## API

### SplitViewProperties

| Prop          | Type          | Description                                                                                 | Default                             |
| ------------- | ------------- | ------------------------------------------------------------------------------------------- | ----------------------------------- |
| style         | CSSProperties | Object with CSS Properties to be applied to the SplitView                                   | `{ height: "100%", width: "100%" }` |
| direction     | Direction     | Specifies the direction of the splitview. Much like Flexboxes, it can be `row` or `column`. | `"row"`                             |
| handleOptions | HandleOptions | Specified the looks and feel of the Handle.                                                 | [see HandleOptions](#HandleOptions) |

### HandleOptions

| Prop         | Type   | Description                                                                                                  | Default       |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------ | ------------- |
| focusedColor | string | When the handle is focused (hovered, selected), this is the color it will display. Any CSS colors work here. | `"#0D6EFD"`   |
| focusedSize  | number | When the handle is focused (hovered, selected), this is the size (in pixels) it will have.                   | `5`           |
| defaultColor | string | This is the default color it will display. Any CSS colors work here.                                         | `"lightgray"` |
| defaultSize  | number | This is the default size (in pixels) it will have.                                                           | `1`           |

## License

MIT

## Sharing is caring ❤️

Show us some love and STAR ⭐ the project if you find it useful

Send us pictures of what you did the Better SplitViews library; we can't wait to see what the community we'll do with it! Cheers
