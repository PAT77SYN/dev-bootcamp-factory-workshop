// Output formatter: comma decimal separator, trailing zeros stripped, integers without comma.
export function formatResult(value: number): string {
  // Round to 10 significant figures to suppress floating-point noise.
  const clean = parseFloat(value.toPrecision(10));
  if (Number.isInteger(clean)) {
    return String(Math.round(clean));
  }
  return String(clean).replace(".", ",");
}
