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
const u8 = 1 << 8;
const i16 = 1 << 9;
const u16 = 1 << 10;
const u32 = 1 << 11;
const u64 = 1 << 12;

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

const getter = (type, index, dataView) => function() {
  switch (type) {
    case i32: return dataView.getInt32(index);
    case i64: return dataView.getInt64(index);
    case f32: return dataView.getFloat32(index);
    case f64: return dataView.getFloat64(index);
    case anyfunc: return dataView.getUint32(index);
    case func: return dataView.getUint32(index);
    case i8: return dataView.getInt8(index);
    case u8: return dataView.getUint8(index);
    case i16: return dataView.getInt16(index);
    case u16: return dataView.getUint16(index);
    case u32: return dataView.getUint32(index);
    case u64: return dataView.getUint64(index);
    default:
      return dataView.getUint8(index);
  };
};

const setter = (type, index, dataView) => (value) => {
  switch (type) {
    case i32: return dataView.setInt32(index, value);
    case i64: return dataView.setInt64(index, value);
    case f32: return dataView.setFloat32(index, value);
    case f64: return dataView.setFloat64(index, value);
    case anyfunc: return dataView.setUint32(index, value);
    case func: return dataView.setUint32(index, value);
    case i8: return dataView.setInt8(index, value);
    case u8: return dataView.setUint8(index, value);
    case i16: return dataView.setInt16(index, value);
    case u16: return dataView.setUint16(index, value);
    case u32: return dataView.setUint32(index, value);
    case u64: return dataView.setUint64(index, value);
    default:
      return dataView.setUint8(index, value);
  };
}

/**
 *
 */
const define = (types) => {

  const struct = dataView => {
    const object = {};
    let offset = 0;
    Object.keys(types).map(type => {
      const get = (typeof types[type] === 'function') ?
            () => types[type](new DataView(dataView.buffer, offset, types[type].size)) :
            getter(types[type], offset, dataView);
      Object.defineProperty(object, type, {
        get,
        set: setter(types[type], offset, dataView)
      })
    });

    return object;
  };

  let size = 0;
  Object.keys(types).map(type => {
    if (typeof types[type] === 'function') {
      size += types[type].size | 0;
    } else {
      size += sizeof[types[type]] | 0;
    }
  });

  struct.size = size;
  return struct;
};

module.exports = {
  define,
  i32,
  i64,
  f32,
  f64,
  anyfunc,
  func,
  block_type,
  i8,
  u8,
  i16,
  u16,
  u32,
  u64
}

