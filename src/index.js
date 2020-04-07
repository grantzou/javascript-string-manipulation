const taggedTemplate = (lineEnding, strings, ...values) => {
  return strings.reduce((result, literal, index) => {
    const transformedString = transformLineEnding(literal, lineEnding);
    let transformedValue = values[index] != null ? values[index] : "";
    if (
      !Object.getOwnPropertySymbols(transformedValue).includes(disableConverter)
    ) {
      transformedValue = transformLineEnding(transformedValue, lineEnding);
    }

    return `${result}${transformedString}${transformedValue}`;
  }, "");
};

// Create a tagged template lf`...` that formats text using LF line endings.
var lf = (strings, ...values) =>
  taggedTemplate(LineEndings.LF, strings, ...values);

// Create a tagged template cr`...` that formats text using CR line endings.
var cr = (strings, ...values) =>
  taggedTemplate(LineEndings.CR, strings, ...values);

// Create a tagged template crlf`...` that formats text using CRLF line endings.
var crlf = (strings, ...values) =>
  taggedTemplate(LineEndings.CRLF, strings, ...values);

const transformLineEnding = (string, lineEnding) => {
  let { replaceCRLF, replaceLF, replaceCR } = LineEndingReplacements;
  string = string != null ? string.toString() : "";

  if (lineEnding === LineEndings.CR) {
    string = replaceCRLF(string, "\r");
    string = replaceLF(string, "\r");
  } else if (lineEnding === LineEndings.LF) {
    string = replaceCRLF(string, "\n");
    string = replaceCR(string, "\n");
  } else if (lineEnding === LineEndings.CRLF) {
    string = replaceCR(string, "\r\n");
    string = replaceLF(string, "\r\n");
  }
  return string;
};

const disableConverter = Symbol.for("crlf-converter-disable");

const LineEndings = {
  CR: Symbol("CR"),
  LF: Symbol("LF"),
  CRLF: Symbol("CRLF"),
};

const LineEndingReplacements = {
  replaceCR: (string, newEnding) =>
    string.replace(/(\r+)([^\n]|$)/g, (_match, p1, p2) => {
      return `${newEnding.repeat(p1.length)}${p2}`;
    }),

  replaceLF: (string, newEnding) =>
    string.replace(/([^\r]|^)(\n+)/g, (_match, p1, p2) => {
      return `${p1}${newEnding.repeat(p2.length)}`;
    }),

  replaceCRLF: (string, newEnding) => string.replace(/\r\n/g, `${newEnding}`),
};

module.exports = {
  lf,
  cr,
  crlf,
  disableConverter,
  LineEndings,
  transformLineEnding,
};
