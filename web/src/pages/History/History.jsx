import Layout from "~/components/Layout";
import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Checkbox,
  Avatar,
  AvatarGroup,
  InputAdornment,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const History = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const tableHeader = [
    { id: 1, title: "Ngày thanh toán" },
    { id: 2, title: "Tên hóa đơn" },
    { id: 3, title: "Số tiền" },
    { id: 4, title: "Người ứng tiền" },
    { id: 5, title: "Người tham gia" },
    { id: 6, title: "Đã quyết toán" },
  ];

  const billsHistory = [
    {
      id: 1,
      paymentDate: "28/10/2025",
      billName: "Cơm hến O Mân",
      amount: 350000,
      payer: { name: "Vương Ngũ...", avatar: "" },
      participants: [
        { name: "User 1", avatar: "" },
        { name: "User 2", avatar: "" },
        { name: "User 3", avatar: "" },
      ],
      settled: false,
    },
    {
      id: 2,
      paymentDate: "28/10/2025",
      billName: "Cơm hến O Mân",
      amount: 350000,
      payer: { name: "Vương Ngũ...", avatar: "" },
      participants: [
        { name: "User 1", avatar: "" },
        { name: "User 2", avatar: "" },
        { name: "User 3", avatar: "" },
      ],
      settled: false,
    },
    {
      id: 3,
      paymentDate: "28/10/2025",
      billName: "Cơm hến O Mân",
      amount: 350000,
      payer: { name: "Vương Ngũ...", avatar: "" },
      participants: [
        { name: "User 1", avatar: "" },
        { name: "User 2", avatar: "" },
        { name: "User 3", avatar: "" },
      ],
      settled: false,
    },
    {
      id: 4,
      paymentDate: "28/10/2025",
      billName: "Cơm hến O Mân",
      amount: 350000,
      payer: { name: "Vương Ngũ...", avatar: "" },
      participants: [
        { name: "User 1", avatar: "" },
        { name: "User 2", avatar: "" },
        { name: "User 3", avatar: "" },
      ],
      settled: false,
    },
    {
      id: 5,
      paymentDate: "28/10/2025",
      billName: "Cơm hến O Mân",
      amount: 350000,
      payer: { name: "Vương Ngũ...", avatar: "" },
      participants: [
        { name: "User 1", avatar: "" },
        { name: "User 2", avatar: "" },
        { name: "User 3", avatar: "" },
      ],
      settled: false,
    },
    {
      id: 6,
      paymentDate: "28/10/2025",
      billName: "Cơm hến O Mân",
      amount: 350000,
      payer: { name: "Vương Ngũ...", avatar: "" },
      participants: [
        { name: "User 1", avatar: "" },
        { name: "User 2", avatar: "" },
        { name: "User 3", avatar: "" },
      ],
      settled: false,
    },
    {
      id: 7,
      paymentDate: "28/10/2025",
      billName: "Cơm hến O Mân",
      amount: 350000,
      payer: { name: "Vương Ngũ...", avatar: "" },
      participants: [
        { name: "User 1", avatar: "" },
        { name: "User 2", avatar: "" },
        { name: "User 3", avatar: "" },
      ],
      settled: false,
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <Layout>
      <Box className="p-6 md:p-10 min-h-screen bg-white">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#574D98] mb-8">
          Danh sách hóa đơn
        </h1>

        <Box className="mb-6 bg-white rounded-2xl shadow-sm p-6">
          <Box className="flex gap-3 items-center">
            <TextField
              fullWidth
              placeholder="Ngày thanh toán, tên hóa đơn, etc..."
              value={searchText}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#F9FAFB",
                  "& fieldset": {
                    borderColor: "#E5E7EB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D1D5DB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#574D98",
                  },
                },
              }}
            />
            <IconButton
              sx={{
                color: "#574D98",
                backgroundColor: "#F3F4F6",
                "&:hover": {
                  backgroundColor: "#E5E7EB",
                },
                borderRadius: "8px",
                padding: "8px",
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "16px",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8B4B4" }}>
                {tableHeader.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    sx={{
                      color: "#1F2937",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {column.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {billsHistory.map((bill, index) => (
                <TableRow
                  key={bill.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#FFF" : "#FCE7E7",
                    "&:hover": {
                      backgroundColor: index % 2 === 0 ? "#FEF2F2" : "#FCD5D5",
                    },
                  }}
                >
                  <TableCell align="center" sx={{ color: "#374151" }}>
                    {bill.paymentDate}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#374151" }}>
                    {bill.billName}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#374151", fontWeight: 500 }}>
                    {formatCurrency(bill.amount)}đ
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center justify-center gap-2">
                      <Avatar
                        
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: "#D1D5DB",
                          color: "#6B7280",
                          fontSize: "0.875rem",
                        }}
                      >
                        {bill.payer.name.charAt(0)}
                      </Avatar>
                      <span className="text-gray-700">{bill.payer.name}</span>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <AvatarGroup
                      className = "flex justify-center "
                      max={3}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          fontSize: "0.875rem",
                          backgroundColor: "#D1D5DB",
                          color: "#6B7280",
                        },
                      }}
                    >
                      {bill.participants.map((participant, idx) => (
                        <Avatar key={idx}>{participant.name.charAt(0)}</Avatar>
                      ))}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={bill.settled}
                      sx={{
                        color: "#D1D5DB",
                        "&.Mui-checked": {
                          color: "#574D98",
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="flex justify-center mt-8">
          <Pagination
            count={68}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#6B7280",
                "&.Mui-selected": {
                  backgroundColor: "#374151",
                  color: "#FFF",
                  "&:hover": {
                    backgroundColor: "#1F2937",
                  },
                },
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
              },
            }}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default History;
