import React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const HeaderRow = ({ headers, styles, tableStyles, sortHandler, order, orderBy }) => {
  return headers.map((cell) => (
    <div key={cell.id} className={styles.cell}>
      <FaAngleDown
        className={`${tableStyles.iconDown} ${
          order === 'desc' && orderBy === cell.id && tableStyles.iconActive
        }`}
        onClick={(evt) => sortHandler(evt, cell.id, 'desc')}
      />
      <span className={tableStyles.headerText}>{cell.label}</span>
      <FaAngleUp
        className={`${tableStyles.iconUp} ${
          order === 'asc' && orderBy === cell.id && tableStyles.iconActive
        }`}
        onClick={(evt) => sortHandler(evt, cell.id, 'asc')}
      />
    </div>
  ));
};

HeaderRow.defaultProps = {
  row: [],
};

export default HeaderRow;
