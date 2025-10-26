import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TimeLineStatusTableType } from '@/apis/getGraficoEscrituras';
import { Avatar, Chip } from '@mui/material';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import StatusTimeline from './Timeline';

function Row(props: { row: TimeLineStatusTableType }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [rowSelected, setRowSelected] = React.useState(0);

  function stringToColor(string: string) {
    let hash = 0;

    /* eslint-disable no-bitwise */
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Extrai um "Hue" do hash (0 a 360)
    const hue = Math.abs(hash) % 360;
    // Saturação e luminosidade fixas para tons pastéis
    const saturation = 70; // %
    const lightness = 80;  // %

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0]?.[0]?.toUpperCase() || name[0].toUpperCase()}${name.split(' ')[1]?.[0]?.toUpperCase() || ''}`,
    };
  };

  React.useEffect(() => {
    if (!open) setRowSelected(0);
  }, [open]);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} selected={rowSelected === row.processo_id} hover >
        <TableCell component="th" scope="row">
          <div className='avatar'>
            <Avatar {...stringAvatar(row.nome_resposavel)} src='/undefined.img' />
            <Chip className='chip neutral' label={row.nome_resposavel} />
          </div>
        </TableCell>
        <TableCell align="left">
          <div className='endereco'>
            <p>
              {row.logradouro}
              {row.numero && ', ' + row.numero}
              {row.unidade && ' / ' + row.unidade}
              {row.complemento && ' - ' + row.complemento}
            </p>
            <span>
              {row.bairro}
              {row.cidade && ' - ' + row.cidade}
              {row.uf && ' - ' + row.uf}
            </span>
          </div>
        </TableCell>
        <TableCell align="left">
          <div className='forma-pagamento'>
            {row.forma_pagamento.split(',').filter((f) => f !== ' ')?.map((e) => <Chip className='chip neutral' key={e} label={e} />)}
          </div>
        </TableCell>
        <TableCell align="left"><p>{row.todos_status.total_dias}</p></TableCell>
        <TableCell align="left">
          <div className='avatar'>
            <Avatar {...stringAvatar(row.nome_gerente)} src='/undefined.img' />
            <Chip className='chip neutral' label={row.nome_gerente} />
          </div>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            className='icon-primary'
            onClick={() => [setRowSelected(row.processo_id), setOpen(!open)]}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell padding={'none'} sx={{ borderBottom: 'none'}} colSpan={6} className='collapse-container'>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="timeline-container" >
              <p className='p2'>Dias por Status aproximados</p>

              <div className='timeline-content'>
                {open && <StatusTimeline status={row.todos_status.status} processo_id={row.processo_id} />}
              </div>

              <div className='footer-timeline p2'>
                Total - {row.todos_status.total_dias} dias
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface PropsType {
  rows: TimeLineStatusTableType[] | []
}

export default function TableEscritura({ rows }: PropsType) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Pós-venda responsável</TableCell>
            <TableCell align="left">Endereço</TableCell>
            <TableCell align="left">Tipo</TableCell>
            <TableCell align="left">Dias</TableCell>
            <TableCell align="left">Gerente responsável</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <Row key={row.processo_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
