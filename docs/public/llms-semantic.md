# Antdv Next Component Semantic Descriptions

This document contains semantic DOM descriptions for Antdv Next components.

> Total 63 components with semantic descriptions

## Component List

### alert

- `root`: Root element with border, background, padding, border-radius, and positioning styles for the alert container
- `icon`: Icon element with color, line-height, and margin styles, supporting different status icon types
- `section`: Content element with flex layout controlling content area typography and minimum width
- `title`: Title element with text color and font styling for the alert title
- `description`: Description element with font-size and line-height styles for additional content
- `actions`: Actions element with layout and spacing styles for action buttons
- `close`: Close button element with basic button styling

### anchor

- `root`: Root element with layout positioning, padding, margin, background color and other basic styles
- `item`: Link item element with padding, text color, hover states, transition animations and other styles
- `itemTitle`: Title text element with font styles, color changes, text decoration, transition effects and other styles
- `indicator`: Indicator element with width, height, background color, position changes, transition animations and other styles

### autoComplete

- `root`: Root element with relative positioning, inline-flex layout, cursor styles, transitions, border and other basic selector container styles
- `prefix`: Prefix element with layout and styling for prefix content
- `input`: Input element with search input styling, cursor control, font inheritance and other search-related styles. Remove border styles
- `placeholder`: Placeholder element with font styles and colors for placeholder text
- `content`: Multiple selection container with layout, spacing, and wrapping styles for selected items
- `clear`: Clear button element with layout, styling and interactive effects for clear button
- `popup`:
  - `root`: Popup element with popup layer positioning, z-index, background, border, box-shadow and other popup container styles
  - `list`: Popup list element with option list layout, scrolling, max-height and other list container styles
  - `listItem`: Popup item element with option item padding, hover effects, selected states, disabled states and other option interactive styles

### badge

- `root`: Root element with relative positioning, inline-block display, and fit-content width for basic layout
- `indicator`: Indicator element with positioning, z-index, dimensions, colors, fonts, text alignment, background, border-radius, box-shadow, and transition animations for complete badge styling

### breadcrumb

- `root`: Root element with text color, font size, icon size and other basic styles, using flex layout with ordered list
- `item`: Item element with text color, link color transitions, hover effects, padding, border-radius, height, and margin styles
- `separator`: Separator element with margin and color styles for the divider

### button

- `root`: Root element with comprehensive button styling including border, background, padding, border-radius, box-shadow, transitions, cursor, font-weight, alignment, and layout properties
- `icon`: Icon element with font-size, color inheritance, and SVG style reset for proper icon display
- `content`: Content element that wraps button text with typography styles including nowrap, text-align center, and Chinese character spacing optimization

### calendar

- `root`: Root element containing background, border, border-radius and overall layout structure of the calendar component
- `header`: Header element with layout and style control for year selector, month selector and mode switcher
- `body`: Body element with padding and layout control for the calendar table that contains the calendar grid
- `content`: Content element with width, height and table styling control for the calendar table
- `item`: Item element with background, border, hover state, selected state and other interactive styles for calendar cells

### card

- `root`: Card root element with positioning, background, border, border-radius, box-shadow, padding and other container styles
- `header`: Card header area with flex layout, min-height, padding, text color, font-weight, font-size, background, bottom border and top border-radius
- `title`: Card title with inline-block display, flex-grow, text ellipsis and other title display styles
- `extra`: Card extra operation area in top-right corner with text color and layout styles for additional content
- `cover`: Title cover with styles for cover image display and layout
- `body`: Card content area with padding, font-size and other content display styles
- `actions`: Card bottom action group with flex layout, list-style reset, background, top border and bottom border-radius for action buttons container

### cascader

- `root`: Root element, set inline flex layout, relative positioning, padding and border styles
- `prefix`: Prefix element with layout and styling for prefix content
- `selector`: Selector element, set padding, flex layout and selected item display styles
- `suffix`: Suffix element with layout and styling for suffix content like arrow icon, etc.
- `popup`: Popup element, set absolute positioning, z-index, background color, border radius, shadow and dropdown options styles
- `item`: Option element, set padding, background color, hover state and selected state styles

### checkbox

- `root`: Root element with inline-flex layout, baseline alignment, cursor style, reset styles and other basic checkbox container styles
- `icon`: Checkbox icon element with size, direction, background, border, border-radius, transitions, and checked state checkmark styles
- `label`: Label text element with padding and spacing styles relative to the checkbox

### collapse

- `root`: Root element with border, border-radius, background color and container styles that control the overall layout and appearance of collapse panels
- `header`: Header element with flex layout, padding, color, line-height, cursor style, transition animations and other interactive styles for panel headers
- `icon`: Icon element with font size, transition animations, rotation transforms and other styles and animations for expand/collapse arrows
- `title`: Title element with flex auto layout and margin styles for title text layout and typography
- `body`: Body element with padding, color, background color and other styles for panel content area display

### colorPicker

- `root`: Trigger container with border styles, transition animations, size controls, displaying color block and text content
- `body`: Color block container with background color, border styles
- `content`: Color block element with actual selected color styles
- `description`: Description text content with font styles and color
- `popup`:
  - `root`: Popup panel root container with background color, shadow effects, color selection panel, slider controls and preset colors

### datePicker

- `root`: Root element with relative positioning, inline-flex layout, padding, border-radius, transition animations and other basic styles for date picker container
- `prefix`: Prefix element with flex layout and margin styles for prefix content layout
- `input`: Input element with relative positioning, width, color, font, line-height, transition animations and other core interactive styles for input field
- `suffix`: Suffix element with flex layout, color, line-height, pointer events, transition animations and other styles for suffix content
- `popup`:
  - `root`: Popup element
  - `container`: Container element, set background color, padding, border radius, shadow, border and content display styles
  - `header`: Popup header element with navigation buttons, month/year selectors and other header control area layout and styles
  - `body`: Popup body element with container layout and styles for date panel table
  - `content`: Popup content element with width, border, cell and other content display styles for date table
  - `item`: Popup item element with size, background, border-radius, hover state, selected state and other interactive styles for date cells
  - `footer`: Popup footer element with layout styles for bottom operation area including confirm/cancel buttons and shortcuts

### descriptions

- `root`: Root element with basic styles, reset styles, border styles, layout direction and other overall styles for description list container
- `header`: Header element with flex layout, alignment, bottom margin and other layout and style controls for header area
- `title`: Title element with text ellipsis, flex ratio, color, font weight, font size, line height and other title text styles
- `extra`: Extra content element with left margin, color, font size and other styles for additional operation area
- `label`: Label element with color, font weight, font size, line height, text align, colon styles and other label text styles
- `content`: Content element with table cell layout, color, font size, line height, word break and other content display styles

### divider

- `root`: Root element with border-top style, divider styling and other basic divider container styles
- `rail`: Background rail element with border-top style and other divider connection line styles
- `content`: Content element with inline-block display, padding and other divider text content styles

### drawer

- `root`: Root element with fixed positioning, z-index control, pointer events, color and other basic styles and layout control for drawer container
- `mask`: Mask element with absolute positioning, z-index, background color, pointer events and other mask layer styles and interaction controls
- `section`: Drawer container element with flex layout, width/height, overflow control, background color, pointer events and other drawer body styles
- `header`: Header element with flex layout, alignment, padding, font size, line height, bottom border and other header area styles
- `title`: Title element with flex ratio, margin, font weight, font size, line height and other title text styles
- `extra`: Extra element with flex fixed layout and other additional operation content style controls
- `body`: Body element with flex ratio, minimum size, padding, overflow scroll and other content area display and layout styles
- `footer`: Footer element with flex shrink, padding, top border and other bottom operation area styles
- `dragger`: Dragger element used to resize the drawer, with absolute positioning, transparent background, pointer events control, hover state styles, and dragging state styles
- `close`: Close button element with basic button styling

### dropdown

- `root`: Root element of dropdown, sets positioning, z-index and container styles
- `itemTitle`: Title content area of dropdown option, sets layout and text styles
- `item`: Individual dropdown option element, sets interaction states and background styles
- `itemContent`: Main content area of dropdown option, sets content layout and link styles
- `itemIcon`: Icon area of dropdown option, sets icon size and spacing styles

### empty

- `root`: Root element, sets text alignment, font and line height styles
- `image`: Image element, sets height, opacity, margin and image styles
- `description`: Description element, sets text color styles
- `footer`: Footer element, sets top margin and action button styles

### floatButton

- `root`: Root element with float button base styles, shape size, type theme, fixed positioning, z-index, shadow, spacing and other container styles
- `icon`: Icon element with button icon size, color, line height, alignment and other icon display styles
- `content`: Content element with button text content font size, color, alignment, line wrap and other text display styles

### floatButtonGroup

- `root`: Root element with float button group container styles, fixed positioning, z-index, padding, gap, direction mode and other combined layout styles
- `list`: List element with button group list flex layout, border radius, shadow, animation transition, vertical alignment and other list container styles
- `item`: Item element with individual float button styles, size, shape, type, state, icon content and other button base styles
- `itemIcon`: Item icon element with float button icon size, color, alignment and other icon display styles
- `itemContent`: Item content element with float button text content, badge, description and other content area styles
- `trigger`: Trigger element with menu mode trigger button styles, shape, icon, hover state, expand/collapse state and other interaction styles
- `triggerIcon`: Trigger icon element with trigger button icon styles, rotation animation, toggle state and other icon interaction styles
- `triggerContent`: Trigger content element with trigger button content area text, identifier, state indicator and other content styles

### form

- `root`: Root element with form item margin-bottom, vertical-align, transitions, hidden states, error/warning states and other basic form item container styles
- `label`: Label element with flex layout, overflow hidden, whitespace nowrap, text alignment, vertical alignment, plus label color, font size, height, required marks and other label display styles
- `content`: Content element with form content area layout, styling and control container related styles

### image

- `root`: Root element, sets relative positioning and inline-block layout styles
- `image`: Image element, sets width, height and vertical alignment styles
- `cover`: Image hover display prompt element, sets absolute positioning, background color, opacity and transition animation styles
- `popup`:
  - `root`: Preview root element, sets fixed positioning, z-index and background mask styles
  - `mask`: Preview mask element, sets absolute positioning and semi-transparent background styles
  - `body`: Preview body element, sets flex layout, center alignment and pointer event styles
  - `footer`: Preview footer element, sets absolute positioning, center layout and bottom operation area styles
  - `actions`: Preview actions group element, sets flex layout, background color, border radius and action button styles

### input

- `root`: Root element with relative positioning, inline-block display, width, min-width, padding, colors, fonts, line-height, border-radius, transitions and other input container basic styles
- `prefix`: Prefix wrapper element with layout and styling for prefix content
- `input`: Input element with core interactive styles and text input related styling
- `suffix`: Suffix wrapper element with layout and styling for suffix content
- `count`: Character count element with font and color styles for count display

### input:-otp

- `root`: Root element with relative positioning, inline-block display, width, min-width, padding, colors, fonts, line-height, border-radius, transitions and other input container basic styles
- `input`: Input element with core interactive styles and text input related styling
- `separator`: Separator element, set separator display styles between OTP input boxes

### input:-password

- `root`: Root element with relative positioning, inline-block display, width, min-width, padding, colors, fonts, line-height, border-radius, transitions and other input container basic styles
- `prefix`: Prefix wrapper element with layout and styling for prefix content
- `input`: Input element with core interactive styles and text input related styling
- `suffix`: Suffix wrapper element with layout and styling for suffix content
- `count`: Character count element with font and color styles for count display

### input:-search

- `root`: Root element with relative positioning, inline-block display, width, min-width, padding, colors, fonts, line-height, border-radius, transitions and other input container basic styles
- `prefix`: Prefix wrapper element with layout and styling for prefix content
- `input`: Input element with core interactive styles and text input related styling
- `suffix`: Suffix wrapper element with layout and styling for suffix content
- `count`: Character count element with font and color styles for count display
- `button`:
  - `root`: Search button root element with button styles, hover effects and click interactions
  - `icon`: Search button icon element with icon styles, hover effects and click interactions
  - `content`: Search button content element with text styles, hover effects and click interactions

### input:-textarea

- `root`: Root element with textarea wrapper styles, border, border radius, transition animation and state control
- `textarea`: Textarea element with font, line height, padding, color, background, border, text input and multi-line text display styles
- `count`: Count element with character count display position, font, color and numeric statistics styles

### inputNumber

- `root`: Root element, sets inline-block layout, width, border radius and reset styles
- `prefix`: Prefix wrapper element, sets flex layout, alignment and right margin styles
- `input`: Input element, sets font, line height, text input and interaction styles
- `suffix`: Suffix wrapper element, sets flex layout, margin and transition animation styles
- `actions`: Actions element, sets absolute positioning, width, flex layout and number adjustment button styles
- `action`: Single action button element, sets button styling, hover effects and click interactions

### masonry

- `root`: Root element, sets relative positioning, flex layout and masonry container styles
- `item`: Item element, sets absolute positioning, width calculation, transition animation and masonry item styles

### mentions

- `root`: Root element, set inline flex layout, relative positioning, padding and border styles
- `textarea`: Textarea element, set font, line height, text input and background styles
- `suffix`: Suffix element with layout and styling for suffix content like clear button, etc.
- `popup`: Popup element, set absolute positioning, z-index, background color, border radius, shadow and dropdown options styles

### menu

- `root`: Root element with basic menu container styles and layout
- `item`: Item element with relative positioning, block display, margins, whitespace handling, cursor styles, transitions and other basic interactive styles for menu items
- `itemIcon`: Icon element with min-width, font-size, transitions, icon reset styles, and spacing control with text
- `itemContent`: Item content element with layout and typography styles for menu item content
- `subMenu`:
  - `itemTitle`: Submenu title element with submenu title styles and interactive effects
  - `list`: Submenu list element with submenu list layout and container styles
  - `item`: Submenu item element with submenu item styles and interactive effects
  - `itemIcon`: Submenu item icon element with submenu icon size and styles
  - `itemContent`: Submenu item content element with submenu content layout and typography
- `itemTitle`: Item title element (no effect in horizontal mode) with title text styles and layout
- `list`: Menu list element (no effect in horizontal mode) with menu list layout and container styles
- `popup`: Popup menu element (no effect in inline mode) with popup layer positioning, z-index, background and other styles

### message

- `root`: Root element, set fixed positioning, z-index, padding, background color, border radius, shadow and animation styles
- `icon`: Icon element, set font size, right margin and status color styles
- `content`: Content element, set inline block layout, text color and content display styles

### modal

- `root`: Root element with relative positioning, top position, width, max-width, margins, bottom padding and other basic layout styles for modal container
- `mask`: Mask element with fixed positioning, z-index, background color, animation transitions and other mask layer styles
- `container`: Modal container element with relative positioning, background, background-clip, border, border-radius, box-shadow, pointer-events, padding and other modal body styles
- `wrapper`: Wrapper element used for motion container with animation and transition effect styles
- `header`: Header element with padding, bottom border and other header area styles
- `title`: Title element with margin, color, font-weight, font-size, line-height, word-wrap and other title text styles
- `body`: Body element with content area background color, padding and other content display styles
- `footer`: Footer element with footer background color, padding, top border, border-radius and other footer area styles

### notification

- `root`: Root element, set fixed positioning, z-index, padding, background color, border radius, shadow and animation styles
- `icon`: Icon element, set absolute positioning, font size, line height and status color styles
- `title`: Title element, set color, font size, line height and margin styles
- `description`: Description element, set font size, color and margin styles
- `actions`: Actions element, set float right, top margin and action button layout styles

### pagination

- `root`: Root element, set flex layout, alignment, flex wrap and list styles
- `item`: Item element, set size, padding, border, background color, hover state and active state styles

### popconfirm

- `root`: Root element, set absolute positioning, z-index, transform origin, arrow direction and popover container styles
- `container`: Container element, set background color, padding, border radius, shadow, border and content display styles
- `title`: Title element, set title text styles and spacing
- `content`: Description element, set content text styles and layout
- `arrow`: Arrow element with width, height, position, color and border styles

### popover

- `root`: Root element, set absolute positioning, z-index, transform origin, arrow direction and popover container styles
- `container`: Container element, set background color, padding, border radius, shadow, border and content display styles
- `title`: Title element, set title text styles and spacing
- `content`: Content element, set content text styles and layout
- `arrow`: Arrow element with width, height, position, color and border styles

### progress

- `root`: Root element, set relative positioning and basic container styles
- `body`: Body element, set progress bar layout and size styles
- `rail`: Rail element, set background track color and border radius styles. Not exist in steps mode
- `track`: Track element, set progress fill color and transition animation styles
- `indicator`: Indicator element, set percentage text or icon position and font styles

### qrCode

- `root`: Root element, set flex layout, padding, background color, border, border radius and relative positioning styles
- `cover`: Cover element, set absolute positioning, z-index, background color and loading state overlay styles

### radio

- `root`: Root element with layout styles, cursor styles, disabled text color and other basic container styles
- `icon`: Icon element with border radius, transition animations, border styles, hover states, focus states and other interactive styles
- `label`: Label element with padding, text color, disabled states, alignment and other text styles

### result

- `root`: Root element with text alignment, layout styles and other basic container styles
- `icon`: Icon element with margin, text alignment, font size, status colors and other icon styles
- `title`: Title element with font size, text color, line height, text alignment and other text styles
- `subTitle`: Subtitle element with font size, text color, line height and other text styles
- `extra`: Action area element with margin, text alignment, inner element spacing and other layout styles
- `body`: Content element with margin, padding, background color and other content area styles

### ribbon

- `root`: Root element, set relative positioning and wrapper container styles
- `indicator`: Indicator element, set absolute positioning, padding, background color, border radius and ribbon styles
- `content`: Content element, set text color and ribbon content display styles

### segmented

- `root`: Root element with inline-block layout, padding, background, border radius, transition and container styles
- `item`: Option element with relative positioning, text alignment, cursor style, transition, selected state background and hover styles
- `label`: Label content element with min height, line height, padding, text ellipsis and content layout styles
- `icon`: Icon element with icon size, color and text spacing styles

### select

- `root`: Root element with relative positioning, inline-flex layout, cursor styles, transitions, border and other basic selector container styles
- `prefix`: Prefix element with layout and styling for prefix content
- `content`: Multiple selection container with layout, spacing, and wrapping styles for selected items
- `placeholder`: Placeholder element with font styles and colors for placeholder text
- `clear`: Clear button element with layout, styling and interactive effects for clear button
- `input`: Input element with search input styling, cursor control, font inheritance and other search-related styles. Remove border styles
- `suffix`: Suffix element with layout and styling for suffix content like clear button, arrow icon, etc.
- `popup`:
  - `root`: Popup element with popup layer positioning, z-index, background, border, box-shadow and other popup container styles
  - `list`: Popup list element with option list layout, scrolling, max-height and other list container styles
  - `listItem`: Popup item element with option item padding, hover effects, selected states, disabled states and other option interactive styles
- `item`: Multiple selection item element with border, background, padding, and margin styles
- `itemContent`: Multiple selection item content area with text ellipsis styles
- `itemRemove`: Multiple selection item remove button with font-related styless

### skeleton

- `root`: Root element with table display, width, animation effects, border radius and other skeleton container basic styles
- `header`: Header element with table cell, padding, vertical alignment and other avatar placeholder area layout styles
- `section`: Section element with skeleton content area layout styles
- `avatar`: Avatar element with inline-block display, vertical alignment, background color, size, border radius and other avatar placeholder styles
- `title`: Title element with width, height, background color, border radius and other title placeholder styles
- `paragraph`: Paragraph element with padding, list item styles, background color, border radius and other paragraph placeholder styles

### slider

- `root`: Root element with relative positioning, height, margin, padding, cursor style and touch action control
- `track`: Track selection bar element with absolute positioning, background color, border radius and transition animation styles
- `tracks`: Multi-segment track container element with absolute positioning and transition animation styles
- `rail`: Background rail element with absolute positioning, background color, border radius and transition animation styles
- `handle`: Slider handle control element with absolute positioning, size, outline, user selection, background color, border shadow, border radius, cursor style and transition animation

### space

- `root`: Root element with flex layout, gap settings, alignment, wrap and other spacing container basic styles
- `item`: Wrapped item element with spacing item layout and styles, providing wrapper for each child element for inline alignment
- `separator`: Separator element with divider styling

### spin

- `root`: Root element with absolute positioning, display control, color, font size, text alignment, vertical alignment, opacity and transition animation (effective when fullscreen is false)
- `indicator`: Indicator element with width, height, font size, inline-block display, transition animation, transform origin, line height and color

### splitter

- `root`: Root element with flex layout, width and height, alignment and stretch styles
- `panel`: Panel element with flex basis, grow ratio and panel container styles
- `dragger`: Drag control element with absolute positioning, user selection, z-index, center alignment, background color, hover and active states styles

### statistic

- `root`: Root element with reset styles and overall container styles for statistic component
- `header`: Header element with bottom padding and title area layout styles
- `title`: Title element with text color, font size and other title text display styles
- `prefix`: Prefix element with inline-block display, right margin and other prefix content layout styles
- `content`: Content element with text color, font size, font family and other numeric content display styles
- `suffix`: Suffix element with inline-block display, left margin and other suffix content layout styles

### steps

- `root`: Root element with flex layout, nowrap, alignment, CSS variables and other basic step container styles
- `item`: Step item element with flex layout, relative positioning and other basic step item container styles
- `itemWrapper`: Step item wrapper element with flex layout, nowrap, top padding and other step content wrapping styles
- `itemIcon`: Step item icon element with icon size, positioning, font-size and other icon display related styles
- `itemHeader`: Step item header element with flex layout, nowrap, alignment and other header area layout styles
- `itemTitle`: Step item title element with color, font-size, line-height, word-break, transitions and other title text styles
- `itemSubtitle`: Step item subtitle element with color, font-weight, font-size, line-height, margin, word-break and other subtitle styles
- `itemSection`: Step item section element with step content area layout and styling
- `itemContent`: Step item content element with color, font-size, line-height, word-break, transitions and other content text styles
- `itemRail`: Step item rail element with border-style, border-width, transitions and other connecting line styles

### switch

- `root`: Root element with min-width, height, line-height, vertical alignment, background color, border, border radius, cursor style, transition animations, user selection and other basic switch container styles
- `content`: Content element with block display, overflow hidden, border radius, height, padding, transition animations and other switch content area layout and styles
- `indicator`: Indicator element with absolute positioning, width, height, background color, border radius, shadow, transition animations and other switch handle styles and interactive effects

### table

- `root`: Root element with font-size, background, border-radius, scrollbar-color and other basic table container styles
- `title`: Title element with table title styling and layout
- `content`: Content element with table content area styling and layout
- `header`:
  - `wrapper`: Header wrapper element with table header layout and container styles
  - `row`: Header row element with table header row layout and styling
  - `cell`: Header cell element with relative positioning, padding, word-wrap, background, text color, font-weight and other header cell styles
- `section`: Container element with clear-fix, max-width, scrollbar background and other table wrapper styles
- `body`:
  - `wrapper`: Body wrapper element with table body layout and container styles
  - `row`: Body row element with hover effects, selected states, expanded states and other interactive row styles
  - `cell`: Body cell element with relative positioning, padding, word-wrap and other basic data cell styles
- `footer`: Footer element with table footer background color, text color and other footer styles
- `pagination`:
  - `root`: Pagination root element with pagination component basic styles and layout
  - `item`: Pagination item element with pagination item styling and interactive effects

### tabs

- `root`: Root element with basic tab container styles, layout and direction control
- `header`: Header element with tab navigation header layout, background, borders and other styles
- `item`: Item element with relative positioning, padding, colors, text ellipsis, border-radius, transitions and other tab item styles and interactive effects
- `indicator`: Indicator element with indicator bar color, position, dimensions, transitions and other active state indication styles
- `content`: Content element with tab content panel layout, padding and other content display styles
- `popup`:
  - `root`: Popup menu element with dropdown absolute positioning, z-index, display control, max-height, scrolling and other styles

### tag

- `root`: Root element with inline-block display, auto height, padding, font size, line height, nowrap, background color, border, border radius, opacity, transition animations, text alignment, relative positioning and other basic tag styles
- `icon`: Icon element with font size, color, cursor style, transition animations and other icon display styles
- `content`: Content element with text content color, font styles and other content area styles

### timePicker

- `root`: Root element with relative positioning, inline-flex layout, padding, border-radius, transition animations and other basic styles for time picker container
- `prefix`: Prefix element with flex layout and margin styles for prefix content layout
- `input`: Input element with relative positioning, width, color, font, line-height, transition animations and other core interactive styles for input field
- `suffix`: Suffix element with flex layout, color, line-height, pointer events, transition animations and other styles for suffix content
- `popup`:
  - `root`: Popup element
  - `container`: Container element, set background color, padding, border radius, shadow, border and content display styles
  - `content`: Popup content element with width, border, cell and other content display styles for time list
  - `item`: Popup item element with size, background, border-radius, hover state, selected state and other interactive styles for time cells
  - `footer`: Popup footer element with layout styles for bottom operation area including confirm/cancel buttons

### timeline

- `root`: Root element with timeline container list style reset, vertical layout, dot icon, outlined style, alternate layout and other basic container styles
- `item`: Item element with single timeline node relative positioning, margin, padding, font size, finish state, color theme, layout direction and other node basic styles
- `itemWrapper`: Item wrapper element with timeline node content wrapping container styles
- `itemIcon`: Item icon element with node head icon absolute positioning, width/height size, background color, border, border radius, wave animation and other icon styles
- `itemSection`: Item section element with section container containing header and content flex layout, wrap, gap and other layout styles
- `itemHeader`: Item header element with header area layout containing title and rail, alignment, text direction and other styles
- `itemTitle`: Item title element with node title text font size, line height, color and other text styles
- `itemContent`: Item content element with node detail content relative positioning, top offset, left margin, text color, word break and other content styles
- `itemRail`: Item rail element with timeline node connection track line absolute positioning, top offset, left offset, height, border color, width, style and other connection line styles

### tooltip

- `root`: Root element (including arrows, content elements) with absolute positioning, z-index, block display, max width, visibility, transform origin and arrow background color
- `container`: Content element with min width and height, padding, color, text alignment, background color, border radius, shadow and border styles
- `arrow`: Arrow element with width, height, position, color and border styles

### tour

- `root`: Tour root container with absolute positioning, z-index control, max width, visibility, arrow background color variable, theme styles and other container styles
- `mask`: Mask layer element with fixed positioning, full screen coverage, z-index, pointer events, transition animation and other mask styles
- `section`: Card main content area with text alignment, border radius, box shadow, relative positioning, background color, border, background clip and other card styles
- `cover`: Card cover area with text center alignment, padding, image width and other image display styles
- `header`: Card header area with padding, width calculation, word break and other header container styles
- `title`: Guide title text with font weight and other title text styles
- `description`: Guide description text with padding, word wrap and other description text styles
- `footer`: Card bottom action area with padding, text right alignment, border radius, flex layout and other bottom container styles
- `actions`: Action button group container with left auto margin, button spacing and other button group layout styles
- `indicators`: Indicator group container with inline-block display and other indicator container styles
- `indicator`: Single indicator element with width/height size, inline-block display, border radius, background color, right margin, active state and other dot styles

### transfer

- `root`: Root element with flex layout, transfer container base styles and layout control
- `section`: Section element with flex layout, width, height, min height, border, border radius and other single-side transfer container styles
- `header`: Header element with flex layout, alignment, height, padding, color, background color, bottom border, border radius and other header area styles
- `title`: Title element with text ellipsis, flex ratio, text alignment, auto left margin and other title text layout and styles
- `body`: Body element with list main area container styles and layout control
- `list`: List element with list content styles, layout and scroll control
- `item`: List item element with relative positioning, padding, border, hover state, selected state, disabled state and other list item interaction styles
- `itemIcon`: List item icon element with checkbox and other icon styles and interaction states
- `itemContent`: List item content element with text ellipsis, padding and other list item text content display styles
- `footer`: Footer element with bottom operation area styles and layout
- `actions`: Actions element with transfer button group styles, layout and interaction states

### tree

- `root`: Root element with tree control base styles, layout and container control
- `item`: Item element with tree node base styles, drag state, role attributes, indentation, switcher, content wrapper and other node structure
- `itemIcon`: Icon element with tree node icon styles, size and state display
- `itemTitle`: Title element with tree node title text display styles and text content

### treeSelect

- `root`: Root element with tree selector base styles, border, border radius container styles
- `prefix`: Prefix element with prefix content layout and styles
- `placeholder`: Placeholder element with font styles and colors for placeholder text
- `content`: Multiple selection container with layout, spacing, and wrapping styles for selected items
- `item`: Multiple selection item element with border, background, padding, and margin styles
- `itemContent`: Multiple selection item content area with text ellipsis styles
- `itemRemove`: Multiple selection item remove button with font-related styles
- `input`: Input element with text input, search, selected value display and other input core interaction styles
- `suffix`: Suffix element with suffix content, clear button, dropdown arrow and other suffix area styles
- `popup`:
  - `root`: Popup element with dropdown tree selection panel positioning, z-index, background, border, shadow and other popup layer styles
  - `item`: Popup item element with tree node option styles, hover state, selected state and other interaction states
  - `itemTitle`: Popup title element with tree node title text display styles

### upload

- `root`: Root container element with layout styles, disabled text color, user-select control, cursor styles and other basic styles
- `list`: File list container with layout arrangement, transition animations, spacing control and other styles
- `item`: File item element with padding, background color, border styles, hover effects, status colors, transition animations and other styles

