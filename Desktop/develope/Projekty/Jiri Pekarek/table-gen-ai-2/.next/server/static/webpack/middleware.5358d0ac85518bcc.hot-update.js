"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./middleware.ts":
/*!***********************!*\
  !*** ./middleware.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   middleware: () => (/* binding */ middleware)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(middleware)/./node_modules/next/dist/esm/api/server.js\");\n\nfunction middleware(request) {\n    const response = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.next();\n    // Přidání bezpečnostních hlaviček\n    response.headers.set(\"X-XSS-Protection\", \"1; mode=block\");\n    response.headers.set(\"X-Frame-Options\", \"DENY\");\n    response.headers.set(\"X-Content-Type-Options\", \"nosniff\");\n    response.headers.set(\"Referrer-Policy\", \"strict-origin-when-cross-origin\");\n    response.headers.set(\"Content-Security-Policy\", \"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';\");\n    return response;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUEwQztBQUduQyxTQUFTQyxXQUFXQyxPQUFvQjtJQUM3QyxNQUFNQyxXQUFXSCxxREFBWUEsQ0FBQ0ksSUFBSTtJQUVsQyxrQ0FBa0M7SUFDbENELFNBQVNFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLG9CQUFvQjtJQUN6Q0gsU0FBU0UsT0FBTyxDQUFDQyxHQUFHLENBQUMsbUJBQW1CO0lBQ3hDSCxTQUFTRSxPQUFPLENBQUNDLEdBQUcsQ0FBQywwQkFBMEI7SUFDL0NILFNBQVNFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLG1CQUFtQjtJQUN4Q0gsU0FBU0UsT0FBTyxDQUFDQyxHQUFHLENBQ2xCLDJCQUNBO0lBR0YsT0FBT0g7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9taWRkbGV3YXJlLnRzPzQyMmQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcbmltcG9ydCB0eXBlIHsgTmV4dFJlcXVlc3QgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWlkZGxld2FyZShyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCByZXNwb25zZSA9IE5leHRSZXNwb25zZS5uZXh0KClcblxuICAvLyBQxZlpZMOhbsOtIGJlenBlxI1ub3N0bsOtY2ggaGxhdmnEjWVrXG4gIHJlc3BvbnNlLmhlYWRlcnMuc2V0KFwiWC1YU1MtUHJvdGVjdGlvblwiLCBcIjE7IG1vZGU9YmxvY2tcIilcbiAgcmVzcG9uc2UuaGVhZGVycy5zZXQoXCJYLUZyYW1lLU9wdGlvbnNcIiwgXCJERU5ZXCIpXG4gIHJlc3BvbnNlLmhlYWRlcnMuc2V0KFwiWC1Db250ZW50LVR5cGUtT3B0aW9uc1wiLCBcIm5vc25pZmZcIilcbiAgcmVzcG9uc2UuaGVhZGVycy5zZXQoXCJSZWZlcnJlci1Qb2xpY3lcIiwgXCJzdHJpY3Qtb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luXCIpXG4gIHJlc3BvbnNlLmhlYWRlcnMuc2V0KFxuICAgIFwiQ29udGVudC1TZWN1cml0eS1Qb2xpY3lcIixcbiAgICBcImRlZmF1bHQtc3JjICdzZWxmJzsgc2NyaXB0LXNyYyAnc2VsZicgJ3Vuc2FmZS1pbmxpbmUnICd1bnNhZmUtZXZhbCc7XCIsXG4gIClcblxuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIm1pZGRsZXdhcmUiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJuZXh0IiwiaGVhZGVycyIsInNldCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

});