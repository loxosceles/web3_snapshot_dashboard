import React, { useState, useEffect } from 'react';
import styles from './Table.module.css';
import Row from './Row';
import HeaderRow from './HeaderRow';
import { useBreakpoints } from 'react-breakpoints-hook';
import { BREAKPOINTS } from '../constants';

function comparison(a, b) {
  if (a > b) return -1;
  if (b > a) return 1;
  return 0;
}

export function comparator(a, b, order, orderBy) {
  const multiplier = order === 'desc' ? 1 : -1;
  return orderBy.reduce((acc, curr) => {
    acc ||= comparison(a[curr], b[curr]);
    return multiplier * acc;
  }, false);
}

export function objectSort(obj, order, orderBy) {
  const dataObj = obj.data;
  return Object.entries(dataObj)
    .sort(([_, av], [__, bv]) => comparator(av, bv, order, orderBy))
    .reduce((acc, [currk, _]) => [...acc, currk], []);
}

function Table({ tableData, coins, rowStyles, defaultOrderBy }) {
  const [orderedCoins, setOrderedCoins] = useState(coins.order);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(defaultOrderBy);

  let { lg, xl } = useBreakpoints(BREAKPOINTS);

  function handleSort(_, cellId, order) {
    setOrder(order);
    setOrderBy([cellId]);
  }

  useEffect(() => {
    if (coins.order.length > 0) {
      setOrderedCoins(objectSort(coins, order, orderBy));
    }
  }, [order, orderBy, coins]);

  return (
    <div className={styles.container}>
      {xl || lg ? (
        <>
          <div className={`${rowStyles.row} ${styles.header}`}>
            <HeaderRow
              headers={tableData}
              styles={styles}
              sortHandler={handleSort}
              order={order}
              orderBy={orderBy}
            />
          </div>
          {orderedCoins.map((coinGuid) => (
            <div key={coinGuid} className={`${rowStyles.row} ${styles.data}`}>
              <Row tableData={tableData} row={coins.data[coinGuid]} styles={styles} />
            </div>
          ))}
        </>
      ) : (
        <>
          {orderedCoins.map((coinGuid) => (
            <div key={coinGuid} className={styles.cardContainer}>
              <div className={styles.cardHeader}>
                {tableData
                  .slice(0, 3) // The first 3 items go into the header
                  .map((item) => (
                    <div key={item.id} className={styles.cardHeaderCell}>
                      <span className={styles.cardHeaderCellLabel}>{item.label}</span>
                      <div className={styles.cardHeaderCellValue}>
                        {item.render(coins.data[coinGuid])}
                      </div>
                    </div>
                  ))}
              </div>
              <div className={styles.cardBody}>
                {tableData
                  .slice(3) // All the rest gos into the content area
                  .map((item) => (
                    <div key={item.id} className={styles.cardBodyCell}>
                      <span className={styles.cardBodyCellLabel}>{item.label}</span>
                      <div className={styles.cardBodyCellValue}>
                        {item.render(coins.data[coinGuid])}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
export default Table;
