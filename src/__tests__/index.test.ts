import { requestToRsql } from '../index';
import { FilterType } from 'angular-datatable-advanced';

test('Should return null for empty array', () => {
  expect(requestToRsql([])).toBeNull();
});

test('Should build filter for single column with different fitler types', () => {
  const testCases = [
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.EQUALS, value1: 'value1' },
      },
      expected: 'key1==value1',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.CONTAINS, value1: 'value1' },
      },
      expected: 'key1==*value1*',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.STARTS_WITH, value1: 'value1' },
      },
      expected: 'key1==value1*',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.ENDS_WITH, value1: 'value1' },
      },
      expected: 'key1==*value1',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.NOT_EQUALS, value1: 'value1' },
      },
      expected: 'key1!=value1',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.GREATER_THAN, value1: 'value1' },
      },
      expected: 'key1>value1',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.GREATER_THAN_OR_EQUALS, value1: 'value1' },
      },
      expected: 'key1>=value1',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.LESS_THAN, value1: 'value1' },
      },
      expected: 'key1<value1',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.LESS_THAN_OR_EQUALS, value1: 'value1' },
      },
      expected: 'key1<=value1',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.RANGE, value1: 'value1', value2: 'value2' },
      },
      expected: 'key1>=value1;key1<=value2',
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.IN, value1: [1, 2, 3] },
      },
      expected: "key1=in=('1','2','3')",
    },
    {
      filter: {
        column: { columnKey: 'key1', columnName: 'Key 1' },
        filter: { type: FilterType.NIN, value1: [1, 2, 3] },
      },
      expected: "key1=out=('1','2','3')",
    },
  ];

  testCases.forEach((test) => {
    expect(requestToRsql([test.filter])).toBe(test.expected);
  });
});
