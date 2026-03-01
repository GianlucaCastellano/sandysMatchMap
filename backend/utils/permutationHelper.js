function* permute(arr) {
  const n = arr.length;
  const c = new Array(n).fill(0);

  yield [...arr];

  let i = 1;
  while (i < n) {
    if (c[i] < i) {
      if (i % 2 === 0) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
      } else {
        [arr[c[i]], arr[i]] = [arr[i], arr[c[i]]];
      }
      yield [...arr];
      c[i]++;
      i = 1;
    } else {
      c[i] = 0;
      i++;
    }
  }
}

module.exports = { permute };