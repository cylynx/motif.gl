import { parseISO } from 'date-fns';
import { unixTimeConverter } from './data-utils';

describe('Data Utilities', () => {
  describe('unixTimeConverter', () => {
    it('should convert DATETIME type', () => {
      const format = 'YYYY-M-DTH:m:s';
      const type = 'DATETIME';
      const value = '2020-01-02T02:00:00';

      const unixTime = unixTimeConverter(value, type, format);

      const expectedMsUnixTimestamp = 1577901600000;
      expect(unixTime).toEqual(expectedMsUnixTimestamp);
    });

    it('should convert TIME type', () => {
      const format = 'H:m:s';
      const type = 'TIME';
      const value = '18:00:00';

      const unixTime = unixTimeConverter(value, type, format);

      const expectedMsUnixTimestamp: number = parseISO(
        `${new Date().toISOString().slice(0, 10)} ${value}`,
      ).getTime();

      expect(unixTime).toEqual(expectedMsUnixTimestamp);
    });

    it('should convert DATE type', () => {
      const format = 'M/D/YYYY';
      const type = 'DATE';
      const value = '04/20/2020';

      const unixTime = unixTimeConverter(value, type, format);
      const expectedMsUnixTimestamp = 1587312000000;

      expect(unixTime).toEqual(expectedMsUnixTimestamp);
    });

    it('should not convert milliseconds UNIX timestamp', () => {
      const format = 'X';
      const type = 'DATETIME';
      const value = 1609143690000;

      const unixTime = unixTimeConverter(value, type, format);

      expect(unixTime).toEqual(value);
    });

    it('should not convert UNIX timestamp', () => {
      const format = 'x';
      const type = 'DATETIME';
      const value = 160914369;

      const unixTime = unixTimeConverter(value, type, format);

      expect(unixTime).toEqual(value);
    });

    // we attempt to convert date string with invalid format.
    // the month is set to 17 to test specific branch condition.
    it('should return null if date is invalid', () => {
      const format = 'M/D/YYYY H:m';
      const type = 'DATETIME';
      const value = '17/04/2020 06:39';

      const unixTime = unixTimeConverter(value, type, format);

      expect(unixTime).toEqual(null);
    });
  });
});
