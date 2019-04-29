import React, { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react';

import { StyledTable, Placeholder } from './SearchResults.styled';

const noop = () => {};

const View = ({
  headers,
  results,
  onItemClick,
  onSort,
  sortDirection,
  sortedColumn,
}) => (
  results.length ? (
    <StyledTable>
      <Table.Header>
        <Table.Row>
          {headers.map(header => (
            <Table.HeaderCell
              key={header}
              sorted={sortedColumn === header ? sortDirection : null}
              onClick={onSort(header)}
            >
              {header}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {results.map((listing, i) => (
          <Table.Row key={i} onClick={() => onItemClick(listing)}>
            <Table.Cell collapsing>{listing.book.title}</Table.Cell>
            <Table.Cell className='listing-condition'>{listing.condition}</Table.Cell>
            <Table.Cell className='listing-price'>{listing.price ? `$${listing.price}` : '—'}</Table.Cell>
            <Table.Cell className='listing-exchange'>{listing.exchangeBook ? listing.exchangeBook.title : '—'}</Table.Cell>
            <Table.Cell className='listing-user'>{listing.assignedUser.displayName}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </StyledTable>
  ) : <Placeholder message='No results found. Enter a search query above.' />
);

const SearchResults = ({ results = [], onItemClick = noop }) => {
  const [sortState, setSortState] = useState({
    sortedHeader: null,
    direction: null,
  });

  const [visibleResults, setVisibleResults] = useState([]);

  const headers = ['Book title', 'Condition', 'Price', 'Exchange for', 'Listed by'];

  const onSort = header => () => {
    // Right now, we only allow sorting by price
    if (header !== 'Price') return;

    let nextDir;

    switch (sortState.direction) {
      case 'ascending': {
        nextDir = 'descending';
        break;
      }
      case 'descending': {
        nextDir = null;
        break;
      }
      default: {
        nextDir = 'ascending';
        break;
      }
    }

    setSortState({
      sortedHeader: nextDir ? header : null,
      direction: nextDir
    });

    if (nextDir) {
      setVisibleResults([...visibleResults].sort((a, b) => {
        const factor = nextDir === 'ascending' ? -1 : 1;
        return factor * ((a.price > b.price) ? 1 : -1);
      }));
    } else {
      setVisibleResults(results);
    }
  };

  useEffect(() => setVisibleResults(results), [results]);

  return (
    <View
      headers={headers}
      onItemClick={onItemClick}
      onSort={onSort}
      results={visibleResults}
      sortDirection={sortState.direction}
      sortedColumn={sortState.sortedHeader}
    />
  );
};

export default SearchResults;