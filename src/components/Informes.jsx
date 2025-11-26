import React, { useState, useEffect } from "react";
import { getInformes } from "../controller/api";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Toolbar,
  Typography,
  TextField,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { FcDocument } from "react-icons/fc";
import { IoChevronBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function Informes() {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // ordenamiento
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("usuario_name");

  // paginación fija
  const [page, setPage] = useState(0);
  const rowsPerPage = 7;

  // búsqueda
  const [search, setSearch] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  // filtro propios
  const [onlyMine, setOnlyMine] = useState(true);

  const redirectToHome = () => {
    navigate("/");
  };

  const fetchData = async (query = "") => {
    setLoading(true);
    try {
      const response = await getInformes(query);
      setInformes(response);
    } catch (error) {
      console.error("Error al cargar informes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      fetchData(search);
      setPage(0);
    }, 500);
    setTypingTimeout(timeout);
  }, [search]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  // aplicar filtro "propios"
  const filteredInformes = onlyMine
    ? informes.filter((row) => row.usuario === storedUser?.id)
    : informes;

  const visibleRows = [...filteredInformes]
    .sort(getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", px: "5vw", paddingTop: "10vh" }} zIndex={99}>
      <a
        onClick={redirectToHome}
        className="atras"
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <IoChevronBackSharp size={40} color="#e64a19" />
      </a>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          bgcolor: "#121212",
          color: "#fff",
          borderRadius: 2,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{ flex: "1 1 auto", color: "#fff" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Informes
          </Typography>

          {/* Buscador */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              mr: 2,
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#888" },
              },
            }}
          />

          {/* Switch propios */}
          {storedUser.tipoUser === 1 ? (
            <FormControlLabel
              control={
                <Switch
                  checked={onlyMine}
                  onChange={(e) => setOnlyMine(e.target.checked)}
                />
              }
              label="Propios"
              sx={{ color: "#fff" }}
            />
          ) : (
            <></>
          )}
        </Toolbar>

        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="tabla de informes">
            <TableHead>
              <TableRow sx={{ bgcolor: "#000" }}>
                {[
                  { id: "usuario_name", label: "Creador" },
                  { id: "cliente", label: "Cliente" },
                  { id: "empresa", label: "Empresa" },
                  { id: "monto", label: "Monto" },
                  { id: "Comisión", label: "Comisión" },
                  { id: "Total", label: "Total" },
                  { id: "fecha_creacion", label: "Fecha" },
                  { id: "link", label: "Documento" },
                ].map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sx={{ color: "#ff5722", fontWeight: "bold" }}
                  >
                    {headCell.id !== "link" ? (
                      <TableSortLabel sx={{ color: "#ff5722" }}>
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {!informes.length ? (
              <div>No hay informes disponibles</div>
            ) : (
              <TableBody>
                {visibleRows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      bgcolor: index % 2 === 0 ? "#1a1a1a" : "#2a2a2a",
                      "&:hover": { bgcolor: "#333" },
                    }}
                  >
                    <TableCell sx={{ color: "#fff" }}>
                      {row.correo_compartido}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>{row.cliente}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{row.empresa}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      $ {Number(row.monto) - Number(row.monto) * 0.2}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      ${Number(row.monto) * 0.2}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      $ {Number(row.monto)}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      {new Date(row.fecha_creacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <a
                        href={row.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <FcDocument size={24} />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredInformes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]} // 🚫 no modificable
          sx={{ color: "#fff" }}
        />
      </Paper>
    </Box>
  );
}
