# A tool for compass-only geometry

This is intended to make it easy to play with compass-only geometric construction problems, such as
the Napoleon's Problem.

## todo

- [x] draw from array of points and circles
- [x] drag and zoom with mouse
- [x] add a new circle (center, point on circle), escape to cancel
- [x] add a point (double click on center)
- [x] save state in localStorage
- [x] snapping to nearest point within some radius
- [x] snapping to nearest circle intersection within some radius
  - probably remember intersections so it becomes the above
- [x] snapping to nearest point on a nearby circle
- [x] reset to a single circle, or two points
- [x] reset view to initial zoom and offset
- [x] highlight first circle somehow, maybe use colours for non-point circles, starting with black
- [x] remove selected or last point/circle?
- [ ] add names to points and circles, with unnamed ones supported
- [x] create a circle from 3 points: center C, radius |A-B|
