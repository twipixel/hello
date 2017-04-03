export const constants = {
    canvasWidth: 800, // In pixels.
    canvasHeight: 800, // In pixels.
    xMin: -9, // These four max/min values define a square on the xy-plane that the surface will be plotted over.
    xMax: 9,
    yMin: -9,
    yMax: 9,
    xDelta: 0.2, // Make smaller for more surface points.
    yDelta: 0.2, // Make smaller for more surface points.
    // colorMap: ["#060", "#090", "#0C0", "#0F0", "#9F0", "#9C0", "#990", "#960", "#930", "#900", "#C00"], // There are eleven possible "vertical" color values for the surface, based on the last row of http://www.cs.siena.edu/~lederman/truck/AdvanceDesignTrucks/html_color_chart.gif
    colorMap: [0xC5EFF7, 0x52B3D9, 0x81CFE0, 0x59ABE3, 0x4183D7, 0x22A7F0, 0x3498DB, 0x1E8BC3, 0x19B5FE, 0x6BB9F0, 0x1E8BC3], // There are eleven possible "vertical" color values for the surface, based on the last row of http://www.cs.siena.edu/~lederman/truck/AdvanceDesignTrucks/html_color_chart.gif
    pointWidth: 2, // The size of a rendered surface point (i.e., rectangle width and height) in pixels.
    dTheta: 0.05, // The angle delta, in radians, by which to rotate the surface per key press.
    surfaceScale: 24 // An empirically derived constant that makes the surface a good size for the given canvas size.
};

// These are constants too but I've removed them from the above constants literal to ease typing and improve clarity.
export const X = 0;
export const Y = 1;
export const Z = 2;

