import { ColumnWithFilter, FilterType } from 'angular-datatable-advanced';

export interface FieldFilter {
  key: string;
  type?: FilterType;
  value1: any;
  value2?: any;
}

export type ValueProcessorFunction = (value: any) => any;

export interface FilterProcessor {
  newKey?: string;
  valueProcessor?: ValueProcessorFunction;
}

export function requestToRsql(filters: ColumnWithFilter[], filterProcessor: Map<string, FilterProcessor> = new Map()): string | null {
  return (
    filters
      .map((col) => {
        const processor: FilterProcessor | undefined = filterProcessor.get(col.column.columnKey);
        const key = processor && processor.newKey ? processor.newKey : col.column.columnKey;

        return {
          key,
          type: col.filter.type,
          value1: processValue(processor, col.filter.value1),
          value2: processValue(processor, col.filter.value2),
        };
      })
      .map((filter) => filterToRsql(filter))
      .filter((value) => !!value)
      .join(';') || null
  );
}

function processValue(filterProcessor: FilterProcessor | undefined, value: any) {
  return filterProcessor && filterProcessor.valueProcessor ? filterProcessor.valueProcessor(value) : value;
}

function filterToRsql(filter: FieldFilter) {
  switch (filter.type) {
    case FilterType.EQUALS:
      return `${filter.key}==${filter.value1}`;
    case FilterType.NOT_EQUALS:
      return `${filter.key}!=${filter.value1}`;
    case FilterType.CONTAINS:
      return `${filter.key}==*${filter.value1}*`;
    case FilterType.STARTS_WITH:
      return `${filter.key}==${filter.value1}*`;
    case FilterType.ENDS_WITH:
      return `${filter.key}==*${filter.value1}`;
    case FilterType.GREATER_THAN:
      return `${filter.key}>${filter.value1}`;
    case FilterType.GREATER_THAN_OR_EQUALS:
      return `${filter.key}>=${filter.value1}`;
    case FilterType.LESS_THAN:
      return `${filter.key}<${filter.value1}`;
    case FilterType.LESS_THAN_OR_EQUALS:
      return `${filter.key}<=${filter.value1}`;
    case FilterType.RANGE:
      return `${filter.key}>=${filter.value1};${filter.key}<=${filter.value2}`;
    case FilterType.IN:
      return hasLength(filter.value1) ? `${filter.key}=in=(${toCommaSeparateList(filter.value1)})` : null;
    case FilterType.NIN:
      return hasLength(filter.value1) ? `${filter.key}=out=(${toCommaSeparateList(filter.value1)})` : null;
  }
}

function hasLength(array: any) {
  return Array.isArray(array) && array.length > 0;
}

function toCommaSeparateList(array: any[]) {
  return array.map((item) => `'${item}'`).join(',');
}
