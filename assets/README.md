# assets/

## `oahf-comic.jpg` — the comic sheet for `OAHFcomic.html`

`OAHFcomic.html` does not carry fourteen separate images. It carries this one
sheet and crops each case out of it in CSS, so the drawing stays a single file
and the page keeps its own layout.

The sheet is 750 x 1125, two columns by seven rows, numbered left to right and
top to bottom:

```
 1  2
 3  4
 5  6
 7  8
 9 10
11 12
13 14
```

**The rows are not equal heights**, which is why the page does not crop on an
even grid. Measured from the drawing:

| row | y | height |   | column | x | width |
|-----|---|--------|---|--------|---|-------|
| 1 | 5 | 205 | | 1 | 6 | 364 |
| 2 | 215 | 181 | | 2 | 377 | 368 |
| 3 | 401 | 156 |
| 4 | 562 | 157 |
| 5 | 724 | 161 |
| 6 | 889 | 136 |
| 7 | 1029 | 94 |

Those rectangles live in `PANEL_RECTS` in `OAHFcomic.html` and are converted to
percentages, so re-exporting the same layout at any resolution still crops
correctly. Replacing the sheet with a differently proportioned one means
re-measuring `PANEL_RECTS`.

If the file is missing, the page still renders in full, shows a notice, and lets
a reader pick the sheet from disk (or drag it onto the page) to see it
immediately.

To ship the page as one standalone file, inline the sheet:

```sh
tools/embed-comic.sh                       # assets/oahf-comic.jpg -> OAHFcomic.html
tools/embed-comic.sh my-sheet.png page.html
```
