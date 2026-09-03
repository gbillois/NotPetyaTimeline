# assets/

## `oahf-comic.png` — the comic sheet for `OAHFcomic.html`

`OAHFcomic.html` does not carry fourteen separate images. It carries one sheet
and crops each case out of it in CSS, so the drawing stays a single file and the
page keeps its own layout.

The sheet must be a regular **2-column by 7-row grid**, numbered left to right,
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

Any resolution works. The page measures the image once it loads and derives the
per-case aspect ratio from it, so a 750 x 1100 sheet and a 3000 x 4400 sheet
both render correctly. Gutters between the cases are part of the crop and read
as the frame.

The file is not committed here, because it is a drawing rather than source. Drop
your copy at `assets/oahf-comic.png` and the page picks it up. If the file is
missing, the page still renders in full, shows a notice, and lets a reader pick
the sheet from disk (or drag it onto the page) to see it immediately.

To ship the page as one standalone file, inline the sheet:

```sh
tools/embed-comic.sh                       # assets/oahf-comic.png -> OAHFcomic.html
tools/embed-comic.sh my-sheet.png page.html
```
