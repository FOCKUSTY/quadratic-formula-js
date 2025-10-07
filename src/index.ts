import Configurator from "fock-logger/config";
import { Colors } from "fock-logger/colors";

new Configurator({
  logging: false,
  date: false,
  create_file: false,
  colors: [Colors.red, Colors.green],
  dir: process.env.TEMP || "./"
})

import Logger from "fock-logger";

const logger = new Logger("Quadrator", {
  date: false,
  colors: [Colors.red, Colors.green],
  logging: false
});

function discriminant([a, b, c]: [number, number, number]): [number, number] {
  if (a === 0) {
    throw new Error("is not a quadratic formula");
  };

  const d = b * b - 4 * a * c;

  if (d === 0) {
    const x = -b / (2 * a);
    return [x, x] as const;
  }
  
  if (d < 0) {
    throw new Error("К сожалению, решение в действительных числах не существует");
  }

  const x1 = (-b + d ** 0.5) / (2 * a);
  const x2 = (-b - d ** 0.5) / (2 * a);

  return [x1, x2] as const;
}

function vieta([a, b, c]: [number, number, number]): [number, number] {
  if (a === 0) {
    throw new Error("is not a quadratic formula");
  };
  
  const s = -b / a;
  const p = c / a;
  
  const d = s * s - 4 * p;
    
  if (d < 0) {
    throw new Error("К сожалению, решение в действительных числах не существует");
  }

  const diff = Math.sqrt(d);
  
  const x1 = (s + diff) / 2;
  const x2 = (s - diff) / 2;

  return [x1, x2];
}

const TYPES: {
  [key: string]: ([a, b, c]: [number, number, number]) => [number, number]
} = {
  "дискриминант": discriminant,
  "виета": vieta,
  "д": discriminant,
  "в": vieta,
  "1": discriminant,
  "2": vieta,
};

(async () => {
  const type = await logger.read("Выберите тип: (дискриминант/виета) или (д/в):", { end: " " });

  if (type instanceof Error) {
    throw type;
  };

  const data = [
    await logger.read("Введите коэффициэнт a:", { end: " " }),
    await logger.read("Введите коэффициэнт b:", { end: " " }),
    await logger.read("Введите коэффициэнт c:", { end: " " })
  ];

  const coefficients: [number, number, number] = [0, 0, 0];

  for (const i in data) {
    const value = data[i];
    if (value instanceof Error) {
      throw value;
    }

    coefficients[i] = +value;
  };

  const [ first, second ] = TYPES[type](coefficients);
  
  logger.execute(`Первый корень "${first}", второй корень: "${second}"`);

  process.exit();
})();