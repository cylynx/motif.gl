import { mapCollectionFields } from '../data-utils';

export const first = (collection: any[], field: string): any => {
  const fieldsValues: any[] = mapCollectionFields(collection, field);
  const [firstItem] = fieldsValues;

  return firstItem;
};

/**
 * Retrieve the last item from the array with given fields.
 *
 * @param collection - graph edges
 * @param field - key accessors to object in array collections.
 * @return {any} - last item of array
 */
export const last = (collection: any[], field: string): any => {
  const fieldsValues: any[] = mapCollectionFields(collection, field);
  const lastItem: string = fieldsValues[fieldsValues.length - 1];

  return lastItem;
};

export const mostFrequent = (collection: any[], field: string): string => {
  const fieldsValues: any[] = mapCollectionFields(collection, field);

  // use Map() to count the items for string and integer
  // object has limitation to difference "2" and 2
  const occurranceList = fieldsValues.reduce(
    (acc: Map<number | string, number>, value: number | string) => {
      let property = acc.get(value) ?? 0;
      acc.set(value, ++property);

      return acc;
    },
    new Map(),
  );

  // obtain the most frequent count with array sorting in descending orders
  const descendingOccurances = [...occurranceList.values()].sort(
    (a, b) => b - a,
  );

  // first item of descending order will always the highest value
  const [mostFrequentCount] = descendingOccurances;

  // obtain all the most frequent string or number from the list
  const mostFrequentStringArr: string[] = getMostOccuranceString(
    occurranceList,
    mostFrequentCount,
  );

  // return the results as string
  return mostFrequentStringArr.join(', ');
};

const getMostOccuranceString = (
  map: Map<string, string>,
  searchValue: string,
): string[] => {
  const mostOccurance = [];

  for (const [key, value] of map.entries()) {
    if (value === searchValue) {
      mostOccurance.push(key);
    }
  }

  return mostOccurance;
};
