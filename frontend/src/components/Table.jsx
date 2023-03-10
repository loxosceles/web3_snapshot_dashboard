import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Table.module.scss';
import Row from './Row';
import HeaderRow from './HeaderRow';
import { useBreakpoints } from 'react-breakpoints-hook';
import { BREAKPOINTS } from '../constants';
import { objectSort } from '../util/helpers';
import GroupingHeader from './GroupingHeader';

function Card({ tableData, onCardClick, coin }) {
  const location = useLocation();

  let { mobile, tablet } = useBreakpoints(BREAKPOINTS);

  return (
    <div className={styles.cardContainer} onClick={(evt) => onCardClick(evt, coin, null)}>
      <div className={styles.cardHeader}>
        {tableData
          .slice(0, 3) // The first 3 items go into the header
          .map((item) => (
            <div key={item.id} className={styles.cardHeaderCell}>
              <span className={styles.cardHeaderCellLabel}>{item.label}</span>
              <div className={styles.cardHeaderCellValue}>{item.render(coin)}</div>
            </div>
          ))}
      </div>
      <div>
        {(mobile || tablet) && location.pathname === '/tokenomics' && <GroupingHeader />}
        <div className={styles.cardBody}>
          {tableData
            .slice(3) // All the rest gos into the content area
            .map((item) => (
              <div key={item.id} className={styles.cardBodyCell}>
                <span className={styles.cardBodyCellLabel}>{item.label}</span>
                <div className={styles.cardBodyCellValue}>{item.render(coin)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
function Table({ tableData, coins, rowStyles, defaultOrderBy, onRowClick }) {
  const [orderedCoins, setOrderedCoins] = useState(coins.order);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  let { desktop } = useBreakpoints(BREAKPOINTS);

  function handleSort(_, cellId) {
    setOrder(order === 'asc' ? 'desc' : 'asc');
    setOrderBy([cellId]);
  }

  useEffect(() => {
    if (coins.order.length > 0) {
      setOrderedCoins(objectSort(coins, order, orderBy));
    }
  }, [order, orderBy, coins]);

  return (
    <div className={styles.container}>
      {desktop ? (
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
              <Row
                tableData={tableData}
                row={coins.data[coinGuid]}
                styles={styles}
                onRowClick={onRowClick}
              />
            </div>
          ))}
        </>
      ) : (
        <>
          {orderedCoins.map((coinGuid) => (
            <Card
              key={coinGuid}
              tableData={tableData}
              coin={coins.data[coinGuid]}
              onCardClick={onRowClick}
            />
          ))}
        </>
      )}
    </div>
  );
}
export default Table;
