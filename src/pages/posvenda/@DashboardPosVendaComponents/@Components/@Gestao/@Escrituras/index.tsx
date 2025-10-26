import getGraficosEscrituras, { GraficoEscriturasType, ResGraficosEscriturasType, TimeLineStatusTableType } from "@/apis/getGraficoEscrituras";
import InputSelect from "@/components/InputSelect/Index";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useMemo, useState } from "react";
import Collapse from '@mui/material/Collapse';
import TableEscritura from "./TableEscrituras";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, IconButton, Pagination, TablePagination, } from "@mui/material";

const arrMouth = ['Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const yearNow = new Date().getFullYear();
const limit = yearNow - 1990;
const arrYears = Array.from(new Array(limit), (val, index) => yearNow - index);

export default function Escrituras() {
    const [loading, setLoading] = useState(false);
    const [arrGrafico, setArrGrafico] = useState<GraficoEscriturasType[] | []>([]);
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [ano, setAno] = useState(yearNow);
    const [dataTable, setDataTable] = useState<TimeLineStatusTableType[] | []>([]);
    const [collapseGrafico, setCollapseGrafico] = useState(true);
    const [page, setPage] = useState(0);    
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getGraficos = async () => {
        setLoading(true);
        const res = await getGraficosEscrituras({
            mes: mes,
            ano: ano
        })
        if (res) {
            setArrGrafico(res.grafico_linhas);
            // localStorage.setItem('arrTimeLine', JSON.stringify(res.linha_tempo_status))
            setDataTable(res.linha_tempo_status);
        }
        setLoading(false);
    };

    const paginatedRows = useMemo(() => {
        // const arrData = JSON.parse(localStorage ? localStorage.getItem('arrTimeLine') || '[]' : '[]');        
        const filtered = dataTable;

        // 🔹 Paginação
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;

        return filtered.slice(start, end);
    }, [dataTable, page, rowsPerPage]);

    console.log("paginatedRows: ", paginatedRows);   

    useEffect(() => {
        console.log(mes);
        
        if (mes >= 0 && ano) getGraficos();
    }, [mes, ano]);

    function valueFormatter(value: number | null) {
        return `${value}`;
    };

    const chartSetting = {
        xAxis: [{
            // label: 'Processos'
            tickMinStep: 1
        }],
        height: 400,
        grid: {
            vertical: true,
            horizontal: true
        },
        margin: { left: 200 },
    };

    function TablePaginationActions(props: { page: number; rowsPerPage: number; }) {
        const { page, rowsPerPage, } = props;

        return (
            <Box>
                <Pagination
                    count={Math.ceil((dataTable?.length || 0) / rowsPerPage)} // total de páginas
                    page={page + 1} // MUI é 1-based, mas TablePagination é 0-based
                    onChange={(_, value) => setPage(value - 1)}
                    color="primary"
                    shape="rounded"
                    className="pagination"
                />
            </Box>
        );
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // volta para a página inicial
    };

    const TOTAL_ESCRITURADAS = () => {
        const total = (arrGrafico as GraficoEscriturasType[]).reduce((acc, value) => acc + value.contador_escrituras, 0);
        return total;
    };

    return <div className="escrituras-content">
        <div className="header-title">
            <h2>Equipe de Pós-venda</h2>
            <div className="filters-row">
                <p>Mês</p>
                <InputSelect
                    option={arrMouth.map((mes, i) => ({ name: mes, id: i }))}
                    label={''}
                    value={mes}
                    onChange={(e) => setMes(Number(e.target.value))}
                    name={'mes_select'}
                />

                <p>Ano</p>
                <InputSelect
                    option={arrYears.map((mes, i) => ({ name: mes, id: mes }))}
                    label={''}
                    value={ano}
                    onChange={(e) => setAno(Number(e.target.value))}
                    name={'mes_select'}
                />
            </div>

        </div>
        <div className="grafico-escrituras cards">
            <div className="title-action">
                <h3>Total de processos escriturados</h3>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    className='icon-primary'
                    onClick={() => setCollapseGrafico(!collapseGrafico)}
                >
                    {collapseGrafico ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
            </div>
            <Collapse in={collapseGrafico} timeout="auto" unmountOnExit>
                <div className="grafico-container">
                    {arrGrafico[0] &&
                        <BarChart
                            dataset={arrGrafico}
                            yAxis={[{ scaleType: 'band', data: arrGrafico.map((v) => v.nome_responsavel), }]}
                            series={[{ data: arrGrafico.map((v, i) => v.contador_escrituras) }]}
                            layout="horizontal"
                            {...chartSetting}
                        />}
                </div>
            </Collapse>
            <div className="footer">
                <p>Total - {TOTAL_ESCRITURADAS()}</p>
            </div>
        </div>

        <div className="table-escrituras cards">
            <div className="title-action">
                <h3>Venda mais longa</h3>

                <TablePagination
                    rowsPerPageOptions={[5, 15, 30].filter(e => dataTable.length / e > 0.5 )}
                    component="div"
                    className="pagination-container"
                    count={dataTable?.length || 0}
                    ActionsComponent={TablePaginationActions}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage="Processos por página"
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) =>
                        dataTable?.length > 5
                            ? `Mostrando ${from} a ${to} de ${count !== -1 ? count : `mais de ${to}`}`
                            : `Mostrando ${count} processos`
                    }
                />
            </div>

            <div className="grafico-container">
                {paginatedRows[0] &&
                    <TableEscritura rows={paginatedRows} />
                }
            </div>
            <div className="footer">
                <p>Maior quantidade de dias - {dataTable.sort((a, b) => b.todos_status?.total_dias - a.todos_status?.total_dias)[0]?.todos_status?.total_dias}</p>
            </div>
        </div>
    </div>
}