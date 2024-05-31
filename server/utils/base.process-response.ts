interface ModelConstructor<T> {
  new (data: T): T;
}

export function processResponse<T>(data: any, Model: ModelConstructor<T>, log: any): T | T[] {
  try {
    if (Array.isArray(data)) {
      log.silly(`processResponse Array[0] BEFORE ${JSON.stringify(data[0])}`);
      const processedArray = data.map((item) => new Model(item));
      log.silly(`processResponse Array[0] AFTER ${JSON.stringify(processedArray[0])}`);
      return processedArray;
    } else {
      log.silly(`processResponse Object ${JSON.stringify(data)}`);
      const processedObject = new Model(data);
      log.silly(`processResponse Object ${JSON.stringify(processedObject)}`);
      return processedObject;
    }
  } catch (error) {
    log.error('Data validation failed', error);
    throw createError({ message: 'Data validation failed: ' + error.message });
  }
}
