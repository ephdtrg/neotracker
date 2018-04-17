/* @flow */
/* eslint-disable react/no-array-index-key */
import * as React from 'react';

import classNames from 'classnames';
import { type HOC, compose, pure } from 'recompose';
import { graphql } from 'react-relay';

import { type Theme } from '../../../../styles/createTheme';
import { IconLink } from '../../../../lib/link';

import { fragmentContainer } from '../../../../graphql/relay';
import * as routes from '../../../../routes';
import { withStyles } from '../../../../lib/base';

import { type TransactionInputTable_inputs } from './__generated__/TransactionInputTable_inputs.graphql';
import TransactionInputOutputTable from './TransactionInputOutputTable';

const styles = (theme: Theme) => ({
  row: theme.custom.inputOutput.row,
  margin: {
    marginRight: theme.spacing.unit,
  },
});

type ExternalProps = {|
  inputs: any,
  addressHash?: string,
  positive?: boolean,
  page: number,
  isInitialLoad: boolean,
  isLoadingMore: boolean,
  error: ?string,
  pageSize: number,
  hasPreviousPage: boolean,
  hasNextPage: boolean,
  onUpdatePage: (page: number) => void,
  className?: string,
|};
type InternalProps = {|
  inputs: TransactionInputTable_inputs,
  classes: Object,
|};
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
function TransactionInputTable({
  inputs,
  addressHash,
  positive,
  page,
  isInitialLoad,
  isLoadingMore,
  error,
  pageSize,
  hasPreviousPage,
  hasNextPage,
  onUpdatePage,
  className,
  classes,
}: Props): React.Element<*> {
  const links = inputs.map((input, idx) => (
    <IconLink
      key={idx}
      className={classNames(classes.margin, classes.row)}
      icon="arrow_back"
      path={routes.makeTransaction(input.output_transaction_id)}
    />
  ));
  return (
    <TransactionInputOutputTable
      className={className}
      input_outputs={inputs}
      left={links}
      addressHash={addressHash}
      positive={positive}
      page={page}
      isInitialLoad={isInitialLoad}
      isLoadingMore={isLoadingMore}
      error={error}
      pageSize={pageSize}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      onUpdatePage={onUpdatePage}
    />
  );
}

const enhance: HOC<*, *> = compose(
  fragmentContainer({
    inputs: graphql`
      fragment TransactionInputTable_inputs on TransactionInputOutput
        @relay(plural: true) {
        ...TransactionInputOutputTable_input_outputs
        output_transaction_id
      }
    `,
  }),
  withStyles(styles),
  pure,
);

export default (enhance(TransactionInputTable): React.ComponentType<
  ExternalProps,
>);
