import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridToolbar,
  GridColDef,
  GridColumnGroupingModel,
} from '@mui/x-data-grid';

import { ptBR } from '@mui/x-data-grid/locales';

const VISIBLE_FIELDS = ['title', 'company', 'director', 'year', 'cinematicUniverse'];

// type CollunsType = {
//     field: keyof Rows
//     groupable: boolean
//     headerName: string
//     width: number
// }
interface PropsType {
  columns: GridColDef[]
  rows: any[]
  columnGrouping?: GridColumnGroupingModel
  loading: boolean
}

export default function DataGridComponent(props: PropsType) {
  const { columns, rows, columnGrouping, loading } = props;
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});

  const handleCellClick = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }

      // Ignore portal
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      setCellModesModel((prevModel) => {
        
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.Edit },
                }),
                {},
              ),
            }),
            {},
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.Edit } }),
              {},
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    [],
  );

  const handleCellModesModelChange = React.useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    [],
  );

  return (
    <Box >
      <DataGrid
        rows={rows}
        loading={loading}
        className='data-grid-container'
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableColumnMenu
        // rowSelection={false}
        // rowHeight={38}        
        hideFooterPagination
        hideFooter={true}
        columns={columns}
        columnGroupingModel={columnGrouping}        
        // cellModesModel={cellModesModel}
        // onCellModesModelChange={handleCellModesModelChange}
        // onCellClick={handleCellClick}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        // slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}
