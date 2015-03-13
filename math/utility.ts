/// <reference path="references.ts" />


module Spatial {


  declare var exports: any; // Global CommonJS exports object.
  // Add objects in hash to module exports so they can be imported by the nodejs require() function.
  // Hash key is the exported name; hash value is the exported object.
  export function exportCommonjs(objects: {[exportedName: string]: any}): void {
    if (typeof exports !== 'undefined') {
      for (var key in objects) {
        exports[key] = objects[key];
      }
    }
  }

}
