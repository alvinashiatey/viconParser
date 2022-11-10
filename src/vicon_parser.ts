function nthOccurrence(txt: string, char: string, nth: number): number {
  const firstIndex = txt.indexOf(char);
  const lengthUpToFirstIndex = firstIndex + 1;

  if (nth == 1) {
    return firstIndex;
  } else {
    const stringAfterFirstOccurrence = txt.slice(lengthUpToFirstIndex);
    const nextOccurrence = nthOccurrence(
      stringAfterFirstOccurrence,
      char,
      nth - 1
    );

    if (nextOccurrence === -1) {
      return -1;
    } else {
      return lengthUpToFirstIndex + nextOccurrence;
    }
  }
}

function detectSeparator(csvFile: string): string | undefined {
  const separators = [",", ";", "\t"];
  const counts: {
    [key: string]: number;
  } = {};
  let sepMax;
  for (const sep of separators) {
    const re = new RegExp(sep, "g");
    counts[sep] = (csvFile.match(re) || []).length;
    sepMax = !sepMax || counts[sep] > counts[sepMax] ? sep : sepMax;
  }
  return sepMax;
}

function csvToArray(text: string): string[][] {
  let p = "",
    row = [""],
    i = 0,
    r = 0,
    s = !0,
    l;
  const ret = [row];
  for (l of text) {
    if ('"' === l) {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if ("," === l && s) l = row[++i] = "";
    else if ("\n" === l && s) {
      if ("\r" === p) row[i] = row[i].slice(0, -1);
      row = ret[++r] = [(l = "")];
      i = 0;
    } else row[i] += l;
    p = l;
  }
  return ret;
}

function csvParser(strData: string, header = true) {
  const headers = strData.split("\n")[3].split(",");
  const data = strData.slice(nthOccurrence(strData, "\n", 5) + 1);
  const arrData = csvToArray(data);
  if (header) {
    return arrData.map((row) => {
      let i = 0;
      return headers.reduce((acc: { [key: string]: string }, key: string) => {
        acc[key] = (row[i++] || "").trim().replace(/(^")|("$)/g, "");
        return acc;
      }, {});
    });
  } else {
    return arrData;
  }
}

function convert(
  csvData: string,
  delimiter = ","
): string[][] | { [p: string]: string }[] {
  if (csvData.length == 0) throw Error("CSV data is empty");
  const separator = delimiter || detectSeparator(csvData);
  if (!separator) throw Error("Separator not found");
  return csvParser(csvData, true);
}

async function loadCSV(csvPath: string) {
  try {
    return await fetch(csvPath)
      .then((csv) => csv.text())
      .catch((err) => {
        throw Error(err.message);
      });
  } catch (e: unknown) {
    const res = (e as Error).message;
    throw Error(res);
  }
}

async function vParser(csvPath: string) {
  try {
    const data = await loadCSV(csvPath);
    return convert(data);
  } catch (e: unknown) {
    return (e as Error).message;
  }
}

export { vParser };
