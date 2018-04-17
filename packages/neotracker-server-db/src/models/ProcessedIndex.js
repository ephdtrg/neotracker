/* @flow */
import { INTEGER_INDEX_VALIDATOR } from './common';
import { PROCESSED_NEXT_INDEX } from '../channels';

import BlockchainModel from './BlockchainModel';
import { type FieldSchema } from '../lib';

export default class ProcessedIndex extends BlockchainModel<number> {
  id: number;
  index: number;

  static modelName = 'ProcessedIndex';
  static exposeGraphQL: boolean = false;
  static indices = [
    {
      type: 'simple',
      columnNames: ['index'],
      name: 'processed_index_index',
      unique: true,
    },
  ];
  static bigIntID = true;

  static chainCustomAfter(schema: any): any {
    return schema.raw(`
      CREATE OR REPLACE FUNCTION processed_index_notify() RETURNS trigger AS $processed_index_notify$
        BEGIN
          NOTIFY ${PROCESSED_NEXT_INDEX};
          RETURN NULL;
        END;
      $processed_index_notify$ LANGUAGE plpgsql;
    `).raw(`
      DROP TRIGGER IF EXISTS processed_index_notify
      ON processed_index;

      CREATE TRIGGER processed_index_notify AFTER INSERT
      ON processed_index FOR EACH ROW EXECUTE PROCEDURE
      processed_index_notify()
    `);
  }

  static fieldSchema: FieldSchema = {
    id: {
      type: { type: 'id', big: false },
      required: false,
      exposeGraphQL: true,
      auto: true,
    },
    index: {
      type: INTEGER_INDEX_VALIDATOR,
      required: true,
    },
  };
}
