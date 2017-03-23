# WASM JavaScript Utils

A tiny modular collection of JavaScript Utils for use with WASM Modules.

### Deps to use with a wasm module Instance:

* `logger` - Logs strings from WASM  code.
* `stack` - Stack
* `heap` - JavaScript implementation of malloc, free to pass into wasm.
* `types` - Helper methods for seamless mapping of JS object to WASM memory


#### Types

The types module provides a method of mapping a JavaScript object to a section of WASM memory. Allowing you to set and get values from a memory buffer seamlessly.

* `types.define(typedef) -> struct(DataView)`
  - Param: `typedef` - Object where keys are mapped to low level C-like typedefs
  - Returns: `struct(DataView)` - A new typedef which can be attached to a generic DataView object.
    + `struct.size` - Size of the defined struct in bytes.

  - Example:

    Assuming you already have a wasm module setup:

    ```
    // let's say you have a wasm function which creates a new pointer to C struct
    // This struct contains { float x; float y; float z; }
    const ptr = wasmExports.createVec3(-1, -1, -1);

    // You can create a new Object in JavaScript to access the data pointed to by the pointer
    const vec3Struct = types.define({
      x: types.f32,
      y: types.f32,
      z: types.f32
    });

    // vec3Struct can now map to a 12 continues bytes in our memory buffer
    console.log(vec3Struct.size); // 12

    // Create a DataView to access the data within wasmMemory.buffer
    const vec3Dataview = new DataView(wasMemory.buffer, ptr, vec3Struct.size);

    const myVector = vec3Struct(vec3DataView);

    console.log(myVector.x); // -1
    console.log(myVector.y); // -1
    console.log(myVector.z); // -1

    // WASM changes will reflect in our JS struct
    wasmExports.setVec3X(ptr, 128);

    console.log(myVector.x); // 128

    // ... and vice-versa
    myVector.y = 100;

    wasmExports.logVec3Y(ptr); // 100
    ```
    *structs can be nested*:

    ```
    const objectStruct = types.define({
      value: types.u32, // unsigned 32 bit integer
      position: vec3Struct
    });

    console.log(objectStruct.size); // 16

    // Let's say this wasm function returns a pointer to object with position set to 100, 100, 0
    const objPtr = wasmExports.createObject();

    // ... we create the dataView etc.,

    const myObject = objectStruct(objectDataView);

    console.log(myObject.position.x); // 100
    console.log(myObject.position.y); // 100
    console.log(myObject.position.z); // 0
    ```

