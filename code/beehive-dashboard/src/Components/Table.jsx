import "../Styles/Components/Table.scss";

/*
Presentational table driven by a column spec, so callers decide labels,
alignment and formatting. It used to take raw data plus a list of keys and
print `row[key]` straight out, which meant the header read "CO2" or
"temperature" and values arrived unrounded and without units.
*/
const Table = ({ rows, columns }) => (
  <table className="data_table">
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={column.align === "right" ? "is-right" : undefined}
            scope="col"
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, index) => (
        <tr key={row.id ?? index}>
          {columns.map((column) => (
            <td
              key={column.key}
              className={column.align === "right" ? "is-right" : undefined}
            >
              {column.render ? column.render(row) : row[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
