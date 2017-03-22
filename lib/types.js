/* eslint-env es6 */
/**
 * WASM types
 *
 * @author Arthur Buldauskas
 */

const i32 = 1;
const i64 = 1 << 1;
const f32 = 1 << 2;
const f64 = 1 << 3;
const anyfunc = 1 << 4;
const func = 1 << 5;
const block_type = 1 << 6;

// C type mappings
const i8 = 1 << 7;
const uint8 = 1 << 8;
const i16 = 1 << 9;
const uint16 = 1 << 10;
const uint32 = 1 << 11;
const uint64 = 1 << 12;

const word = 4;

const sizeof = {
  [i32]: word,
  [i64]: word * 2,
  [f32]: word,
  [f64]: word * 2,
  [anyfunc]: word,
  [func]: word,
  [block_type]: word
};

const getter = (type, index, dataView) => {
  switch (type) {
    case i32: return dataView.getInt32(index);
    case i64: return dataView.getInt64(index);
    case f32: return dataView.getFloat32(index);
    case f64: return dataView.getFloat64(index);
    case anyfunc: return dataView.getUint32(index);
    case func: return dataView.getUint32(index);
    case i8: return dataView.getInt8(index);
    case uint8: return dataView.getUint8(index);
    case i16: return dataView.getInt16(index);
    case uint16: return dataView.getUint16(index);
    case uint32: return dataView.getUint32(index);
    case uint64: return dataView.getUint64(index);
    default:
      return dataView.getUint8(index);
  };
};

/**
 *
 */
const define = (types) => {
  let offset = 0;

  const struct = dataView => {
    const object = {};
    Object.keys(types).map(type => {
      Object.defineProperty(object, type, {
        get: (typedef => {
          if (typeof typedef === 'function') {
            return typedef(new DataView(dataView.buffer, index, typedef.size));
          }

          return getter(typedef, offset, dataView);
        })(types[type])
      })
    });
  };

  struct.size = offset;
};


